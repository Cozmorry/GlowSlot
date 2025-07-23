import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

export const hairServices = [
  {
    name: 'Braids',
    price: 'KSH 1500',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/41/54/a9/4154a95fb9105634c1d033373b54cf64.jpg',
  },
  {
    name: 'Artificial locs',
    price: 'KSH 3500',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/37/77/1d/37771d3e74b472b9b0bc830a8fe2f67d.jpg',
  },
  {
    name: 'Natural locs',
    price: 'KSH 1500',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/38/78/74/387874bc65597af6a848928a410683f4.jpg',
  },
  {
    name: 'Retouch',
    price: 'KSH 800',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/0c/30/aa/0c30aa05ee244753a21bbc70785923f3.jpg',
  },
  {
    name: 'Dye',
    price: 'KSH 500',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/71/43/5c/71435cb6594cbaf683e12c20beb4189d.jpg',
  },
  {
    name: 'Wig Installation',
    price: 'KSH 1500',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/a6/19/c1/a619c163f6c14d80a70524e81a66c33c.jpg',
  },
];

export default function Hair() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState('');
  return (
    <div style={{
      background: theme.background,
      minHeight: '100vh',
      padding: '1rem 0.5rem',
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: 500,
      margin: '0 auto',
    }}>
      <h2 style={{ color: theme.accent, fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>HAIR</h2>
      <button
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'block',
        }}
        onClick={() => { console.log('Banner clicked'); navigate('/hair'); }}
        tabIndex={0}
        role="button"
        aria-label="Go to Hair page"
      >
        <div
          style={{
            background: theme.accent + '22',
            borderRadius: 16,
            marginBottom: 16,
            padding: '0.5rem 1rem',
            boxShadow: '0 2px 8px 0 #eee',
            position: 'relative',
          }}
        >
          <img src="https://i.pinimg.com/736x/ff/59/a3/ff59a35d3a66209f0f9759864fbc9a9d.jpg" alt="Wash and Blowdry" style={{ width: '100%', borderRadius: 12, marginBottom: 8, objectFit: 'cover', maxHeight: 120 }} />
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.85)',
            color: '#222',
            fontWeight: 700,
            fontSize: 18,
            padding: '0.3rem 1.2rem',
            borderRadius: 10,
            boxShadow: '0 1px 4px 0 #eee',
          }}>
            WASH AND BLOWDRY INCLUSIVE
          </div>
        </div>
      </button>
      {hairServices.map((service, i) => (
        <div key={service.name} style={{
          background: theme.accent + '22',
          borderRadius: 22,
          marginBottom: 22,
          padding: '1rem 0.8rem',
          boxShadow: '0 2px 12px 0 #eee',
          display: 'flex',
          alignItems: 'center',
        }}>
          <img src={service.img} alt={service.name} style={{ width: 90, height: 90, borderRadius: 16, objectFit: 'cover', marginRight: 18 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{service.name}</div>
            <div style={{ fontSize: 17, color: theme.text, opacity: 0.9 }}>{service.price}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 16, color: theme.accent, fontWeight: 700 }}>
              <FaStar color="#FFD700" size={18} style={{ marginRight: 4 }} />
              <span style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>{service.rating.toFixed(1)}</span>
            </div>
            <button style={{
              background: theme.accent,
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '10px 26px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 6px 0 #eee',
            }} onClick={() => { setSelectedService(service.name); setBookingOpen(true); }}>Book Now</button>
          </div>
        </div>
      ))}
      <BookingForm 
        open={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
        service={selectedService} 
        category="hair"
        onSuccess={() => {
          alert("Booking added to cart successfully!");
          setBookingOpen(false);
        }}
      />
    </div>
  );
} 