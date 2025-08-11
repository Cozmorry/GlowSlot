import React from 'react';
import { useNotification } from '../context/NotificationContext';

const CartItem = ({ booking, theme }) => {
  const { showError, showSuccess } = useNotification();
  // Format the date and time for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: theme.background,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      borderLeft: '4px solid #FF69B4'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: theme.primary, fontSize: '18px' }}>{booking.service}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to cancel this booking?')) {
                try {
                  const response = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    // Call the parent's onCancel handler to remove from state
                    booking.onCancel && booking.onCancel(booking._id);
                    showSuccess('Booking cancelled successfully');
                  } else {
                    showError('Failed to cancel booking. Please try again.');
                  }
                } catch (error) {
                  console.error('Error canceling booking:', error);
                  showError('Error canceling booking. Please try again.');
                }
              }
            }}
            style={{
              backgroundColor: '#FF69B4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          {booking.status === 'confirmed' && (
            <span style={{ 
              backgroundColor: theme.success,
              color: theme.successText,
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {booking.status}
            </span>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '12px', color: theme.text, fontSize: '14px' }}>
        <p style={{ margin: '4px 0' }}>
          <strong style={{ color: '#FF69B4' }}>Staff:</strong> {booking.staff}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong style={{ color: '#FF69B4' }}>Date & Time:</strong> {formatDateTime(booking.dateTime)}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong style={{ color: '#FF69B4' }}>Booking Name:</strong> {booking.fullName}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong style={{ color: '#FF69B4' }}>Contact:</strong> {booking.phone}
        </p>
        <div style={{ 
          margin: '8px 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <p style={{ 
            margin: '0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FF69B4'
          }}>
            Total: KSH {booking.totalPrice || booking.price || 0}
          </p>
          {booking.paidAmount > 0 && (
            <p style={{ 
              margin: '0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#10B981'
            }}>
              Paid: KSH {booking.paidAmount}
            </p>
          )}
          {booking.balance > 0 && (
            <p style={{ 
              margin: '0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#F59E0B'
            }}>
              Balance: KSH {booking.balance}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
