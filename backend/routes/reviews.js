const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Get all reviews (public)
router.get('/', reviewController.getAllReviews);

// Create a new review (authenticated users only)
router.post('/', auth, reviewController.createReview);

// Update a review (authenticated users - owner or admin)
router.put('/:id', auth, reviewController.updateReview);

// Delete a review (authenticated users - owner or admin)
router.delete('/:id', auth, reviewController.deleteReview);

// Get reviews by staff member (public)
router.get('/staff/:staffId', reviewController.getReviewsByStaff);

// Get reviews by customer (authenticated users - owner or admin)
router.get('/customer/:customerId', auth, reviewController.getReviewsByCustomer);

module.exports = router; 