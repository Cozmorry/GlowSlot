import React from 'react';
import { useTheme } from '../context/ThemeContext';

const servicesData = [
  {
    category: 'Hair',
    items: [
      { name: 'Braids', price: '1500/=' },
      { name: 'Artificial Locs Installation', price: '3500/=' },
      { name: 'Natural Locs Installation', price: '1500/=' },
      { name: 'Retouch', price: '800/=' },
      { name: 'Dye', price: '500/=' },
      { name: 'Wig Installation', price: '1000/=' },
      { name: '**Wash and Blowdry Inclusive**', price: '' },
    ],
  },
  {
    category: 'Nails',
    items: [
      { name: 'Manicure', price: '500/=' },
      { name: 'Pedicure', price: '800/=' },
      { name: 'Plain Gel', price: '800/=' },
      { name: 'Tips/Stick ons + Gel', price: '500/=' },
      { name: 'French tips', price: '1000/=' },
      { name: 'Ombre', price: '1000/=' },
      { name: 'Acrylics', price: '1500/=' },
      { name: 'Additional art', price: '50/= per nail' },
    ],
  },
  {
    category: 'Spa',
    items: [
      { name: 'Full Body Massage', price: '2500/=' },
      { name: 'Half Massage', price: '1500/=' },
      { name: 'Facial', price: '1000/=' },
    ],
  },
  {
    category: 'Waxing',
    items: [
      { name: 'Brazilian', price: '3000/=' },
      { name: 'Manzilian', price: '3000/=' },
      { name: 'Bikini', price: '2000/=' },
      { name: 'Under arms', price: '1000/=' },
      { name: 'Eyebrows', price: '300/=' },
      { name: 'Half Leg', price: '1000/=' },
      { name: 'Full Leg', price: '1500/=' },
    ],
  },
  {
    category: 'Make Up',
    items: [
      { name: 'Full Make up', price: '2500/=' },
      { name: 'Soft Glam', price: '1500/=' },
      { name: 'Eyebrow shaving', price: '200/=' },
      { name: 'Lash Extensions', price: '800/=' },
    ],
  },
  {
    category: 'Barber',
    items: [
      { name: 'Taper Fade', price: '1500/=' },
      { name: 'Clean Shave', price: '2000/=' },
      { name: 'Classic haircut', price: '1000/=' },
      { name: 'Beard Grooming', price: '1000/=' },
    ],
  },
  {
    category: 'Piercing',
    items: [
      { name: 'Lobe', price: '200/=' },
      { name: 'Helix', price: '500/=' },
      { name: 'Double Helix', price: '800/=' },
      { name: 'Tragus', price: '500/=' },
      { name: 'Industrial', price: '500/=' },
      { name: 'Conch', price: '500/=' },
      { name: 'Flat', price: '500/=' },
      { name: 'Rook', price: '500/=' },
      { name: 'Tongue', price: '500/=' },
      { name: 'Smiley', price: '500/=' },
      { name: 'Snake Eye', price: '1000/=' },
      { name: 'Nipple', price: '1000/=' },
      { name: 'Belly Button', price: '1000/=' },
      { name: 'Eyebrow', price: '600/=' },
      { name: 'Nose', price: '500/=' },
      { name: 'Septum', price: '500/=' },
    ],
  },
  {
    category: 'Tattoo',
    items: [
      { name: 'Sleeve', price: '' },
      { name: 'Thigh', price: '' },
      { name: 'Samoan', price: '' },
      { name: 'Tribal', price: '' },
      { name: 'Writing', price: '' },
      { name: 'Tattoo Removal', price: '' },
    ],
  },
];

export default function Services() {
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
      {servicesData.map((cat, i) => (
        <div key={cat.category} style={{
          background: theme.accent + '22', // transparent accent
          borderRadius: 16,
          marginBottom: 16,
          padding: '0.5rem 1rem',
          boxShadow: '0 2px 8px 0 #eee',
        }}>
          <h2 style={{
            color: theme.accent,
            fontSize: 18,
            fontWeight: 700,
            margin: '0.5rem 0 0.5rem 0',
            letterSpacing: 1,
          }}>{cat.category}</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cat.items.map((item, j) => (
              <li key={item.name + j} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2px 0',
                fontWeight: item.name.startsWith('**') ? 700 : 400,
                fontStyle: item.name.startsWith('**') ? 'italic' : 'normal',
                color: theme.text,
                fontSize: 15,
              }}>
                <span dangerouslySetInnerHTML={{ __html: item.name.replace(/\*\*/g, '') }} />
                <span style={{ fontWeight: 600 }}>{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 