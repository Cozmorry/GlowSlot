import React from 'react';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '2rem 1.5rem',
        minWidth: 280,
        maxWidth: 340,
        width: '90vw',
        boxShadow: '0 2px 16px 0 #eee',
        textAlign: 'center',
      }}>
        {children}
        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            padding: '0.7rem 2.5rem',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal; 