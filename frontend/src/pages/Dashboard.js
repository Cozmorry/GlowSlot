import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ffe4ec 0%, #fff 100%)',
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 2px 16px 0 #eee',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#e75480', marginBottom: '1.5rem' }}>
          Welcome{user ? `, ${user.name}` : ''}!
        </h2>
        <p style={{ color: '#888' }}>This is your dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard; 