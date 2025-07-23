import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaStar } from 'react-icons/fa';
import BookingForm from '../components/BookingForm';

export const nailsServices = [
  {
    name: 'Manicure',
    price: 'KSH 500',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/9b/cf/d8/9bcfd8bf51c8bada37c771c05283b019.jpg',
  },
  {
    name: 'Pedicure',
    price: 'KSH 800',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/45/28/83/45288385ea155bfbddbfa880b337dde8.jpg',
  },
  {
    name: 'Plain Gel',
    price: 'KSH 500',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/44/74/d1/4474d1fdb4e38025dbb89cf33d95a075.jpg',
  },
  {
    name: 'French tips',
    price: 'KSH 1000',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/1e/74/7f/1e747f753d64b411d2e9287015fa2d28.jpg',
  },
  {
    name: 'Ombre',
    price: 'KSH 1000',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/05/a8/9f/05a89f2fa362437f606431f5f8ae8f8e.jpg',
  },
  {
    name: 'Acrylics',
    price: 'KSH 1500',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/e8/f4/23/e8f423c7c1b4484ca6163b573be9fe58.jpg',
  },
];

export default function Nails() {
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
      <h2 style={{ color: theme.accent, fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>NAILS</h2>
      <div style={{
        background: theme.accent + '22',
        borderRadius: 16,
        marginBottom: 16,
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 8px 0 #eee',
      }}>
        <img src="https://i.pinimg.com/1200x/96/0e/a9/960ea9cf7655e80d9c3f3130389a1f5d.jpg" alt="Additional Art" style={{ width: '100%', borderRadius: 12, marginBottom: 8, objectFit: 'cover', maxHeight: 100 }} />
        <div style={{ fontWeight: 700, color: theme.accent, fontSize: 16, textAlign: 'center', marginBottom: 4 }}>Additional Art is only 50/=</div>
      </div>
      {nailsServices.map((service, i) => (
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