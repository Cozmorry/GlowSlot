import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaSun, FaMoon, FaSearch, FaHome, FaUser, FaCog } from 'react-icons/fa';

const categories = [
  { name: 'hair', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { name: 'nails', img: 'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=400&q=80' },
  { name: 'spa', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { name: 'waxing', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' },
  { name: 'make-up', img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80' },
  { name: 'barber', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80' },
  { name: 'piercing', img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80' },
  { name: 'tattoo', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
];

const isDesktopWidth = () => window.innerWidth >= 900;

const fallbackImg = 'https://via.placeholder.com/400x300?text=No+Image';

const sidebarLinkStyle = (theme) => ({
  color: theme.text,
  textDecoration: 'none',
  marginBottom: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontWeight: 600,
  fontSize: 18,
  padding: '10px 16px',
  width: 'calc(100% - 16px)',
  marginLeft: 8,
  marginRight: 8,
  borderRadius: 10,
  transition: 'background 0.15s',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

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
      <a href="/home" style={sidebarLinkStyle(theme)} onMouseOver={e => e.currentTarget.style.background = theme.input} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><FaHome size={22} />Discover</a>
      <a href="#search" style={sidebarLinkStyle(theme)} onMouseOver={e => e.currentTarget.style.background = theme.input} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><FaSearch size={22} />Search</a>
      <a href="#cart" style={sidebarLinkStyle(theme)} onMouseOver={e => e.currentTarget.style.background = theme.input} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><FaShoppingCart size={22} />Cart</a>
      <a href="#profile" style={sidebarLinkStyle(theme)} onMouseOver={e => e.currentTarget.style.background = theme.input} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><FaUser size={22} />Profile</a>
      <a href="#settings" style={sidebarLinkStyle(theme)} onMouseOver={e => e.currentTarget.style.background = theme.input} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><FaCog size={22} />Settings</a>
    </div>
    {/* Minimal theme toggle at the bottom left */}
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
    <style>{`
      nav::-webkit-scrollbar, div::-webkit-scrollbar {
        display: none;
      }
    `}</style>
  </nav>
);

const Home = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [isDesktop, setIsDesktop] = useState(isDesktopWidth());
  const [imgError, setImgError] = useState({});

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bottomNavHeight = 64;
  const desktopMargin = isDesktop ? 32 : 0;
  const sidebarWidth = 200;
  const sidebarGap = isDesktop ? 32 : 0;

  const handleImgError = (name) => {
    setImgError((prev) => ({ ...prev, [name]: true }));
  };

  // For perfect centering, calculate the main UI's maxWidth as:
  // 100vw - sidebarWidth - sidebarGap - 2 * desktopMargin
  // and set marginRight: desktopMargin

  return (
    <div style={{
      height: isDesktop ? '100vh' : undefined,
      minHeight: !isDesktop ? '100vh' : undefined,
      width: '100vw',
      maxWidth: '100vw',
      overflow: isDesktop ? 'hidden' : undefined,
      background: isDesktop ? '#f5c6ea' : 'linear-gradient(135deg, #f5c6ea 0%, #fff 100%)',
      display: 'flex',
      justifyContent: isDesktop ? 'flex-start' : 'center',
      alignItems: 'flex-start',
    }}>
      {/* Desktop sidebar nav */}
      {isDesktop && <DesktopSidebar theme={theme} mode={mode} toggleTheme={toggleTheme} />}
      <div style={{
        height: isDesktop ? 'calc(100vh - ' + (desktopMargin * 2) + 'px)' : undefined,
        minHeight: !isDesktop ? '100vh' : undefined,
        width: isDesktop ? '100%' : '100vw',
        maxWidth: isDesktop ? `calc(100vw - ${sidebarWidth + sidebarGap + desktopMargin * 2}px)` : '100vw',
        background: theme.background,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isDesktop ? 'center' : 'flex-start',
        paddingBottom: !isDesktop ? bottomNavHeight + 24 : 0,
        boxShadow: isDesktop ? '0 0 24px 0 #e3c6f7' : 'none',
        margin: isDesktop ? `${desktopMargin}px ${desktopMargin}px ${desktopMargin}px ${sidebarWidth + sidebarGap + desktopMargin}px` : 0,
        borderRadius: isDesktop ? 24 : 0,
        position: 'relative',
        overflow: isDesktop ? 'hidden' : undefined,
        paddingLeft: isDesktop ? 16 : 0,
        paddingRight: isDesktop ? 16 : 0,
        transition: 'margin 0.2s, padding 0.2s',
      }}>
        {/* Top nav bar for mobile only */}
        {!isDesktop && (
          <>
            {/* Top bar: GlowSlot left, Discover right */}
            <div style={{
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              padding: '1.2rem 1.2rem 0.5rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 60,
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 24, color: theme.text, letterSpacing: 1 }}>GlowSlot</span>
                <button
                  onClick={toggleTheme}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text, fontSize: 22 }}
                  aria-label="Toggle theme"
                >
                  {mode === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
              </div>
              <span style={{ fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: 1, position: 'absolute', right: 70, top: '50%', transform: 'translateY(-50%)', background: 'none' }}>Discover</span>
            </div>
            {/* Search bar and cart icon, stretched across */}
            <div style={{ width: '100%', maxWidth: 430, padding: '0 1.2rem', marginBottom: 18 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: 10,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: theme.card,
                  borderRadius: 12,
                  boxShadow: '0 1px 4px 0 #eee',
                  padding: '0.5rem 1rem',
                  flex: 1,
                  minWidth: 0,
                }}>
                  <FaSearch color={theme.text} style={{ marginRight: 8, opacity: 0.7 }} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: theme.text,
                      fontSize: 16,
                      flex: 1,
                      minWidth: 0,
                    }}
                  />
                </div>
                <button
                  style={{
                    background: theme.card,
                    border: 'none',
                    borderRadius: 12,
                    boxShadow: '0 1px 4px 0 #eee',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                  }}
                  aria-label="Cart"
                >
                  <FaShoppingCart size={24} color={theme.text} />
                </button>
              </div>
            </div>
          </>
        )}
        {/* Discover heading for mobile removed */}
        {/* Discover */}
        <div style={{ width: '100%', maxWidth: isDesktop ? 1000 : 430, padding: isDesktop ? '0 2.5rem' : '0 1.2rem' }}>
          {isDesktop && <h2 style={{ fontWeight: 700, fontSize: 22, margin: '0 0 18px 0', color: theme.text }}>Discover</h2>}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
              gap: 18,
            }}
          >
            {categories.map(cat => (
              <div
                key={cat.name}
                style={{
                  width: '100%',
                  position: 'relative',
                  borderRadius: 18,
                  overflow: 'hidden',
                  background: theme.card,
                  boxShadow: '0 2px 8px 0 #eee',
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                {/* Aspect ratio wrapper */}
                <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
                  <img
                    src={imgError[cat.name] ? fallbackImg : cat.img}
                    alt={cat.name}
                    onError={() => handleImgError(cat.name)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 18,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: 16,
                      transform: 'translateX(-50%)',
                      zIndex: 2,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      textShadow: '2px 2px 8px #000',
                      padding: '0 8px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.25)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90%',
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom nav only on mobile */}
        {!isDesktop && (
          <nav
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              maxWidth: '100vw',
              margin: 0,
              background: mode === 'dark' ? theme.card : '#f3f3f3',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              boxShadow: '0 -2px 12px 0 #eee',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: bottomNavHeight,
              zIndex: 1000,
              overflow: 'visible',
              pointerEvents: 'auto',
              touchAction: 'auto',
            }}
          >
            <FaSearch size={22} color={theme.text} />
            <FaShoppingCart size={22} color={theme.text} />
            <FaCog size={22} color={theme.text} />
            <FaUser size={22} color={theme.text} />
          </nav>
        )}
      </div>
    </div>
  );
};

export default Home; 