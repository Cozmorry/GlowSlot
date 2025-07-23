import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
const navItems = [
  { label: 'Book with us', route: '/book' },
  { label: 'Staff', route: '/staff' },
  { label: 'Services', route: '/services' },
  { label: 'About us', route: '/about' },
  { label: 'FAQs', route: '/faqs' },
];

const isDesktopWidth = () => window.innerWidth >= 900;

const Profile = () => {
  const { theme, mode } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check for user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
                navigate('/login');
};

  // Button color logic
  const getButtonStyle = () => {
    if (mode === 'light') {
      return {
        background: theme.accent,
        color: '#fff',
      };
    } else {
      return {
        background: theme.card,
        color: theme.text,
      };
    }
  };

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
      color: theme.text,
      background: theme.background,
    }}>{/* Profile card */}
      <div style={{
        width: isDesktop ? 420 : '100%',
        maxWidth: '100%',
        margin: isDesktop ? '0 auto 32px auto' : '0 auto 24px auto',
        background: theme.card,
        borderRadius: 24,
        boxShadow: isDesktop ? '0 2px 16px 0 #eee' : 'none',
        padding: isDesktop ? '2.5rem 2rem 2rem 2rem' : '1.5rem 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {user ? (
          <>
            <img
              src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
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
            <span style={{ fontSize: 14, color: theme.text, opacity: 0.8, marginBottom: 2 }}>{user.phone || 'No phone added'}</span>
            <span style={{ fontSize: 14, color: theme.text, opacity: 0.8 }}>{user.email}</span>
            <button
              onClick={handleLogout}
              style={{
                marginTop: 16,
                padding: '8px 24px',
                background: theme.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 32px',
              background: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Login
          </button>
        )}
      </div>
      {/* Action buttons */}
      <div style={{ width: isDesktop ? 420 : '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        {navItems.map((item, idx) => (
          <button
            key={item.label}
            style={{
              width: '100%',
              fontWeight: 700,
              fontSize: 26,
              marginBottom: 0,
              padding: isDesktop ? '1.1rem 0' : '1.1rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              border: 'none',
              borderRadius: 24,
              boxShadow: '0 2px 16px 0 #222',
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxSizing: 'border-box',
              ...getButtonStyle(),
            }}
            onClick={() => navigate(item.route)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile; 