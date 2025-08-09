const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Availability lookup
router.get('/availability', bookingController.getAvailability);

// Create a booking
router.post('/', bookingController.createBooking);

// Add to cart
router.post('/cart', bookingController.addToCart);

// Get cart bookings for a user
router.get('/cart', bookingController.getCartBookings);

// Get order history for a user
router.get('/history', bookingController.getOrderHistory);

// Update booking status
router.post('/updateStatus', bookingController.updateBookingStatus);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router; 