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

const Home = () => {
  const { mode, theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [isDesktop, setIsDesktop] = useState(isDesktopWidth());
  const [imgError, setImgError] = useState({});

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImgError = (name) => {
    setImgError((prev) => ({ ...prev, [name]: true }));
  };

  // Set CSS variables for theme colors
  const themeVars = {
    '--color-bg': theme.background,
    '--color-card': theme.card,
    '--color-text': theme.text,
    '--color-accent': theme.accent,
    '--color-input': theme.input,
    '--color-border': theme.border,
  };

  return (
    <div className="home-root">
      <div className="home-container" style={themeVars}>
        {/* Top nav bar */}
        <div className="home-nav">
          <div className="home-title">
            GlowSlot
            <button
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 22 }}
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
          <div className="home-nav-icons">
            <FaUser size={24} color={theme.text || '#222'} style={{ cursor: 'pointer' }} />
            <FaShoppingCart size={24} color={theme.text || '#222'} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        {/* Search bar */}
        <div className="home-search-wrap">
          <div className="home-search">
            <FaSearch style={{ marginRight: 8, opacity: 0.7 }} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Discover */}
        <div className="home-discover-wrap">
          <h2 className="home-discover-title">Discover</h2>
          <div className="home-discover-grid">
            {categories.map(cat => (
              <div key={cat.name} className="home-card">
                {!imgError[cat.name] ? (
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="home-card-img"
                    onError={() => handleImgError(cat.name)}
                  />
                ) : (
                  <div className="home-card-fallback">🖼️</div>
                )}
                <span className="home-card-label">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom nav only on mobile */}
        {!isDesktop && (
          <nav className="home-bottom-nav">
            <FaHome size={22} />
            <FaSearch size={22} />
            <FaCog size={22} />
            <FaUser size={22} />
          </nav>
        )}
      </div>
    </div>
  );
};

export default Home; 