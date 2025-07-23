import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaStar } from 'react-icons/fa';
import BookingForm from '../components/BookingForm';

export const barberServices = [
  {
    name: 'Taper Fade',
    price: 'KSH 1500',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/e9/a0/fe/e9a0fe043853fb654f056fdcbd5b08e7.jpg',
  },
  {
    name: 'Clean Shave',
    price: 'KSH 2000',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/f0/3b/03/f03b03f13880782510af2ef8ec251405.jpg',
  },
  {
    name: 'Classic cut',
    price: 'KSH 1000',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/44/42/05/444205000d075f20a95c0342c73c095f.jpg',
  },
  {
    name: 'Beard Grooming',
    price: 'KSH 1000',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/3f/1b/0d/3f1b0dec04024d82937fa4c2afb3fd36.jpg',
  },
];

export default function Barber() {
  const { theme } = useTheme();
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
      <h2 style={{ color: theme.accent, fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>BARBER</h2>
      <div style={{
        background: theme.accent + '22',
        borderRadius: 16,
        marginBottom: 16,
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 8px 0 #eee',
        position: 'relative',
      }}>
        <img src="https://i.pinimg.com/736x/c0/99/87/c099873629478e002acaabd9697bff6b.jpg" alt="Wash and Blowdry" style={{ width: '100%', borderRadius: 12, marginBottom: 8, objectFit: 'cover', maxHeight: 120 }} />
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
      {barberServices.map((service) => (
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
      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} service={selectedService} />
    </div>
  );
} 