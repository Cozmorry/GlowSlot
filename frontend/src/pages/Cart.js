import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

const isDesktopWidth = () => window.innerWidth >= 900;

export default function Cart() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calculateTotal = () => {
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        setError('Please login to view your bookings');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userJson);
      if (!user || !user.id) {
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

  if (loading) {
    return <div>Loading...</div>;
  }if (error) {
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
      </div>
    </div>
  );
}