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

  // Only show on desktop
  if (!isDesktop) return null;
  
  const hasSuggestions = suggestions.services.length > 0 || suggestions.staff.length > 0;

  return (
    <div style={{
      width: '100%',
      maxWidth: 700,
      margin: '0 auto',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: '2rem 0',
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
            padding: '1.2rem 1.5rem',
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            fontSize: 22,
            background: theme.input,
            color: theme.text,
            boxShadow: '0 2px 8px 0 #eee',
            outline: 'none',
          }}
        />
      </div>
      
      {query && (
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
              No results found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
} 