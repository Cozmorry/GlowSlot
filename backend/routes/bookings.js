const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a booking
router.post('/', bookingController.createBooking);

// Add to cart
router.post('/cart', bookingController.addToCart);

// Get cart bookings for a user
router.get('/cart', bookingController.getCartBookings);

// Update booking status
router.post('/updateStatus', bookingController.updateBookingStatus);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router; 