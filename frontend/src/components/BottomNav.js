import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaCog } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const BottomNav = ({ onMobileSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, mode } = useTheme();

  const navButtonStyle = {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };

  const handleSearchClick = () => {
    if (onMobileSearch) {
      onMobileSearch();
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        maxWidth: '100%',
        margin: 0,
        background: mode === 'dark' ? theme.card : '#f3f3f3',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        boxShadow: '0 -2px 12px 0 #eee',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <button onClick={() => navigate('/home')} style={navButtonStyle} aria-label="Home">
        <FaHome size={22} color={theme.text} />
      </button>
      <button onClick={handleSearchClick} style={navButtonStyle} aria-label="Search">
        <FaSearch size={22} color={theme.text} />
      </button>
      <button onClick={() => navigate('/profile')} style={navButtonStyle} aria-label="Profile">
        <FaUser size={22} color={theme.text} />
      </button>
      <button onClick={() => navigate('/settings')} style={navButtonStyle} aria-label="Settings">
        <FaCog size={22} color={theme.text} />
      </button>
    </nav>
  );
};

export default BottomNav; 