import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaCut, FaUser, FaLayerGroup } from 'react-icons/fa';
import { staffData } from '../data/staffData';
import { hairServices } from './Hair';
import { nailsServices } from './Nails';
import { spaServices } from './Spa';
import { waxingServices } from './Waxing';
import { barberServices } from './Barber';
import { piercingsServices } from './Piercings';
import { tattooServices } from './Tattoo';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Hair', type: 'category' },
  { name: 'Nails', type: 'category' },
  { name: 'Spa', type: 'category' },
  { name: 'Waxing', type: 'category' },
  { name: 'Make Up', type: 'category' },
  { name: 'Barber', type: 'category' },
  { name: 'Piercings', type: 'category' },
  { name: 'Tattoo', type: 'category' },
];

// Flatten all services with category info
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

export default function Search() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 900);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ categories: [], services: [], staff: [] });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setResults({ categories: [], services: [], staff: [] });
        return;
      }
      const lower = query.toLowerCase();
      const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(lower));
      const filteredServices = allServices.filter(s => s.name.toLowerCase().includes(lower) || (s.category && s.category.toLowerCase().includes(lower)));
      const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(lower) || (s.specialties && s.specialties.toLowerCase().includes(lower)));
      setResults({ categories: filteredCategories, services: filteredServices, staff: filteredStaff });
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const hasResults = results.categories.length > 0 || results.services.length > 0 || results.staff.length > 0;

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
          placeholder="Search services, staff, or categories..."
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
          {hasResults ? (
            <>
              {results.categories.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: isDesktop ? 16 : 15, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Categories</h3>
                  {results.categories.map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isDesktop ? '0.7rem 0.5rem' : '0.7rem 0.3rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s', color: theme.text }}
                      onClick={() => navigate(c.route || `/${c.name.toLowerCase().replace(/ /g, '-')}`)}>
                      <FaLayerGroup color={theme.accent} size={isDesktop ? 18 : 16} />
                      <span style={{ fontWeight: 500, fontSize: isDesktop ? 16 : 15 }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {results.services.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: isDesktop ? 16 : 15, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Services</h3>
                  {results.services.map((s, i) => (
                    <div key={s.name + i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isDesktop ? '0.7rem 0.5rem' : '0.7rem 0.3rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s', color: theme.text }}
                      onClick={() => navigate(`/${s.category.toLowerCase().replace(/ /g, '-')}`)}>
                      <img src={s.img} alt={s.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                      <span style={{ fontWeight: 500, fontSize: isDesktop ? 16 : 15 }}>{s.name}</span>
                      <span style={{ color: theme.accent, fontWeight: 600, marginLeft: 8 }}>{s.category}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{s.price}</span>
                    </div>
                  ))}
                </div>
              )}
              {results.staff.length > 0 && (
                <div>
                  <h3 style={{ fontSize: isDesktop ? 16 : 15, color: theme.accent, margin: '0 0 0.5rem 0.5rem', fontWeight: 700, letterSpacing: 1 }}>Staff</h3>
                  {results.staff.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isDesktop ? '0.7rem 0.5rem' : '0.7rem 0.3rem', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s', color: theme.text }}
                      onClick={() => navigate('/staff')}>
                      <img src={s.avatar} alt={s.name} style={{ width: 32, height: 32, borderRadius: 16, objectFit: 'cover' }} />
                      <span style={{ fontWeight: 500, fontSize: isDesktop ? 16 : 15 }}>{s.name}</span>
                      <span style={{ color: theme.accent, fontWeight: 600, marginLeft: 8 }}>{s.specialties}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>⭐ {s.rating}</span>
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