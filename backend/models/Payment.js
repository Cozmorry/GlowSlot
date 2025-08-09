const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'final'], required: true },
  method: { type: String, default: 'unknown' },
  createdAt: { type: Date, default: Date.now },
});

paymentSchema.index({ bookingId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema);


