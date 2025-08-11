import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { FaHistory, FaShoppingCart, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner } from 'react-icons/fa';

// Simple spinner component
const Spinner = () => (
  <div style={{
    display: 'inline-block',
    width: '24px',
    height: '24px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #e91e63',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }} />
);

const isDesktopWidth = () => window.innerWidth >= 900;

export default function Cart() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const [bookings, setBookings] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'history'

  const calculateTotal = () => {
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  };
  const calculateDeposit = () => Math.round((calculateTotal() / 2) * 100) / 100;

  useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Wait for auth to finish loading before fetching data
    if (!authLoading) {
      fetchBookings();
      fetchOrderHistory();
    }
  }, [authLoading]);  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      if (!user) {
        setError('Please login to view your bookings');
        setLoading(false);
        return;
      }
      
      if (!user.id) {
        setError('Please login to view your bookings');
        setLoading(false);
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/bookings/cart?userId=${user.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setBookings(Array.isArray(data) ? data : []);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Network error while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        return;
      }
      
      if (!user.id) {
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/bookings/history?userId=${user.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setOrderHistory(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheckCircle size={16} color="#10B981" />;
      case 'confirmed':
        return <FaCheckCircle size={16} color="#3B82F6" />;
      case 'completed':
        return <FaCheckCircle size={16} color="#059669" />;
      case 'cancelled':
        return <FaTimesCircle size={16} color="#EF4444" />;
      case 'pending':
        return <FaClock size={16} color="#F59E0B" />;
      default:
        return <FaSpinner size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#10B981';
      case 'confirmed':
        return '#3B82F6';
      case 'completed':
        return '#059669';
      case 'cancelled':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid - Pending Allocation';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  // Show loading while auth is still loading
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        color: theme.text
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spinner />
          <div style={{ marginTop: '12px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // If the error is about not being logged in, show a nicer message with a login button
    if (error.includes('Please login')) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          padding: '20px',
          textAlign: 'center',
          color: theme.text
        }}>
          <div style={{ marginBottom: '20px', fontSize: '18px' }}>
            Please login to view your bookings
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 24px',
              background: theme.accent,
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Login Now
          </button>
        </div>
      );
    }
    
    return <div style={{ 
      color: 'red', 
      padding: '20px', 
      textAlign: 'center',
      marginTop: '20px'
    }}>{error}</div>;
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '100%' : 430,
      margin: isDesktop ? undefined : '0 auto',
      padding: isDesktop ? '2rem' : '1rem',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.text,
      background: theme.background,
    }}>
      <div style={{
        width: isDesktop ? 420 : '100%',
        maxWidth: '100%',
        background: theme.card,
        borderRadius: 24,
        boxShadow: isDesktop ? '0 2px 16px 0 #eee' : 'none',
        padding: isDesktop ? '2.5rem 2rem 2rem 2rem' : '1.5rem 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        color: theme.text,
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: theme.text }}>My Bookings</h2>
        
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          width: '100%',
          marginBottom: 24,
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <button
            onClick={() => setActiveTab('cart')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'cart' ? theme.accent : 'transparent',
              color: activeTab === 'cart' ? 'white' : theme.text,
              border: 'none',
              borderBottom: activeTab === 'cart' ? `2px solid ${theme.accent}` : 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FaShoppingCart size={16} />
            Cart ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'history' ? theme.accent : 'transparent',
              color: activeTab === 'history' ? 'white' : theme.text,
              border: 'none',
              borderBottom: activeTab === 'history' ? `2px solid ${theme.accent}` : 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <FaHistory size={16} />
            Order History ({orderHistory.length})
          </button>
        </div>
        
        {activeTab === 'cart' ? (
          // Cart Tab
          <>
            {bookings.length === 0 ? (
              <div style={{ 
                textAlign: 'center',
                padding: '40px',
                backgroundColor: theme.card,
                borderRadius: '8px',
                color: theme.text,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                No bookings found. Start by booking a service!
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {bookings.map(booking => (
                  <CartItem 
                    key={booking._id} 
                    booking={{
                      ...booking,
                      onCancel: (bookingId) => {
                        setBookings(currentBookings => 
                          currentBookings.filter(b => b._id !== bookingId)
                        );
                      }
                    }}
                    theme={theme}
                  />
                ))}
                <div style={{
                  marginTop: '20px',
                  borderTop: `1px solid ${theme.border}`,
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: '#FF69B4' }}>KSH {calculateTotal()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#718096' }}>
                    Deposit (50%): KSH {calculateDeposit()} • Balance due on completion: KSH {Math.max(0, calculateTotal() - calculateDeposit())}
                  </div>
                  <button
                    onClick={() => {
                      const total = calculateTotal();
                      localStorage.setItem('cartTotal', total);
                      navigate('/checkout', { state: { total } });
                    }}
                    style={{
                      backgroundColor: bookings.length === 0 ? '#ffc0dc' : '#FF69B4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      cursor: bookings.length === 0 ? 'not-allowed' : 'pointer',
                      width: '100%',
                      transition: 'background-color 0.2s',
                      opacity: bookings.length === 0 ? 0.7 : 1
                    }}
                    disabled={bookings.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Order History Tab
          <>
            {orderHistory.length === 0 ? (
              <div style={{ 
                textAlign: 'center',
                padding: '40px',
                backgroundColor: theme.card,
                borderRadius: '8px',
                color: theme.text,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                No order history found. Your completed orders will appear here!
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {orderHistory.map(order => (
                  <div
                    key={order._id}
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 16,
                      background: theme.card,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 12,
                    }}>
                      <div>
                        <h3 style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 600,
                          color: theme.text,
                        }}>
                          {order.service}
                        </h3>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: 14,
                          color: theme.text,
                          opacity: 0.7,
                        }}>
                          Staff: {order.staff}
                        </p>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: 14,
                          color: theme.text,
                          opacity: 0.7,
                        }}>
                          Date: {new Date(order.dateTime).toLocaleDateString()}
                        </p>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: 14,
                          color: theme.text,
                          opacity: 0.7,
                        }}>
                          Time: {new Date(order.dateTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 20,
                        background: `${getStatusColor(order.status)}20`,
                        border: `1px solid ${getStatusColor(order.status)}40`,
                      }}>
                        {getStatusIcon(order.status)}
                        <span style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: getStatusColor(order.status),
                        }}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 12,
                      borderTop: `1px solid ${theme.border}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}>
                        <span style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: theme.text,
                        }}>
                          Total: KSH {order.totalPrice || order.price}
                        </span>
                        <span style={{
                          fontSize: 14,
                          color: '#10B981',
                          fontWeight: 500,
                        }}>
                          Paid: KSH {order.paidAmount || 0}
                        </span>
                        {order.balance > 0 && (
                          <span style={{
                            fontSize: 14,
                            color: '#F59E0B',
                            fontWeight: 500,
                          }}>
                            Balance: KSH {order.balance}
                          </span>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        alignItems: 'flex-end'
                      }}>
                        {order.status === 'paid' && (
                          <span style={{
                            fontSize: 12,
                            color: '#F59E0B',
                            fontStyle: 'italic',
                          }}>
                            Awaiting admin confirmation
                          </span>
                        )}
                        {/* Cancel button for confirmed/paid appointments */}
                        {(order.status === 'confirmed' || order.status === 'paid') && (
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                try {
                                  const response = await fetch(`http://localhost:5000/api/bookings/${order._id}/cancel`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ userId: user.id })
                                  });
                                  
                                  if (response.ok) {
                                    showSuccess('Appointment cancelled successfully');
                                    // Refresh order history
                                    fetchOrderHistory();
                                  } else {
                                    const data = await response.json();
                                    showError(data.message || 'Failed to cancel appointment');
                                  }
                                } catch (error) {
                                  console.error('Error cancelling appointment:', error);
                                  showError('Error cancelling appointment. Please try again.');
                                }
                              }
                            }}
                            style={{
                              backgroundColor: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}