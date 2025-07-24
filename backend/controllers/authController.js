const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const { validationResult } = require('express-validator');
const transporter = require('../config/mailer');

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5000';

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a JWT verification token with 10 min expiry
    const emailVerificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );// Only allow 'customer' or 'admin' roles from the client side
    const validRole = role === 'admin' ? 'admin' : 'customer';
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
      verified: false,
      emailVerificationToken,
      role: validRole,
    });
    await user.save();
    // Create user in Firebase Auth
    try {
      const fbUser = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });
      user.firebaseUid = fbUser.uid;
      await user.save();
    } catch (fbErr) {
      // If Firebase user already exists, fetch UID and save it
      if (fbErr.code === 'auth/email-already-exists') {
        const fbUser = await admin.auth().getUserByEmail(email);
        user.firebaseUid = fbUser.uid;
        await user.save();
      } else {
        // Optionally: rollback Mongo user if Firebase fails
        await User.deleteOne({ _id: user._id });
        return res.status(500).json({ message: 'Error creating user in Firebase', error: fbErr.message });
      }
    }
    // Send verification email
    const verifyUrl = `${APP_BASE_URL}/auth/verify-email?token=${emailVerificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Hello ${name},</p><p>Please verify your email by clicking the link below. This link will expire in 10 minutes:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });
    res.status(201).json({ message: 'Signup successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }
    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    const user = await User.findOne({ email: decoded.email, emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    user.verified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    // Auto-login: return a JWT
    const loginToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Email verified successfully. You are now logged in.', token: loginToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, authProvider: 'local' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'No ID token provided.' });
    }
    // Verify the ID token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { name, email, uid } = decodedToken;
    if (!email) {
      return res.status(400).json({ message: 'Google account does not have an email.' });
    }
    let user = await User.findOne({ email, authProvider: 'google' });
    if (!user) {
      user = new User({
        name: name || 'Google User',
        email,
        authProvider: 'google',
        verified: true,
      });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const user = await User.findOne({ email, authProvider: 'local' });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
    user.emailVerificationToken = resetToken; // reuse field for reset
    await user.save();
    const resetUrl = `${APP_BASE_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      html: `<p>Hello ${user.name},</p><p>Click the link below to reset your password. This link will expire in 10 minutes:</p><a href="${resetUrl}">${resetUrl}</a>`
    });
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required.' });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    const user = await User.findOne({ email: decoded.email, emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.emailVerificationToken = undefined;
    await user.save();
    // Auto-login after reset
    const loginToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Password reset successful. You are now logged in.', token: loginToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { signup, login, googleAuth, verifyEmail, forgotPassword, resetPassword }; 