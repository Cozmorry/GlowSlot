import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaSearch, FaShoppingCart, FaUser, FaCog, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import BottomNav from './BottomNav';
import Home from '../pages/Home';

const DesktopSidebar = ({ theme, mode, toggleTheme }) => (
  <nav style={{
    position: 'fixed',
    top: 32,
    left: 32,
    height: 'calc(100vh - 64px)',
    width: 200,
    background: mode === 'dark' ? theme.card : '#f3f3f3',
    zIndex: 2000,
    boxShadow: '2px 0 8px 0 #eee',
    borderRight: 'none',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
    borderRadius: 24,
  }}>
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '2rem 0 1rem 0',
      gap: 8,
      overflow: 'hidden',
    }}>
      <span style={{ fontWeight: 700, fontSize: 26, color: theme.text, letterSpacing: 1, marginBottom: 36, alignSelf: 'center' }}>GlowSlot</span>
      <Link to="/home" style={{ color: theme.text, textDecoration: 'none', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18, padding: '10px 16px', width: 'calc(100% - 16px)', marginLeft: 8, marginRight: 8, borderRadius: 10, transition: 'background 0.15s', boxSizing: 'border-box', overflow: 'hidden' }}><FaHome size={22} />Discover</Link>
      <Link to="/search" style={{ color: theme.text, textDecoration: 'none', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18, padding: '10px 16px', width: 'calc(100% - 16px)', marginLeft: 8, marginRight: 8, borderRadius: 10, transition: 'background 0.15s', boxSizing: 'border-box', overflow: 'hidden' }}><FaSearch size={22} />Search</Link>
      <Link to="/cart" style={{ color: theme.text, textDecoration: 'none', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18, padding: '10px 16px', width: 'calc(100% - 16px)', marginLeft: 8, marginRight: 8, borderRadius: 10, transition: 'background 0.15s', boxSizing: 'border-box', overflow: 'hidden' }}><FaShoppingCart size={22} />Cart</Link>
      <Link to="/profile" style={{ color: theme.text, textDecoration: 'none', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18, padding: '10px 16px', width: 'calc(100% - 16px)', marginLeft: 8, marginRight: 8, borderRadius: 10, transition: 'background 0.15s', boxSizing: 'border-box', overflow: 'hidden' }}><FaUser size={22} />Profile</Link>
      <Link to="/settings" style={{ color: theme.text, textDecoration: 'none', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 18, padding: '10px 16px', width: 'calc(100% - 16px)', marginLeft: 8, marginRight: 8, borderRadius: 10, transition: 'background 0.15s', boxSizing: 'border-box', overflow: 'hidden' }}><FaCog size={22} />Settings</Link>
    </div>
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        left: 32,
        bottom: 32,
        width: 40,
        height: 40,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: theme.text,
        fontSize: 28,
        zIndex: 3000,
        borderRadius: '50%',
        marginLeft: 80,
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  </nav>
);

const MainLayout = ({ children }) => {
  const { theme, mode, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const homeRef = useRef();

  // Only wrap Home with ref if it's the Home page
  const isHome = location.pathname === '/' || location.pathname === '/home';

  // Mobile search button handler
  const handleMobileSearch = () => {
    if (isHome && homeRef.current && homeRef.current.focusSearch) {
      homeRef.current.focusSearch();
    } else {
      navigate('/home');
      setTimeout(() => {
        if (homeRef.current && homeRef.current.focusSearch) {
          homeRef.current.focusSearch();
        }
      }, 100);
    }
  };

  const sidebarWidth = 200;
  const sidebarGap = 32;
  const desktopMargin = 32;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: isMobile ? theme.background : '#f5c6ea',
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-start',
      alignItems: 'flex-start',
      overflowX: 'hidden',
      position: 'relative',
      paddingBottom: !isMobile ? 32 : 0,
    }}>
      {!isMobile && <DesktopSidebar theme={theme} mode={mode} toggleTheme={toggleTheme} />}
      <main style={{
        width: '100%',
        height: !isMobile ? 'calc(100vh - 96px)' : 'auto', // 96px = 64px (top+bottom margins) + 32px padding
        minHeight: isMobile ? '100vh' : undefined,
        background: theme.background,
        color: theme.text,
        margin: !isMobile ? '32px 32px 32px calc(232px + 32px)' : 0,
        borderRadius: !isMobile ? 24 : 0,
        boxShadow: !isMobile ? '0 0 24px 0 #e3c6f7' : 'none',
        paddingBottom: isMobile ? 80 : 32,
        overflowY: !isMobile ? 'auto' : 'visible',
        overflowX: 'hidden',
      }}>
        {isMobile && isHome ? React.cloneElement(children, { ref: homeRef }) : children}
      </main>
      {isMobile && <BottomNav onMobileSearch={handleMobileSearch} />}
    </div>
  );
};

export default MainLayout; 