const mongoose = require('mongoose');const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google users
  authProvider: { type: String, enum: ['google', 'local'], required: true },
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  firebaseUid: { type: String },
});

module.exports = mongoose.model('User', userSchema); 