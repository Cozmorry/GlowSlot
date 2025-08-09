import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/Modal';
import mpesaLogo from '../assets/mpesa-logo.svg';

export default function Checkout() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [showMpesa, setShowMpesa] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const total = Number(window.location?.state?.total || localStorage.getItem('cartTotal') || 0);
  const deposit = Math.round((total / 2) * 100) / 100;

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
      
      if (!user || !user.id) {
        showError('Please login to complete your booking');
        navigate('/login');
        return;
      }
      const userId = user.id;

      // Update booking status to paid (pending admin confirmation)
      const response = await fetch('http://localhost:5000/api/bookings/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'paid',
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
      showSuccess('Payment successful! Your booking is paid and pending admin confirmation.');
      navigate('/cart');
    } catch (error) {
      console.error('Error updating booking status:', error);
      showError(error.message || 'Error updating booking status. Please try again.');
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
        <h3 style={{ marginBottom: '10px' }}>Your total is KSH {total}</h3>
        <div style={{
          background: '#fff',
          border: '1px solid #eee',
          borderRadius: 8,
          padding: '12px 14px',
          color: '#2d3748',
          marginBottom: 16
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Deposit required: KSH {deposit}</div>
          <div style={{ fontSize: 14, color: '#718096' }}>
            You will be charged <strong>KSH {deposit}</strong> upfront (50%). The remaining <strong>KSH {total - deposit}</strong> will be due after the service is completed.
          </div>
        </div>
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
            <p style={{ margin: '10px 0', color: theme.accent }}>Amount to pay now (50%): KSH {deposit}</p>
            <button
              onClick={() => setShowConfirm(true)}
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
              {loading ? 'Processing...' : `Pay KSH ${deposit} with M‑Pesa`}
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
            <p style={{ margin: '10px 0', color: theme.accent }}>Amount to pay now (50%): KSH {deposit}</p>
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
      {/* Payment Confirmation Modal */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <img src={mpesaLogo} alt="M‑Pesa" style={{ height: 36, objectFit: 'contain' }} />
          <h3 style={{ margin: '6px 0 0 0', fontSize: 18, fontWeight: 800, color: '#2d3748' }}>Confirm Payment</h3>
          <div style={{ fontSize: 14, color: '#4a5568' }}>
            You are about to pay <strong>KSH {deposit}</strong> to <strong>GlowSlot</strong> via M‑Pesa.
          </div>
          <button
            onClick={handleDone}
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '10px 18px',
              background: loading ? '#a8d4aa' : '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
