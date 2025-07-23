import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaStar } from 'react-icons/fa';
import BookingForm from '../components/BookingForm';

export const piercingsServices = [
  { name: 'Lobe', price: 'KSH 300', rating: 5.0, img: 'https://i.pinimg.com/736x/01/7b/dc/017bdc8930e5597df507f6d44768b03f.jpg' },
  { name: 'Helix', price: 'KSH 500', rating: 5.0, img: 'https://i.pinimg.com/736x/86/41/85/8641852683bbe6f51eb1355554859fc8.jpg' },
  { name: 'Double Helix', price: 'KSH 800', rating: 5.0, img: 'https://i.pinimg.com/736x/65/07/9d/65079da3fd25b843779460ec2e031fc1.jpg' },
  { name: 'Tragus', price: 'KSH 500', rating: 5.0, img: 'https://i.pinimg.com/1200x/22/70/f7/2270f7285f2b81f148244aa0182a1aa6.jpg' },
  { name: 'Industrial', price: 'KSH 800', rating: 5.0, img: 'https://i.pinimg.com/1200x/7a/e5/7e/7ae57e1bd51bf569cffe0170075689eb.jpg' },
  { name: 'Conch', price: 'KSH 500', rating: 5.0, img: 'https://i.pinimg.com/1200x/ce/3f/a9/ce3fa94a534b9388f9cb002bab443a12.jpg' },
  { name: 'Flat', price: 'KSH 500', rating: 5.0, img: 'https://i.pinimg.com/1200x/fd/b2/37/fdb23762a3555b9badc827643be5f584.jpg' },
  { name: 'Rook', price: 'KSH 500', rating: 5.0, img: 'https://i.pinimg.com/1200x/70/a7/45/70a745f9b84d35a49f06d0ee0c06dfec.jpg' },
  { name: 'Tongue', price: 'KSH 500', rating: 5.0, img: 'https://i.pinimg.com/736x/b5/6c/34/b56c3458503dd81c1b6f6a2735f6e8f6.jpg' },
  { name: 'Smiley', price: 'KSH 1000', rating: 5.0, img: 'https://i.pinimg.com/736x/e6/24/cc/e624cc3cb01d640f1b031e365b0d3512.jpg' },
  { name: 'Snake Eye', price: 'KSH 1000', rating: 5.0, img: 'https://i.pinimg.com/736x/b8/13/04/b81304a6cf1f285d58e4dc4cb0e03a4a.jpg' },
  { name: 'Nose', price: 'KSH 1000', rating: 5.0, img: 'https://i.pinimg.com/736x/90/fe/a2/90fea2708df2fc1a8a9bbd4126f8b810.jpg' },
  { name: 'Belly button', price: 'KSH 1500', rating: 5.0, img: 'https://i.pinimg.com/736x/7a/c1/74/7ac174d87ec7a78721127a128a7fa448.jpg' },
  { name: 'Eyebrow', price: 'KSH 800', rating: 5.0, img: 'https://i.pinimg.com/736x/93/fd/10/93fd10e5b5ce0f2cecdddca77ba3d2ca.jpg' },
  { name: 'Navel', price: 'KSH 1500', rating: 5.0, img: 'https://i.pinimg.com/736x/cd/52/50/cd5250e99446f0e30295af8dd0f15111.jpg' },
  { name: 'Septum', price: 'KSH 1500', rating: 5.0, img: 'https://i.pinimg.com/736x/34/e1/e2/34e1e2381cbaf8fa976ae647d6626305.jpg' },
];

export default function Piercings() {
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
      <h2 style={{ color: theme.accent, fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>PIERCINGS</h2>
      <div style={{
        background: theme.accent + '22',
        borderRadius: 16,
        marginBottom: 16,
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 8px 0 #eee',
        position: 'relative',
      }}>
        <img src="https://i.pinimg.com/1200x/90/ea/3b/90ea3b480af218993d8348fe5bb1f9d7.jpg" alt="Wash and Blowdry" style={{ width: '100%', borderRadius: 12, marginBottom: 8, objectFit: 'cover', maxHeight: 120 }} />
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
      {piercingsServices.map((service) => (
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