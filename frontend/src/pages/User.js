import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaCog } from 'react-icons/fa';

const user = {
  name: 'JACKSON',
  phone: '+25471234567',
  email: 'jackson69@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const navItems = [
  { label: 'Profile', icon: <FaUser />, route: '/profile' },
  { label: 'Settings', icon: <FaCog />, route: '/settings' },
  { label: 'Book with us', route: '/book' },
  { label: 'Staff', route: '/staff' },
  { label: 'About us', route: '/about' },
  { label: 'FAQs', route: '/faqs' },
];

const User = () => {
  const { theme } = useTheme();
  const themeVars = {
    '--color-bg': theme.background,
    '--color-card': theme.card,
    '--color-text': theme.text,
    '--color-accent': theme.accent,
    '--color-input': theme.input,
    '--color-border': theme.border,
  };

  return (
    <div className="user-root">
      <div className="user-container" style={themeVars}>
        {/* User Card */}
        <div className="user-card">
          <div className="user-card-inner">
            <img
              src={user.avatar}
              alt="avatar"
              className="user-avatar"
            />
            <div className="user-info">
              <span>{user.name}</span>
              <span className="user-phone">{user.phone}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        </div>
        {/* Nav Buttons */}
        <div className="user-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="user-nav-btn"
              onClick={() => window.location.href = item.route}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        {/* Bottom nav (reuse from Home) */}
        <nav className="user-bottom-nav">
          <span style={{ fontSize: 22, color: theme.text }}>🏠</span>
          <span style={{ fontSize: 22, color: theme.text }}>🔍</span>
          <span style={{ fontSize: 22, color: theme.text }}>⚙️</span>
          <span style={{ fontSize: 22, color: theme.text }}>👤</span>
        </nav>
      </div>
    </div>
  );
};

export default User; 