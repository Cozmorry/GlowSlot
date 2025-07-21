import React from 'react';
import { useTheme } from '../context/ThemeContext';
const isDesktopWidth = () => window.innerWidth >= 900;

export default function Settings() {
  const { theme } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const [themeMode, setThemeMode] = React.useState(localStorage.getItem('theme') || 'light');
  const [name, setName] = React.useState('JACKSON');
  const [email] = React.useState('jackson69@gmail.com');
  const [phone, setPhone] = React.useState('+25471234567');

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeChange = (e) => {
    setThemeMode(e.target.value);
    localStorage.setItem('theme', e.target.value);
    window.location.reload(); // To apply theme immediately
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic here (API call, etc.)
    alert('Settings saved!');
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, fontSize: 15, color: theme.text, opacity: 0.7 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
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
                readOnly
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  marginTop: 4,
                  fontSize: 16,
                  background: theme.input,
                  color: theme.text,
                  opacity: 0.7,
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