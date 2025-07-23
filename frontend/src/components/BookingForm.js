import React, { useState } from 'react';


import Modal from './Modal';

export default function BookingForm({ open, onClose, service, onSuccess }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName, 
          phone, 
          service, 
          dateTime,
          // If you have a logged-in user, you should include userId
          // userId: localStorage.getItem('userId') || null 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Show success message and close modal
        alert(data.message || 'Booking successful! You can view your booking in the cart.');
        onSuccess && onSuccess(data.booking);
        onClose();
      } else {
        console.error('Booking error:', data);
        setError(data.message || 'Booking failed. Please try again or contact support.');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>BOOKING FORM</h2>
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
        />
        <input
          type="text"
          value={service}
          readOnly
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, background: '#f3e6f7' }}
        />
        <input
          type="datetime-local"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
        />
        {error && <div style={{ color: 'red', fontSize: 15 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 12, padding: '0.7rem 2.5rem', background: '#D72660', color: '#fff', border: 'none', borderRadius: 24, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          {loading ? 'Booking...' : 'Done'}
        </button>
      </form>
    </Modal>
  );
} 