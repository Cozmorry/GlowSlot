import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import CartItem from '../components/CartItem';

const isDesktopWidth = () => window.innerWidth >= 900;

export default function Cart() {
  const { theme } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/bookings/cart');
      const data = await res.json();
      
      if (res.ok) {
        setBookings(data);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Network error while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '100%' : 430,
      margin: isDesktop ? undefined : '0 auto',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: isDesktop ? '2rem' : '1rem',
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
        
        {loading ? (
          <div style={{ padding: '20px', color: theme.text }}>Loading...</div>
        ) : error ? (
          <div style={{ 
            padding: '20px',
            color: '#842029',
            backgroundColor: '#F8D7DA',
            border: '1px solid #F5C2C7',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {error}
          </div>
        ) : bookings.length === 0 ? (
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
                booking={booking}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}