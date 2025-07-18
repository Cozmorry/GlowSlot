import React from 'react';

const LoadingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8d6f8 0%, #e3c6f7 100%)',
    }}>
      <img
        src={process.env.PUBLIC_URL + '/logo192.png'}
        alt="GlowSlot Logo"
        style={{
          width: 140,
          height: 140,
          objectFit: 'contain',
          marginBottom: 24,
          opacity: 0,
          transform: 'translateY(30px)',
          animation: 'fade-in-up 1.8s ease 0.1s forwards',
        }}
      />
      <h1
        style={{
          fontFamily: 'Poppins, Arial Black, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 54,
          color: '#222',
          letterSpacing: 3,
          textShadow: '2px 2px 0 #fff, 0 2px 8px #e3c6f7',
          marginBottom: 40,
          opacity: 0,
          transform: 'translateY(30px)',
          animation: 'fade-in-up 1.8s ease 0.4s forwards',
        }}
      >
        GlowSlot
      </h1>
      <div style={{ marginTop: 40 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="24"
            stroke="#ff6f91"
            strokeWidth="6"
            fill="none"
            strokeDasharray="120"
            strokeDashoffset="60"
            strokeLinecap="round"
            style={{
              transformOrigin: 'center',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </svg>
      </div>
    </div>
  );
};

export default LoadingPage; 