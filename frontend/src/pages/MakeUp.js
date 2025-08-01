import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaStar } from 'react-icons/fa';

import BookingForm from '../components/BookingForm';

const makeUpServices = [
  {
    name: 'Full Make up',
    displayPrice: 'KSH 2500',
    price: 2500,
    rating: 5.0,
    img: 'https://i.pinimg.com/1200x/11/99/f8/1199f88cc3f4c92759cc63d507285dab.jpg',
  },
  {
    name: 'Soft Glam',
    displayPrice: 'KSH 1500',
    price: 1500,
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/c4/ce/1e/c4ce1e274fd8a0f37db103c3cb92e3c4.jpg',
  },
  {
    name: 'Eyebrow shaving',
    displayPrice: 'KSH 200',
    price: 200,
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/e9/e1/72/e9e1728c916d969178fd977debd60834.jpg',
  },
  {
    name: 'Lash Extensions',
    displayPrice: 'KSH 800',
    price: 800,
    rating: 5.0,
    img: 'https://i.pinimg.com/736x/26/e8/9a/26e89a15480448ca4e0e001d5d3ebacb.jpg',
  },
];

export default function MakeUp() {
  const { theme } = useTheme();

  const [bookingStatus, setBookingStatus] = useState('');
  const [selectedService, setSelectedService] = useState(null);const handleBookingSuccess = () => {
    setBookingStatus('Service added to cart successfully!');
    setTimeout(() => setBookingStatus(''), 3000);
  };
  return (
    <div style={{
      background: theme.background,
      minHeight: '100vh',
      padding: '1rem 0.5rem',
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: 500,
      margin: '0 auto',
      position: 'relative'
    }}>
      {bookingStatus && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: bookingStatus.includes('Failed') ? '#ff4d4f' : '#52c41a',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          {bookingStatus}
        </div>
      )}
      <h2 style={{ color: theme.accent, fontWeight: 900, fontSize: 22, margin: '0 0 1rem 0' }}>MAKE UP</h2>
      <div style={{
        background: theme.accent + '22',
        borderRadius: 16,
        marginBottom: 16,
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 8px 0 #eee',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = '0 2px 8px 0 #eee';
        e.target.style.transform = 'translateY(0)';
      }}
      >
        <img 
          src="https://i.pinimg.com/736x/b3/f2/d3/b3f2d3458f2868b7ca92e93739fbb1c7.jpg" 
          alt="Wash and Blowdry" 
          style={{ 
            width: '100%', 
            borderRadius: 12, 
            marginBottom: 8, 
            objectFit: 'cover', 
            maxHeight: 120,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        />
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translate(-50%, -50%) scale(1.05)';
          e.target.style.background = 'rgba(255,255,255,0.95)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translate(-50%, -50%) scale(1)';
          e.target.style.background = 'rgba(255,255,255,0.85)';
          e.target.style.boxShadow = '0 1px 4px 0 #eee';
        }}
        >
          WASH AND BLOWDRY INCLUSIVE
        </div>
      </div>
      {makeUpServices.map((service, i) => (
        <div key={service.name} style={{
          background: theme.accent + '22',
          borderRadius: 22,
          marginBottom: 22,
          padding: '1rem 0.8rem',
          boxShadow: '0 2px 12px 0 #eee',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0) scale(1)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-6px) scale(1.02)';
          e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
          e.target.style.background = theme.accent + '30';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 2px 12px 0 #eee';
          e.target.style.background = theme.accent + '22';
        }}
        >
          <img 
            src={service.img} 
            alt={service.name} 
            style={{ 
              width: 90, 
              height: 90, 
              borderRadius: 16, 
              objectFit: 'cover', 
              marginRight: 18,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.borderRadius = '20px';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.borderRadius = '16px';
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{service.name}</div>
            <div style={{ fontSize: 17, color: theme.text, opacity: 0.9 }}>{service.displayPrice}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 16, color: theme.accent, fontWeight: 700 }}>
              <FaStar color="#FFD700" size={18} style={{ marginRight: 4 }} />
              <span style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>{service.rating.toFixed(1)}</span>
            </div>            <button
              onClick={() => setSelectedService(service)}
              style={{
                background: theme.accent,
                color: 'white',
                border: 'none',
                borderRadius: 14,
                padding: '10px 26px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 6px 0 #eee',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0) scale(1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                e.target.style.background = theme.accent + 'dd';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 1px 6px 0 #eee';
                e.target.style.background = theme.accent;
              }}
            >
              Book Now
            </button>
            
            {selectedService && (<BookingForm
                open={true}
                service={selectedService.name}
                onClose={() => setSelectedService(null)}
                onSuccess={handleBookingSuccess}
                category="makeup"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 