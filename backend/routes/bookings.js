const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a booking
router.post('/', bookingController.createBooking);

// Get cart bookings for a user
router.get('/cart', bookingController.getCartBookings);

module.exports = router; 