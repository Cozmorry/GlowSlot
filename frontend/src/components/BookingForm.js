import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from './Modal';
import { getServiceDuration } from '../data/servicePrices';

export default function BookingForm({ open, onClose, service, onSuccess, category }) {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD
  const [availability, setAvailability] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(''); // ISO string
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // Fetch availability when date selected and modal open
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!open || !selectedDate || !service) return;
      try {
        const duration = getServiceDuration(service);
        const url = `http://localhost:5000/api/bookings/availability?service=${encodeURIComponent(service)}&date=${encodeURIComponent(selectedDate)}&durationMinutes=${duration}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setAvailability(data);
        } else {
          setAvailability(null);
          showError(data.message || 'Failed to load availability');
        }
      } catch (e) {
        setAvailability(null);
        showError('Network error while loading availability');
      }
    };
    fetchAvailability();
  }, [open, selectedDate, service, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user is logged in
      if (!user) {
        showError('Please login to make a booking');
        setLoading(false);
        return;
      }
      
      if (!user.id) {
        showError('Please login to make a booking');
        setLoading(false);
        return;
      }
      
      if (!selectedDate) {
        showError('Please select a date');
        setLoading(false);
        return;
      }

      if (!selectedStaff || !selectedSlot) {
        showError('Please pick an available staff and time slot');
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
          dateTime: selectedSlot,
          userId,
          category: serviceCategory,
          staff: selectedStaff
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Show success message and close modal
        showSuccess(data.message || 'Booking successful! You can view your booking in the cart.');
        onSuccess && onSuccess(data.booking);
        onClose();
      } else {
        console.error('Booking error:', data);
        showError(data.message || 'Booking failed. Please try again or contact support.');
      }
    } catch (err) {
      console.error('Error in booking:', err);
      showError('Network error. Please check your connection and try again.');
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
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="date"
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value);
              setSelectedStaff('');
              setSelectedSlot('');
            }}
            required
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
        </div>

        {selectedDate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>Available staff and times</div>
            {!availability && (
              <div style={{ color: '#888' }}>Loading availability...</div>
            )}
            {availability && availability.staff && availability.staff.length === 0 && (
              <div style={{ color: '#c00' }}>No available staff for this service on the selected date.</div>
            )}
            {availability && availability.staff && availability.staff.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto' }}>
                {availability.staff.map(s => (
                  <div key={s.name} style={{ border: '1px solid #eee', borderRadius: 8, padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      {s.avatar && <img src={s.avatar} alt={s.name} width={28} height={28} style={{ borderRadius: '50%' }} />}
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ color: '#888', fontSize: 12 }}>{s.specialties}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {s.slots.slice(0, 12).map(slot => {
                        const isSelected = selectedStaff === s.name && selectedSlot === slot;
                        const timeLabel = new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => { setSelectedStaff(s.name); setSelectedSlot(slot); }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 6,
                              border: isSelected ? '2px solid #D72660' : '1px solid #ddd',
                              background: isSelected ? '#D72660' : '#fff',
                              color: isSelected ? '#fff' : '#333',
                              cursor: 'pointer'
                            }}
                          >
                            {timeLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {error && <div style={{ color: 'red', fontSize: 15 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 12, padding: '0.7rem 2.5rem', background: '#D72660', color: '#fff', border: 'none', borderRadius: 24, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          {loading ? 'Booking...' : 'Done'}
        </button>
      </form>
    </Modal>
  );
} 