import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const user = {
  name: 'JACKSON',
  phone: '+25471234567',
  email: 'jackson69@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const navItems = [
  { label: 'Book with us', route: '/book' },
  { label: 'Staff', route: '/staff' },
  { label: 'About us', route: '/about' },
  { label: 'FAQs', route: '/faqs' },
];

const isDesktopWidth = () => window.innerWidth >= 900;

const Profile = () => {
  const { theme } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: isDesktop ? '2rem' : '1rem',
      width: '100%',
      maxWidth: isDesktop ? '100%' : 430,
      margin: isDesktop ? undefined : '0 auto',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      {/* Profile card */}
      <div style={{
        width: isDesktop ? 420 : '100%',
        maxWidth: '100%',
        margin: isDesktop ? '0 auto 32px auto' : '0 auto 24px auto',
        background: isDesktop ? theme.card : '#e6b8e6',
        borderRadius: 24,
        boxShadow: isDesktop ? '0 2px 16px 0 #eee' : 'none',
        padding: isDesktop ? '2.5rem 2rem 2rem 2rem' : '1.5rem 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <img
          src={user.avatar}
          alt="avatar"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid #fff',
            objectFit: 'cover',
            marginBottom: 16,
          }}
        />
        <span style={{ fontWeight: 700, fontSize: 18, color: theme.text, marginBottom: 4 }}>{user.name}</span>
        <span style={{ fontSize: 14, color: theme.text, opacity: 0.8, marginBottom: 2 }}>{user.phone}</span>
        <span style={{ fontSize: 14, color: theme.text, opacity: 0.8 }}>{user.email}</span>
      </div>
      {/* Action buttons */}
      <div style={{ width: isDesktop ? 420 : '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        {navItems.map((item, idx) => (
          <button
            key={item.label}
            style={{
              width: '100%',
              background: isDesktop ? theme.card : '#fff',
              color: theme.text,
              border: 'none',
              borderRadius: 18,
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 0,
              padding: isDesktop ? '1.1rem 0' : '1.1rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: isDesktop ? '0 2px 8px 0 #eee' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxSizing: 'border-box',
            }}
            onClick={() => navigate(item.route)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile; 