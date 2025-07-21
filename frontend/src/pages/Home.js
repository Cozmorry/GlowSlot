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

  const handleImgError = (name) => {
    setImgError((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100vw',
      overflowX: 'hidden',
      background: isDesktop ? '#f5c6ea' : 'linear-gradient(135deg, #f5c6ea 0%, #fff 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: isDesktop ? '100%' : '100vw',
        maxWidth: isDesktop ? 1100 : '100vw',
        minHeight: '100vh',
        background: theme.background,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: !isDesktop ? bottomNavHeight + 24 : 70,
        boxShadow: isDesktop ? '0 0 24px 0 #e3c6f7' : 'none',
        margin: isDesktop ? '0 auto' : 0,
        borderRadius: isDesktop ? 24 : 0,
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Top nav bar for desktop, top bar for mobile */}
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          padding: isDesktop ? '1.2rem 2.5rem 0.5rem 2.5rem' : '1.2rem 1.2rem 0.5rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottom: isDesktop ? `1px solid ${theme.border}` : 'none',
          minHeight: 60,
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
        </div>
        {/* Search bar and cart icon side-by-side */}
        <div style={{ width: '100%', maxWidth: isDesktop ? 600 : 430, padding: isDesktop ? '1.5rem 2.5rem 0 2.5rem' : '0 1.2rem', marginBottom: 18 }}>
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
        {/* Discover */}
        <div style={{ width: '100%', maxWidth: isDesktop ? 1000 : 430, padding: isDesktop ? '0 2.5rem' : '0 1.2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, margin: '0 0 18px 0', color: theme.text }}>Discover</h2>
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
                      fontSize: 22,
                      textShadow: '2px 2px 8px #000',
                      padding: '0 8px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.25)',
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
              background: theme.card,
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
            <FaHome size={22} color={theme.text} />
            <FaSearch size={22} color={theme.text} />
            <FaCog size={22} color={theme.text} />
            <FaUser size={22} color={theme.text} />
          </nav>
        )}
      </div>
    </div>
  );
};

export default Home; 