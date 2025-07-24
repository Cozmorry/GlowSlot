import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaUser, FaCamera } from 'react-icons/fa';
const isDesktopWidth = () => window.innerWidth >= 900;

export default function Settings() {
  const { theme } = useTheme();
  const { user: authUser, updateUser } = useAuth();
  const { showSuccess } = useNotification();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const [themeMode, setThemeMode] = React.useState(localStorage.getItem('theme') || 'light');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load user data on component mount
  React.useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setName(authUser.name || '');
      setEmail(authUser.email || '');
      setPhone(authUser.phone || '');
      setAvatar(authUser.avatar || '');
    }
  }, [authUser]);

  const handleThemeChange = (e) => {
    setThemeMode(e.target.value);
    localStorage.setItem('theme', e.target.value);
    window.location.reload(); // To apply theme immediately
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Update user data
    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: avatar
    };
    
    updateUser(updatedUser);
    setUser(updatedUser);
    
    showSuccess('Profile updated successfully!');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '100%' : 430,
      margin: isDesktop ? undefined : '0 auto',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: isDesktop ? '2rem' : '1rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.text,
      background: theme.background,
    }}>
      <div style={{
        width: isDesktop ? 420 : '100%',
        maxWidth: '100%',
        background: theme.card,
        borderRadius: 24,
        boxShadow: isDesktop ? '0 2px 16px 0 #eee' : 'none',
        padding: isDesktop ? '2.5rem 2rem 2rem 2rem' : '1.5rem 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        color: theme.text,
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: theme.text }}>Settings</h2>
        <form onSubmit={handleSave} style={{ width: '100%' }}>
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, color: theme.accent }}>Account</h3>
            
            {/* Avatar Section */}
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: avatar ? 'none' : 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  border: '3px solid #fff',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}>
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt="Profile" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <FaUser size={32} color="white" />
                  )}
                </div>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  background: 'rgba(233, 30, 99, 0.1)',
                  color: '#e91e63',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  border: '1px solid rgba(233, 30, 99, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(233, 30, 99, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(233, 30, 99, 0.1)';
                }}>
                  <FaCamera size={14} />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, fontSize: 15, color: theme.text, opacity: 0.7 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  marginTop: 4,
                  fontSize: 16,
                  background: theme.input,
                  color: theme.text,
                  marginBottom: 8,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, fontSize: 15, color: theme.text, opacity: 0.7 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  marginTop: 4,
                  fontSize: 16,
                  background: theme.input,
                  color: theme.text,
                  marginBottom: 8,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, fontSize: 15, color: theme.text, opacity: 0.7 }}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  marginTop: 4,
                  fontSize: 16,
                  background: theme.input,
                  color: theme.text,
                  marginBottom: 8,
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, color: theme.accent }}>Preferences</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, fontSize: 15, color: theme.text, opacity: 0.7, marginRight: 12 }}>Theme</label>
              <select
                value={themeMode}
                onChange={handleThemeChange}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  fontSize: 16,
                  background: theme.input,
                  color: theme.text,
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              background: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              marginTop: 8,
              letterSpacing: 1,
              boxShadow: '0 2px 8px 0 #eee',
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
} 