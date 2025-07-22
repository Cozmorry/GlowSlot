import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaSearch, FaSun, FaMoon, FaCut, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for search suggestions
const mockServices = [
  { id: 1, name: 'Haircut' }, { id: 2, name: 'Manicure' }, { id: 3, name: 'Pedicure' },
  { id: 4, name: 'Waxing' }, { id: 5, name: 'Facial' }, { id: 6, name: 'Massage' },
];
const mockStaff = [
  { id: 1, name: 'Alice Johnson' }, { id: 2, name: 'Bob Williams' }, { id: 3, name: 'Charlie Brown' },
];

const categories = [
  { name: 'hair', img: 'https://i.pinimg.com/736x/ff/59/a3/ff59a35d3a66209f0f9759864fbc9a9d.jpg' },
  { name: 'nails', img: 'https://i.pinimg.com/1200x/96/0e/a9/960ea9cf7655e80d9c3f3130389a1f5d.jpg' },
  { name: 'spa', img: 'https://i.pinimg.com/736x/59/b3/c0/59b3c0e608bfd23632d9991c4050edc5.jpg' },
  { name: 'waxing', img: 'https://i.pinimg.com/736x/4a/f5/74/4af574c3add1cd9df958a70d6c1b6072.jpg' },
  { name: 'make-up', img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80' },
  { name: 'barber', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80' },
  { name: 'piercing', img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80' },
  { name: 'tattoo', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
];

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
      const filteredServices = mockServices.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
      const filteredStaff = mockStaff.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
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
          {hasSuggestions ? (
            <>
              {suggestions.services.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: 16, color: theme.text, opacity: 0.7, margin: '0 0 0.5rem 0.5rem' }}>Services</h3>
                  {suggestions.services.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.7rem 0.5rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                      <FaCut /><span>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {suggestions.staff.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, color: theme.text, opacity: 0.7, margin: '0 0 0.5rem 0.5rem' }}>Staff</h3>
                  {suggestions.staff.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.7rem 0.5rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                      <FaUser /><span>{s.name}</span>
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
              }}
              onClick={() => {
                if (cat.name === 'nails') navigate('/nails');
                if (cat.name === 'hair') navigate('/hair');
                if (cat.name === 'spa') navigate('/spa');
                if (cat.name === 'waxing') navigate('/waxing');
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
      )}
    </div>
  );
});

export default Home; 