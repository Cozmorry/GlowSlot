import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.background,
    }}>
      <div style={{
        background: theme.card,
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 2px 16px 0 #eee',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
        color: theme.text,
      }}>
        <h2 style={{ color: theme.accent, marginBottom: '1.5rem' }}>
          Welcome{user ? `, ${user.name}` : ''}!
        </h2>
        <p style={{ color: theme.text, opacity: 0.7 }}>This is your dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard; 