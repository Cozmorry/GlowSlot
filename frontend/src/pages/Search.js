import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaCut, FaUser } from 'react-icons/fa';

const isDesktopWidth = () => window.innerWidth >= 900;

// Mock data for search suggestions
const mockServices = [
  { id: 1, name: 'Haircut' }, { id: 2, name: 'Manicure' }, { id: 3, name: 'Pedicure' },
  { id: 4, name: 'Waxing' }, { id: 5, name: 'Facial' }, { id: 6, name: 'Massage' },
];
const mockStaff = [
  { id: 1, name: 'Alice Johnson' }, { id: 2, name: 'Bob Williams' }, { id: 3, name: 'Charlie Brown' },
];

export default function Search() {
  const { theme } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ services: [], staff: [] });

  useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time search effect with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setSuggestions({ services: [], staff: [] });
        return;
      }
      const lowerCaseQuery = query.toLowerCase();
      const filteredServices = mockServices.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
      const filteredStaff = mockStaff.filter(s => s.name.toLowerCase().includes(lowerCaseQuery));
      setSuggestions({ services: filteredServices, staff: filteredStaff });
    }, 250); // 250ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  // Remove desktop-only restriction so it works on mobile
  // if (!isDesktop) return null;
  
  const hasSuggestions = suggestions.services.length > 0 || suggestions.staff.length > 0;

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? 700 : 'none',
      margin: isDesktop ? '0 auto' : 0,
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: isDesktop ? '2rem 0' : '1rem 0.5rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.text,
      background: theme.background,
    }}>
      <div style={{ width: '100%', marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search services or staff..."
          style={{
            width: '100%',
            padding: isDesktop ? '1.2rem 1.5rem' : '1rem 1.1rem',
            borderRadius: 16,
            border: `2px solid ${query ? theme.accent : theme.border}`,
            fontSize: isDesktop ? 22 : 17,
            background: theme.input,
            color: theme.text,
            boxShadow: '0 2px 8px 0 #eee',
            outline: 'none',
            transition: 'border 0.2s',
            boxSizing: 'border-box',
          }}
        />
      </div>
      {query && (
        <div style={{
          width: '100%',
          background: theme.card,
          borderRadius: 16,
          padding: isDesktop ? '1rem' : '0.5rem',
          boxShadow: '0 2px 8px 0 #eee',
          boxSizing: 'border-box',
        }}>
          {hasSuggestions ? (
            <>
              {suggestions.services.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: isDesktop ? 16 : 15, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Services</h3>
                  {suggestions.services.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isDesktop ? '0.7rem 0.5rem' : '0.7rem 0.3rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s', color: theme.text }}
                      onMouseOver={e => e.currentTarget.style.background = theme.accent}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      onTouchStart={e => e.currentTarget.style.background = theme.accent}
                      onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FaCut color={theme.accent} size={isDesktop ? 18 : 16} />
                      <span style={{ fontWeight: 500, fontSize: isDesktop ? 16 : 15 }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {suggestions.staff.length > 0 && (
                <div>
                  <h3 style={{ fontSize: isDesktop ? 16 : 15, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Staff</h3>
                  {suggestions.staff.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isDesktop ? '0.7rem 0.5rem' : '0.7rem 0.3rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s', color: theme.text }}
                      onMouseOver={e => e.currentTarget.style.background = theme.accent}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      onTouchStart={e => e.currentTarget.style.background = theme.accent}
                      onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FaUser color={theme.accent} size={isDesktop ? 18 : 16} />
                      <span style={{ fontWeight: 500, fontSize: isDesktop ? 16 : 15 }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ color: theme.text, opacity: 0.7, textAlign: 'center', padding: '1rem' }}>
              No results found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
} 