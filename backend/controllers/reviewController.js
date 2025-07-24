const Review = require('../models/Review');
const User = require('../models/User');
const { staffData } = require('../data/staffData');

console.log('Backend staffData loaded:', staffData.length, 'staff members');
console.log('First staff member:', staffData[0]);

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new review
  const createReview = async (req, res) => {
    try {
      const { staffId, rating, comment, customerId } = req.body;
      
      console.log('Creating review with data:', { staffId, rating, comment, customerId });
      console.log('Available staff IDs:', staffData.map(staff => staff.id));

    // Validate input
    if (!staffId || !rating || !comment || !customerId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the staff member (convert staffId to number for comparison)
    const parsedStaffId = parseInt(staffId);
    console.log('Looking for staff ID:', parsedStaffId, 'Type:', typeof parsedStaffId);
    const staffMember = staffData.find(staff => staff.id === parsedStaffId);
    console.log('Found staff member:', staffMember);
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Get customer name
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if customer already reviewed this staff member
    const existingReview = await Review.findOne({ 
      customerId: customerId, 
      staffId: staffId 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this staff member' });
    }

    // Create the review
    const review = new Review({
      customerId,
      customerName: customer.name,
      staffId,
      staffName: staffMember.name,
      rating,
      comment: comment.trim()
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user can edit this review (admin or review owner)
    if (review.customerId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment.trim();
    review.updatedAt = Date.now();

    await review.save();
    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user can delete this review (admin or review owner)
    if (review.customerId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews by staff member
const getReviewsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const reviews = await Review.find({ staffId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching staff reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews by customer
const getReviewsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const reviews = await Review.find({ customerId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByStaff,
  getReviewsByCustomer
}; 