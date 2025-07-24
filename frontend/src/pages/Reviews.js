import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaStar, FaUser, FaCalendar, FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import { staffData } from '../data/staffData';
import MainLayout from '../components/MainLayout';

export default function Reviews() {
  const { theme, mode } = useTheme();
  const { user: authUser, getToken } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 900);
  const [reviews, setReviews] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = getToken();
      console.log('Reviews page - Fetching reviews with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:5000/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Reviews page - Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews page - Reviews data received:', data);
        setReviews(data);
      } else {
        const errorText = await response.text();
        console.error('Reviews page - Response error:', errorText);
      }
    } catch (error) {
      console.error('Reviews page - Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedStaff || !comment.trim()) {
      showError('Please select a staff member and write a review');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          staffId: selectedStaff,
          rating,
          comment: comment.trim(),
          customerId: authUser.id
        })
      });

      if (response.ok) {
        showSuccess('Review submitted successfully!');
        setSelectedStaff('');
        setRating(5);
        setComment('');
        setShowReviewForm(false);
        fetchReviews();
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to submit review');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = async (reviewId, updatedData) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        showSuccess('Review updated successfully!');
        setEditingReview(null);
        fetchReviews();
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to update review');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showSuccess('Review deleted successfully!');
        fetchReviews();
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to delete review');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        size={interactive ? 24 : 16}
        color={index < rating ? '#fbbf24' : '#e5e7eb'}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
        onMouseEnter={(e) => {
          if (interactive) {
            e.target.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (interactive) {
            e.target.style.transform = 'scale(1)';
          }
        }}
      />
    ));
  };

  const getAverageRating = (staffId) => {
    const staffReviews = reviews.filter(review => 
      review.staffId === staffId || review.staffId === staffId.toString() || review.staffId === parseInt(staffId)
    );
    if (staffReviews.length === 0) return 0;
    
    const totalRating = staffReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / staffReviews.length).toFixed(1);
  };

  const getReviewsForStaff = (staffId) => {
    console.log('Getting reviews for staff ID:', staffId, 'Type:', typeof staffId);
    console.log('All reviews:', reviews);
    
    const filteredReviews = reviews.filter(review => {
      const matches = review.staffId === staffId || review.staffId === staffId.toString() || review.staffId === parseInt(staffId);
      console.log(`Review ${review._id}: staffId=${review.staffId} (${typeof review.staffId}), matches=${matches}`);
      return matches;
    });
    
    console.log('Filtered reviews for staff', staffId, ':', filteredReviews);
    return filteredReviews;
  };

  return (
    <MainLayout>
      <style>
        {`
          select option {
            background-color: ${mode === 'dark' ? '#2d3748' : '#ffffff'};
            color: ${mode === 'dark' ? '#ffffff' : '#000000'};
            padding: 8px;
          }
          select option:hover {
            background-color: ${mode === 'dark' ? '#4a5568' : '#f7fafc'};
          }
        `}
      </style>
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '900px' : 'calc(100% - 2rem)',
        margin: '0 auto',
        padding: isDesktop ? '2rem' : '1rem',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.text,
        background: mode === 'dark' 
          ? 'rgba(45, 55, 72, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: isDesktop ? '2.5rem' : '2rem',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: isDesktop ? '2.5rem' : '2rem',
            fontWeight: '700',
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)'
              : 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 0.5rem 0'
          }}>
            Staff Reviews
          </h1>
          <p style={{
            fontSize: isDesktop ? '1.1rem' : '1rem',
            color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Share your experience with our amazing staff members
          </p>
        </div>

        {/* Review Form Button */}
        {authUser && authUser.role !== 'admin' && (
          <div style={{
            width: '100%',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                padding: '1rem 2rem',
                background: theme.accent,
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                fontSize: isDesktop ? '1rem' : '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(233, 30, 99, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(233, 30, 99, 0.3)';
              }}
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && authUser && authUser.role !== 'admin' && (
          <div style={{
            width: '100%',
            background: mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.8)' 
              : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            padding: isDesktop ? '2rem' : '1.5rem',
            marginBottom: '2rem',
            border: mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: isDesktop ? '1.4rem' : '1.2rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: theme.text
            }}>
              Write Your Review
            </h3>
            
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: theme.text
                }}>
                  Select Staff Member
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    background: mode === 'dark' ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: theme.text,
                    fontSize: '1rem'
                  }}
                  required
                >
                  <option value="">Choose a staff member...</option>
                  {staffData.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.specialties}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: theme.text
                }}>
                  Rating
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {renderStars(rating, true, setRating)}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  marginTop: '0.5rem'
                }}>
                  {rating} out of 5 stars
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: theme.text
                }}>
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this staff member..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                    color: theme.text,
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: isSubmitting ? '#9ca3af' : theme.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Staff Reviews */}
        <div style={{ width: '100%' }}>
          <h2 style={{
            fontSize: isDesktop ? '1.8rem' : '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: theme.text,
            textAlign: 'center'
          }}>
            Staff Reviews
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {staffData.map(staff => {
              const staffReviews = getReviewsForStaff(staff.id);
              const averageRating = getAverageRating(staff.id);
              
              return (
                <div key={staff.id} style={{
                  background: mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.8)' 
                    : 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '16px',
                  padding: isDesktop ? '1.5rem' : '1rem',
                  border: mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* Staff Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={staff.avatar} 
                      alt={staff.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid rgba(233, 30, 99, 0.2)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: isDesktop ? '1.3rem' : '1.1rem',
                        fontWeight: '600',
                        margin: '0 0 0.3rem 0',
                        color: theme.text
                      }}>
                        {staff.name}
                      </h3>
                      <p style={{
                        fontSize: '0.9rem',
                        color: theme.accent,
                        margin: '0 0 0.3rem 0',
                        fontWeight: '500'
                      }}>
                        {staff.specialties}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {renderStars(parseFloat(averageRating))}
                        <span style={{
                          fontSize: '0.9rem',
                          color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                          marginLeft: '0.5rem'
                        }}>
                          {averageRating} ({staffReviews.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {staffReviews.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      {staffReviews.map(review => (
                        <div key={review._id} style={{
                          background: mode === 'dark' 
                            ? 'rgba(45, 55, 72, 0.5)' 
                            : 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '12px',
                          padding: '1rem',
                          border: mode === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.05)' 
                            : '1px solid rgba(0, 0, 0, 0.05)'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {renderStars(review.rating)}
                              <span style={{
                                fontSize: '0.9rem',
                                color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                              }}>
                                by {review.customerName}
                              </span>
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                            }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p style={{
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            color: mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            margin: 0
                          }}>
                            "{review.comment}"
                          </p>
                          
                          {/* Edit/Delete buttons for admin or review owner */}
                          {(authUser?.role === 'admin' || review.customerId === authUser?.id) && (
                            <div style={{
                              display: 'flex',
                              gap: '0.5rem',
                              marginTop: '0.8rem'
                            }}>
                              <button
                                onClick={() => {
                                  setEditingReview(review);
                                  // Scroll to top when modal opens
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                style={{
                                  padding: '0.3rem 0.6rem',
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  color: '#3b82f6',
                                  border: '1px solid rgba(59, 130, 246, 0.2)',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <FaEdit size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                style={{
                                  padding: '0.3rem 0.6rem',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <FaTrash size={12} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
                    }}>
                      No reviews yet. Be the first to review {staff.name}!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Review Modal */}
        {editingReview && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem 1rem',
            overflow: 'auto'
          }}>
            <div style={{
              background: mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              marginTop: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: theme.text
              }}>
                Edit Review
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: theme.text
                }}>
                  Rating
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {renderStars(editingReview.rating, true, (newRating) => 
                    setEditingReview({...editingReview, rating: newRating})
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: theme.text
                }}>
                  Review
                </label>
                <textarea
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({...editingReview, comment: e.target.value})}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                    color: theme.text,
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <button
                  onClick={() => handleEditReview(editingReview._id, {
                    rating: editingReview.rating,
                    comment: editingReview.comment
                  })}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: theme.accent,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Update Review
                </button>
                <button
                  onClick={() => setEditingReview(null)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 