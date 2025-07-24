const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Get all upcoming appointments
router.get('/appointments', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointments = await Booking.find({
      dateTime: { $gte: today },
      status: { $in: ['pending', 'paid', 'confirmed'] }
    }).sort({ dateTime: 1 });
    
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update appointment status
router.put('/appointments/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'paid', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    const appointment = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get booking statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const paidBookings = await Booking.countDocuments({ status: 'paid' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingBookings = await Booking.countDocuments({
      dateTime: { $gte: today },
      status: { $in: ['pending', 'paid', 'confirmed'] }
    });
    
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    // Get revenue (sum of booking prices for completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Get bookings by category
    const bookingsByCategory = await Booking.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalBookings,
      pendingBookings,
      paidBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      totalUsers,
      revenue,
      bookingsByCategory
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user listing
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;