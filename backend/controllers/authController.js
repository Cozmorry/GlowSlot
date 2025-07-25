const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const { validationResult } = require('express-validator');
const transporter = require('../config/mailer');

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password, role } = req.body;
    
    // Check if required environment variables are set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email environment variables are not set');
      return res.status(500).json({ message: 'Email service not configured' });
    }
    
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
    );
    
    // Only allow 'customer' or 'admin' roles from the client side
    const validRole = role === 'admin' ? 'admin' : 'customer';
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
      verified: false, // Not verified until email is clicked
      emailVerificationToken,
      role: validRole,
    });
    await user.save();
    
    // Send verification email
    const verifyUrl = `${APP_BASE_URL}/verify-email?token=${emailVerificationToken}`;
    try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
        subject: 'Verify your email - GlowSlot',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #e91e63;
              margin-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 16px;
            }
            .message {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 32px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
              color: #ffffff;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
              transition: all 0.2s ease;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(233, 30, 99, 0.4);
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 16px;
              border-radius: 8px;
              margin: 24px 0;
              font-size: 14px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 14px;
              color: #718096;
            }
            .link {
              color: #e91e63;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">✨ GlowSlot</div>
            <h1 class="title">Verify Your Email Address</h1>
            <p class="message">
              Hello ${name},<br><br>
              Welcome to GlowSlot! Please verify your email address to complete your account setup and start booking your beauty services.
            </p>
            
            <a href="${verifyUrl}" class="button">
              Verify Email Address
            </a>
            
            <div class="warning">
              ⏰ <strong>Important:</strong> This verification link will expire in 10 minutes for security reasons.
            </div>
            
            <p class="message">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${verifyUrl}" class="link">${verifyUrl}</a>
            </p>
            
            <div class="footer">
              <p>If you didn't create an account with GlowSlot, you can safely ignore this email.</p>
              <p>© 2025 GlowSlot. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Still create the user but inform about email issue
      return res.status(201).json({ 
        message: 'Account created successfully, but verification email could not be sent. Please contact support.',
        warning: 'Email service temporarily unavailable'
      });
    }
    
    res.status(201).json({ message: 'Signup successful. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log('Email verification request with token:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ message: 'Verification token is required.' });
    }
    
    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    
    const user = await User.findOne({ email: decoded.email, emailVerificationToken: token });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with this token');
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    
    user.verified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    console.log('User verified and saved');
    
    // Auto-login: return a JWT
    const loginToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Login token generated');
    
    res.json({ 
      message: 'Email verified successfully. You are now logged in.', 
      token: loginToken, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        avatar: user.avatar,
        role: user.role
      } 
    });
  } catch (err) {
    console.error('Email verification error:', err);
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
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role } });
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
        verified: true, // Google users are auto-verified
      });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role } });
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
      subject: 'Reset your password - GlowSlot',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #e91e63;
              margin-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 16px;
            }
            .message {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 32px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
              color: #ffffff;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
              transition: all 0.2s ease;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(233, 30, 99, 0.4);
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 16px;
              border-radius: 8px;
              margin: 24px 0;
              font-size: 14px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 14px;
              color: #718096;
            }
            .link {
              color: #e91e63;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">✨ GlowSlot</div>
            <h1 class="title">Reset Your Password</h1>
            <p class="message">
              Hello ${user.name},<br><br>
              We received a request to reset your password for your GlowSlot account. Click the button below to create a new password.
            </p>
            
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
            
            <div class="warning">
              ⏰ <strong>Important:</strong> This reset link will expire in 10 minutes for security reasons.
            </div>
            
            <p class="message">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${resetUrl}" class="link">${resetUrl}</a>
            </p>
            
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <p>© 2025 GlowSlot. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
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
    res.json({ message: 'Password reset successful. You are now logged in.', token: loginToken, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    
    // Use the authenticated user from middleware
    const user = req.user;
    
    // Check if user is trying to update their own profile
    if (req.params.userId !== user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const validateToken = async (req, res) => {
  try {
    // The auth middleware has already verified the token and attached the user
    // We just need to return the user data
    const userResponse = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      role: req.user.role,
      verified: req.user.verified,
      authProvider: req.user.authProvider
    };

    res.json({ 
      message: 'Token is valid', 
      user: userResponse 
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, googleAuth, verifyEmail, forgotPassword, resetPassword, updateProfile, validateToken }; 