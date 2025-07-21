import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImgError = (name) => {
    setImgError((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '100%' : 430,
      margin: isDesktop ? undefined : '0 auto',
      padding: isDesktop ? '0 2.5rem' : '0 1.2rem',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      {!isDesktop && (
        <div style={{
          padding: '1.2rem 0',
          width: '100%'
        }}>
          {/* Top bar: GlowSlot left, Discover right */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
              <span style={{ fontWeight: 700, fontSize: 24, color: theme.text, letterSpacing: 1 }}>GlowSlot</span>
              <span style={{ fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: 1 }}>Discover</span>
          </div>
          {/* Search bar and cart icon, stretched across */}
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
              onClick={() => navigate('/cart')}
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
      )}

      {isDesktop && <h2 style={{ fontWeight: 700, fontSize: 22, margin: '18px 0', color: theme.text }}>Discover</h2>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          gap: 18,
          width: '100%',
          boxSizing: 'border-box',
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
              boxSizing: 'border-box',
            }}
          >
            {/* Aspect ratio wrapper */}
            <div style={{ paddingTop: '100%', position: 'relative' }}>
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
  );
};

export default Home; 