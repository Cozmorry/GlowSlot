import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaPhone, FaEnvelope, FaSignOutAlt, FaBookOpen, FaUsers, FaCog, FaInfoCircle, FaQuestionCircle, FaEdit } from 'react-icons/fa';
const navItems = [
  { label: 'Book with us', route: '/home', icon: FaBookOpen },
  { label: 'Staff', route: '/staff', icon: FaUsers },
  { label: 'Services', route: '/services', icon: FaCog },
  { label: 'About us', route: '/about', icon: FaInfoCircle },
  { label: 'FAQs', route: '/faqs', icon: FaQuestionCircle },
];

const isDesktopWidth = () => window.innerWidth >= 900;

const Profile = () => {
  const { theme, mode } = useTheme();
  const { user: authUser, logout } = useAuth();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check for user data
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleLogout = () => {
    logout();
    navigate('/login');
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
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
      minHeight: '100vh',
    }}>
      {/* Profile card */}
      <div style={{
        width: isDesktop ? 420 : '100%',
        maxWidth: '100%',
        margin: isDesktop ? '0 auto 32px auto' : '0 auto 24px auto',
        background: mode === 'dark' 
          ? 'rgba(45, 55, 72, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 24,
        boxShadow: mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: isDesktop ? '2.5rem 2rem 2rem 2rem' : '1.5rem 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        border: mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {user ? (
          <>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: user.avatar ? 'none' : (mode === 'dark' 
                ? 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)' 
                : 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              boxShadow: mode === 'dark' 
                ? '0 8px 24px rgba(233, 30, 99, 0.5)' 
                : '0 8px 24px rgba(233, 30, 99, 0.3)',
              border: mode === 'dark' 
                ? '4px solid rgba(255, 255, 255, 0.2)' 
                : '4px solid rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
            }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <FaUser size={40} color="white" />
              )}
            </div>
            <h2 style={{ 
              fontWeight: 700, 
              fontSize: 24, 
              color: theme.text, 
              marginBottom: 8,
              textAlign: 'center'
            }}>
              {user.name}
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8, 
              marginBottom: 20,
              alignItems: 'center'
            }}>
              {user.phone && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  color: mode === 'dark' ? '#a0aec0' : '#718096',
                  fontSize: 14
                }}>
                  <FaPhone size={14} />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.email && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  color: mode === 'dark' ? '#a0aec0' : '#718096',
                  fontSize: 14
                }}>
                  <FaEnvelope size={14} />
                  <span>{user.email}</span>
                </div>
              )}
              {!user.phone && !user.email && (
                <div style={{ 
                  color: mode === 'dark' ? '#a0aec0' : '#718096',
                  fontSize: 14,
                  textAlign: 'center'
                }}>
                  No contact information added
                </div>
              )}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              marginBottom: 16 
            }}>
              <button
                onClick={() => navigate('/settings')}
                style={{
                  padding: '10px 20px',
                  background: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  color: theme.text,
                  border: mode === 'dark' 
                    ? '1px solid rgba(233, 30, 99, 0.5)' 
                    : '1px solid rgba(233, 30, 99, 0.3)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaEdit size={14} />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(233, 30, 99, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(233, 30, 99, 0.3)';
              }}
            >
              <FaSignOutAlt size={16} />
              Logout
            </button>
            </div>
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
      <div style={{ 
        width: isDesktop ? 420 : '100%', 
        maxWidth: '100%', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 16, 
        boxSizing: 'border-box' 
      }}>
        {navItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              style={{
                width: '100%',
                fontWeight: 600,
                fontSize: 18,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                border: 'none',
                borderRadius: 16,
                background: mode === 'dark' 
                  ? 'rgba(45, 55, 72, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: theme.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                boxShadow: mode === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
              }}
              onClick={() => navigate(item.route)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = mode === 'dark' 
                  ? '0 6px 20px rgba(0, 0, 0, 0.4)' 
                  : '0 6px 20px rgba(0, 0, 0, 0.15)';
                e.target.style.background = mode === 'dark' 
                  ? 'rgba(45, 55, 72, 1)' 
                  : 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = mode === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.target.style.background = mode === 'dark' 
                  ? 'rgba(45, 55, 72, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <IconComponent size={20} color="#e91e63" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Profile; 