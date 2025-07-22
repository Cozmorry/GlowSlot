import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaStar } from 'react-icons/fa';

const waxingServices = [
  {
    name: 'Brazilian',
    price: 'KSH 3000',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/3d/1a/49/3d1a49959dee4934c325d3717bf28852.jpg',
  },
  {
    name: 'Manzilian',
    price: 'KSH 2000',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/db/ae/36/dbae3686088bbbd38f0f92e22e8b825e.jpg',
  },
  {
    name: 'Bikini',
    price: 'KSH 2000',
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/07/20/29/07202905b0643f728a39f0efaa568313.jpg',
  },
  {
    name: 'under arms',
    price: 'KSH 1000',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/68/f6/04/68f604303d1f0444f15fa11f0211dab5.jpg',
  },
  {
    name: 'Eyebrows',
    price: 'KSH 300',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/c2/44/c9/c244c9799b38e255005351eb7180eb77.jpg',
  },
  {
    name: 'Half Leg',
    price: 'KSH 1000',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/77/6c/ff/776cff916e14be2080113d649f2df697.jpg',
  },
  {
    name: 'Full Leg',
    price: 'KSH 1500',
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/95/55/e0/9555e062724cc2ca83f0cb3e6b38c586.jpg',
  },
];

export default function Waxing() {
  const { theme } = useTheme();
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
      <h2 style={{ color: theme.accent, fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>WAXING</h2>
      <div style={{
        background: theme.accent + '22',
        borderRadius: 16,
        marginBottom: 16,
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 8px 0 #eee',
        position: 'relative',
      }}>
        <img src="https://i.pinimg.com/736x/4a/f5/74/4af574c3add1cd9df958a70d6c1b6072.jpg" alt="Wash and Blowdry" style={{ width: '100%', borderRadius: 12, marginBottom: 8, objectFit: 'cover', maxHeight: 120 }} />
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
      {waxingServices.map((service, i) => (
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
            }}>Book Now</button>
          </div>
        </div>
      ))}
    </div>
  );
} 