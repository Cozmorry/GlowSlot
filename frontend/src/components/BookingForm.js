import React, { useState } from 'react';

import Modal from './Modal';

export default function BookingForm({ open, onClose, service, onSuccess, category }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user is logged in
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        setError('Please login to make a booking');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userJson);
      if (!user || !user.id) {
        setError('Please login to make a booking');
        setLoading(false);
        return;
      }
      

      const userId = user.id;
      // Determine the category based on the service name or use the provided category
      let serviceCategory = category || 'general';
      
      // Logic to determine category from service if not provided
      if (!category) {
        const serviceKeywords = {
          'hair': ['hair', 'braid', 'loc', 'wig', 'cut', 'dye', 'style', 'perm', 'weave'],
          'nails': ['nail', 'manicure', 'pedicure', 'polish', 'gel'],
          'spa': ['massage', 'facial', 'scrub', 'body', 'therapy', 'treat'],
          'waxing': ['wax', 'thread', 'hair removal', 'eyebrow'],
          'makeup': ['makeup', 'lash', 'brow', 'face', 'glam'],
          'barber': ['beard', 'shave', 'trim', 'fade', 'cut'],
          'piercing': ['pierce', 'earring', 'nose', 'body'],
          'tattoo': ['tattoo', 'ink', 'design']
        };
        
        const lowerService = service.toLowerCase();
        for (const [cat, keywords] of Object.entries(serviceKeywords)) {
          if (keywords.some(keyword => lowerService.includes(keyword))) {
            serviceCategory = cat;
            break;
          }
        }
      }
      
      console.log('Sending booking with category:', serviceCategory);

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName, 
          phone, 
          service, 
          dateTime,
          userId,
          category: serviceCategory
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
      console.error('Error in booking:', err);
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