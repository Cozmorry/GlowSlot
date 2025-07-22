import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { staffData } from '../data/staffData';
import { FaStar } from 'react-icons/fa';

const StaffCard = ({ staff }) => {
  const { theme } = useTheme();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: theme.card,
      borderRadius: '16px',
      padding: '12px',
      marginBottom: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}>
      <img src={staff.avatar} alt={staff.name} style={{
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        marginRight: '12px',
        objectFit: 'cover',
      }} />
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{staff.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px', color: theme.text, opacity: 0.8 }}>{staff.specialties}</p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
          <FaStar color="#FFD700" style={{ marginRight: '4px' }} />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{staff.rating.toFixed(1)}</span>
        </div>
      </div>
      <button style={{
        background: theme.accent,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}>
        Book Now
      </button>
    </div>
  );
};

const Staff = () => {
  const { theme } = useTheme();

  return (
    <div style={{
      background: theme.background,
      minHeight: '100vh',
      padding: '16px',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: theme.text,
      }}>
        STAFF
      </h1>
      <div>
        {staffData.map(staff => <StaffCard key={staff.id} staff={staff} />)}
      </div>
    </div>
  );
};

export default Staff; 