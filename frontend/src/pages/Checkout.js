import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Checkout() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showMpesa, setShowMpesa] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [loading, setLoading] = useState(false);
  const total = window.location?.state?.total || localStorage.getItem('cartTotal') || 0;

  const handleMpesaClick = () => {
    setShowMpesa(true);
    setShowPaypal(false);
  };

  const handlePaypalClick = () => {
    setShowMpesa(false);
    setShowPaypal(true);
  };

  const handleDone = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.id) {
        alert('Please login to complete your booking');
        navigate('/login');
        return;
      }
      const userId = user.id;

      // Update booking status to confirmed
      const response = await fetch('http://localhost:5000/api/bookings/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'confirmed',
          userId: userId
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      // Success flow
      localStorage.removeItem('cartTotal');
      alert('Payment successful! Your booking is confirmed.');
      navigate('/cart');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(error.message || 'Error updating booking status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      color: theme.text,
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Checkout</h2>
      <div style={{
        backgroundColor: theme.card,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Your total is KSH {total}</h3>
        <h4>Choose your mode of payment</h4>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button
            onClick={handleMpesaClick}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #eee',
              backgroundColor: 'white',
              cursor: 'pointer',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60px'
            }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/2560px-M-PESA_LOGO-01.svg.png" 
              alt="M-PESA"
              style={{ height: '40px', objectFit: 'contain' }}
            />
          </button>
          <button
            onClick={handlePaypalClick}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #eee',
              backgroundColor: 'white',
              cursor: 'pointer',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60px'
            }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png" 
              alt="PayPal"
              style={{ height: '30px', objectFit: 'contain' }}
            />
          </button>
        </div>

        {showMpesa && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: theme.background,
            borderRadius: '8px'
          }}>
            <h4>Send Money to:</h4>
            <p style={{ fontSize: '18px', margin: '10px 0' }}>+254 769 586655</p>
            <p style={{ margin: '10px 0', color: theme.accent }}>Amount: KSH {total}</p>
            <button
              onClick={handleDone}
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: loading ? '#a8d4aa' : '#4CAF50',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                width: '100%'
              }}
            >
              {loading ? 'Processing...' : 'Done'}
            </button>
          </div>
        )}

        {showPaypal && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: theme.background,
            borderRadius: '8px'
          }}>
            <h4>Send payment to:</h4>
            <p style={{ fontSize: '18px', margin: '10px 0' }}>sharon@gmail.com</p>
            <p style={{ margin: '10px 0', color: theme.accent }}>Amount: KSH {total}</p>
            <button
              onClick={handleDone}
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: loading ? '#a8d4aa' : '#4CAF50',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                width: '100%'
              }}
            >
              {loading ? 'Processing...' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
