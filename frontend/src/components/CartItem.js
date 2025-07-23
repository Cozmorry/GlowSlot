import React from 'react';

const CartItem = ({ booking, theme }) => {
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
        <span style={{ 
          backgroundColor: booking.status === 'pending' ? theme.warning : theme.success,
          color: booking.status === 'pending' ? theme.warningText : theme.successText,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {booking.status}
        </span>
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
      </div>
    </div>
  );
};

export default CartItem;
