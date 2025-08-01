import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaSearch, FaSun, FaMoon, FaCut, FaUser, FaLayerGroup } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { staffData } from '../data/staffData';
import { hairServices } from './Hair';
import { nailsServices } from './Nails';
import { spaServices } from './Spa';
import { waxingServices } from './Waxing';
import { barberServices } from './Barber';
import { piercingsServices } from './Piercings';
import { tattooServices } from './Tattoo';

const categories = [
  { name: 'Hair', type: 'category', route: '/hair', img: 'https://i.pinimg.com/736x/ff/59/a3/ff59a35d3a66209f0f9759864fbc9a9d.jpg' },
  { name: 'Nails', type: 'category', route: '/nails', img: 'https://i.pinimg.com/1200x/96/0e/a9/960ea9cf7655e80d9c3f3130389a1f5d.jpg' },
  { name: 'Spa', type: 'category', route: '/spa', img: 'https://i.pinimg.com/736x/59/b3/c0/59b3c0e608bfd23632d9991c4050edc5.jpg' },
  { name: 'Waxing', type: 'category', route: '/waxing', img: 'https://i.pinimg.com/736x/4a/f5/74/4af574c3add1cd9df958a70d6c1b6072.jpg' },
  { name: 'Make Up', type: 'category', route: '/makeup', img: 'https://i.pinimg.com/736x/b3/f2/d3/b3f2d3458f2868b7ca92e93739fbb1c7.jpg' },
  { name: 'Barber', type: 'category', route: '/barber', img: 'https://i.pinimg.com/736x/c0/99/87/c099873629478e002acaabd9697bff6b.jpg' },
  { name: 'Piercings', type: 'category', route: '/piercings', img: 'https://i.pinimg.com/1200x/90/ea/3b/90ea3b480af218993d8348fe5bb1f9d7.jpg' },
  { name: 'Tattoo', type: 'category', route: '/tattoo', img: 'https://i.pinimg.com/736x/79/a5/cd/79a5cdadbde6f7c11052452248c79862.jpg' },
];

const allServices = [
  ...hairServices.map(s => ({ ...s, type: 'service', category: 'Hair' })),
  ...nailsServices.map(s => ({ ...s, type: 'service', category: 'Nails' })),
  ...spaServices.map(s => ({ ...s, type: 'service', category: 'Spa' })),
  ...waxingServices.map(s => ({ ...s, type: 'service', category: 'Waxing' })),
  ...barberServices.map(s => ({ ...s, type: 'service', category: 'Barber' })),
  ...piercingsServices.map(s => ({ ...s, type: 'service', category: 'Piercings' })),
  ...tattooServices.map(s => ({ ...s, type: 'service', category: 'Tattoo' })),
];
const allStaff = staffData.map(s => ({ ...s, type: 'staff' }));

const isDesktopWidth = () => window.innerWidth >= 900;

const fallbackImg = 'https://via.placeholder.com/400x300?text=No+Image';

const Home = forwardRef((props, ref) => {
  const { theme, mode, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState({ services: [], staff: [] });
  const [isDesktop, setIsDesktop] = useState(isDesktopWidth());
  const [imgError, setImgError] = useState({});
  const navigate = useNavigate();
  const searchInputRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time search for mobile
  useEffect(() => {
    if (isDesktop) return;
    const handler = setTimeout(() => {
      if (search.trim() === '') {
        setSuggestions({ services: [], staff: [] });
        return;
      }
      const lowerCaseQuery = search.toLowerCase();
      const filteredServices = allServices.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
      const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
      setSuggestions({ services: filteredServices, staff: filteredStaff });
    }, 250); // 250ms debounce

    return () => clearTimeout(handler);
  }, [search, isDesktop]);

  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }));

  const handleImgError = (name) => {
    setImgError((prev) => ({ ...prev, [name]: true }));
  };
  
  const hasSuggestions = suggestions.services.length > 0 || suggestions.staff.length > 0;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 24, color: theme.accent, letterSpacing: 1 }}>GlowSlot</span>
              <button
                onClick={toggleTheme}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: theme.text,
                  fontSize: 20,
                }}
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, color: theme.accent, letterSpacing: 1 }}>Discover</span>
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
                ref={searchInputRef}
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

      {/* On mobile, show suggestions if typing, otherwise show categories */}
      {!isDesktop && search ? (
        <div style={{ width: '100%', background: theme.card, borderRadius: 16, padding: '1rem', boxShadow: '0 2px 8px 0 #eee' }}>
          {suggestions.services.length > 0 || suggestions.staff.length > 0 || categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).length > 0 ? (
            <>
              {/* Categories */}
              {categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: 16, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Categories</h3>
                  {categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                    <div key={c.name} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      padding: '0.7rem 0.5rem', 
                      borderRadius: 8, 
                      cursor: 'pointer', 
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                      color: theme.text,
                      transform: 'translateX(0)',
                    }}
                      onClick={() => navigate(c.route)}
                      onMouseEnter={(e) => {
                        e.target.style.background = theme.accent + '15';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                      }}>
                      <FaLayerGroup color={theme.accent} size={16} />
                      <span style={{ fontWeight: 500, fontSize: 16 }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Services */}
              {suggestions.services.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: 16, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Services</h3>
                  {suggestions.services.map((s, i) => (
                    <div key={s.name + i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      padding: '0.7rem 0.5rem', 
                      borderRadius: 8, 
                      cursor: 'pointer', 
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                      color: theme.text,
                      transform: 'translateX(0)',
                    }}
                      onClick={() => navigate(`/${s.category.toLowerCase().replace(/ /g, '-')}`)}
                      onMouseEnter={(e) => {
                        e.target.style.background = theme.accent + '15';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                      }}>
                      <img src={s.img} alt={s.name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
                      <span style={{ fontWeight: 500, fontSize: 16 }}>{s.name}</span>
                      <span style={{ color: theme.accent, fontWeight: 600, marginLeft: 8 }}>{s.category}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{s.price}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Staff */}
              {suggestions.staff.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Staff</h3>
                  {suggestions.staff.map(s => (
                    <div key={s.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      padding: '0.7rem 0.5rem', 
                      borderRadius: 8, 
                      cursor: 'pointer', 
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                      color: theme.text,
                      transform: 'translateX(0)',
                    }}
                      onClick={() => navigate('/staff')}
                      onMouseEnter={(e) => {
                        e.target.style.background = theme.accent + '15';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                      }}>
                      <img src={s.avatar} alt={s.name} style={{ width: 28, height: 28, borderRadius: 14, objectFit: 'cover' }} />
                      <span style={{ fontWeight: 500, fontSize: 16 }}>{s.name}</span>
                      <span style={{ color: theme.accent, fontWeight: 600, marginLeft: 8 }}>{s.specialties}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>⭐ {s.rating}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ color: theme.text, opacity: 0.7, textAlign: 'center', padding: '1rem' }}>
              No results found for "{search}".
            </div>
          )}
        </div>
      ) : (
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0) scale(1)',
              }}
              onClick={() => navigate(cat.route)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 2px 8px 0 #eee';
              }}
            >
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
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
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
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '90%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)';
                    e.target.style.transform = 'translateX(-50%) scale(1.05)';
                    e.target.style.padding = '10px 18px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)';
                    e.target.style.transform = 'translateX(-50%) scale(1)';
                    e.target.style.padding = '8px 16px';
                  }}
                >
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Home; 