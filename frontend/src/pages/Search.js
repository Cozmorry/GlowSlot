import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaCut, FaUser, FaLayerGroup, FaSearch, FaTimes, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
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
  { name: 'Hair', type: 'category', route: '/hair', icon: '💇‍♀️' },
  { name: 'Nails', type: 'category', route: '/nails', icon: '💅' },
  { name: 'Spa', type: 'category', route: '/spa', icon: '🧖‍♀️' },
  { name: 'Waxing', type: 'category', route: '/waxing', icon: '🪒' },
  { name: 'Make Up', type: 'category', route: '/makeup', icon: '💄' },
  { name: 'Barber', type: 'category', route: '/barber', icon: '✂️' },
  { name: 'Piercings', type: 'category', route: '/piercings', icon: '👂' },
  { name: 'Tattoo', type: 'category', route: '/tattoo', icon: '🎨' },
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
  const { theme, mode } = useTheme();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 900);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState({ categories: [], services: [], staff: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setResults({ categories: [], services: [], staff: [] });
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      
      setTimeout(() => {
        const lower = query.toLowerCase();
        const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(lower));
        const filteredServices = allServices.filter(s => s.name.toLowerCase().includes(lower) || (s.category && s.category.toLowerCase().includes(lower)));
        const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(lower) || (s.specialties && s.specialties.toLowerCase().includes(lower)));
        
        // Apply active filter
        let finalResults = { categories: [], services: [], staff: [] };
        
        if (activeFilter === 'all' || activeFilter === 'categories') {
          finalResults.categories = filteredCategories;
        }
        if (activeFilter === 'all' || activeFilter === 'services') {
          finalResults.services = filteredServices;
        }
        if (activeFilter === 'all' || activeFilter === 'staff') {
          finalResults.staff = filteredStaff;
        }
        
        setResults(finalResults);
        setIsSearching(false);
      }, 300);
    }, 250);
    
    return () => clearTimeout(handler);
  }, [query, activeFilter]);

  const hasResults = results.categories.length > 0 || results.services.length > 0 || results.staff.length > 0;
  const totalResults = results.categories.length + results.services.length + results.staff.length;

  const clearSearch = () => {
    setQuery('');
    setActiveFilter('all');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.text,
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
      padding: isDesktop ? '2rem' : '0.5rem',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Main Card */}
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '600px' : 'calc(100vw - 1rem)',
        background: mode === 'dark' 
          ? 'rgba(45, 55, 72, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.2)',
        padding: isDesktop ? '3rem' : '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: isDesktop ? '500px' : '400px',
        maxHeight: '80vh',
        overflow: 'hidden'
      }}>
      {/* Header */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: isDesktop ? '2rem' : '1.5rem'
      }}>
        <h1 style={{
          fontSize: isDesktop ? '2.5rem' : '1.8rem',
          fontWeight: '700',
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)'
            : 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 0.5rem 0',
          lineHeight: isDesktop ? '1.2' : '1.1'
        }}>
          Search GlowSlot
        </h1>
        <p style={{
          fontSize: isDesktop ? '1.1rem' : '0.95rem',
          color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
          margin: 0,
          fontWeight: '400',
          lineHeight: '1.4'
        }}>
          Find services, staff, and categories
        </p>
      </div>

      {/* Search Input */}
      <div style={{ 
        width: '100%', 
        marginBottom: isDesktop ? '1.5rem' : '1rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <FaSearch 
            size={isDesktop ? 20 : 18} 
            color={query ? theme.accent : '#999'} 
            style={{
              position: 'absolute',
              left: isDesktop ? '1.2rem' : '1rem',
              zIndex: 2,
              transition: 'color 0.2s ease'
            }}
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services, staff, or categories..."
            style={{
              width: '100%',
              padding: isDesktop ? '1.2rem 1.5rem 1.2rem 3rem' : '0.9rem 1rem 0.9rem 2.5rem',
              borderRadius: '20px',
              border: 'none',
              fontSize: isDesktop ? '1.1rem' : '16px', // 16px prevents zoom on iOS
              background: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.9)',
              color: theme.text,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              backdropFilter: 'blur(10px)',
              border: query ? `2px solid ${theme.accent}` : '2px solid transparent',
              WebkitAppearance: 'none', // Removes default iOS styling
              MozAppearance: 'none'
            }}
          />
          {query && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: isDesktop ? '1rem' : '0.8rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                padding: isDesktop ? '4px' : '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                minWidth: isDesktop ? 'auto' : '32px',
                minHeight: isDesktop ? 'auto' : '32px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = theme.accent;
                e.target.style.background = 'rgba(233, 30, 99, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#999';
                e.target.style.background = 'transparent';
              }}
            >
              <FaTimes size={isDesktop ? 16 : 14} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      {query && (
        <div style={{
          width: '100%',
          marginBottom: isDesktop ? '1rem' : '0.8rem',
          display: 'flex',
          gap: isDesktop ? '0.5rem' : '0.2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {[
            { value: 'all', label: 'All', count: totalResults },
            { value: 'services', label: 'Services', count: results.services.length },
            { value: 'staff', label: 'Staff', count: results.staff.length },
            { value: 'categories', label: 'Categories', count: results.categories.length }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              style={{
                padding: isDesktop ? '0.5rem 1rem' : '0.3rem 0.6rem',
                borderRadius: '20px',
                border: 'none',
                background: activeFilter === filter.value 
                  ? theme.accent 
                  : mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.8)',
                color: activeFilter === filter.value ? '#fff' : theme.text,
                cursor: 'pointer',
                fontSize: isDesktop ? '0.9rem' : '0.75rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: isDesktop ? '0.5rem' : '0.3rem',
                minHeight: isDesktop ? 'auto' : '32px'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== filter.value) {
                  e.target.style.background = mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== filter.value) {
                  e.target.style.background = mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              {filter.label}
              <span style={{
                background: activeFilter === filter.value 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(0, 0, 0, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {query && (
        <div style={{
          width: '100%',
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '1.5rem' : '1rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          maxHeight: '50vh',
          overflow: 'auto'
        }}>
          {isSearching ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              color: theme.text
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(233, 30, 99, 0.2)',
                  borderTop: '3px solid #e91e63',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ fontSize: '1rem', fontWeight: '500' }}>Searching...</span>
              </div>
            </div>
          ) : hasResults ? (
            <>
              {results.categories.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: isDesktop ? '1.2rem' : '1.1rem', 
                    color: theme.accent, 
                    margin: '0 0 1rem 0', 
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FaLayerGroup size={18} />
                    Categories ({results.categories.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {results.categories.map(c => (
                                             <div 
                         key={c.name} 
                         style={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: isDesktop ? '1rem' : '0.8rem', 
                           padding: isDesktop ? '1rem' : '0.8rem', 
                           borderRadius: '12px', 
                           cursor: 'pointer', 
                           transition: 'all 0.2s ease', 
                           color: theme.text,
                           background: mode === 'dark' 
                             ? 'rgba(255, 255, 255, 0.05)' 
                             : 'rgba(0, 0, 0, 0.02)',
                           border: '1px solid transparent',
                           minHeight: isDesktop ? 'auto' : '48px'
                         }}
                        onClick={() => navigate(c.route || `/${c.name.toLowerCase().replace(/ /g, '-')}`)}
                        onMouseEnter={(e) => {
                          e.target.style.background = mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(233, 30, 99, 0.05)';
                          e.target.style.border = `1px solid ${theme.accent}20`;
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)';
                          e.target.style.border = '1px solid transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                        <span style={{ fontWeight: '600', fontSize: isDesktop ? '1rem' : '0.95rem' }}>{c.name}</span>
                        <span style={{ marginLeft: 'auto', color: theme.accent, fontSize: '0.9rem' }}>→</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {results.services.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: isDesktop ? '1.2rem' : '1.1rem', 
                    color: theme.accent, 
                    margin: '0 0 1rem 0', 
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FaCut size={18} />
                    Services ({results.services.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {results.services.map((s, i) => (
                                             <div 
                         key={s.name + i} 
                         style={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: isDesktop ? '1rem' : '0.8rem', 
                           padding: isDesktop ? '1rem' : '0.8rem', 
                           borderRadius: '12px', 
                           cursor: 'pointer', 
                           transition: 'all 0.2s ease', 
                           color: theme.text,
                           background: mode === 'dark' 
                             ? 'rgba(255, 255, 255, 0.05)' 
                             : 'rgba(0, 0, 0, 0.02)',
                           border: '1px solid transparent',
                           minHeight: isDesktop ? 'auto' : '64px'
                         }}
                        onClick={() => navigate(`/${s.category.toLowerCase().replace(/ /g, '-')}`)}
                        onMouseEnter={(e) => {
                          e.target.style.background = mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(233, 30, 99, 0.05)';
                          e.target.style.border = `1px solid ${theme.accent}20`;
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)';
                          e.target.style.border = '1px solid transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                                                 <img 
                           src={s.img} 
                           alt={s.name} 
                           style={{ 
                             width: isDesktop ? '48px' : '40px', 
                             height: isDesktop ? '48px' : '40px', 
                             borderRadius: '12px', 
                             objectFit: 'cover',
                             boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                             flexShrink: 0
                           }} 
                         />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', fontSize: isDesktop ? '1rem' : '0.95rem', marginBottom: '0.2rem' }}>
                            {s.name}
                          </div>
                          <div style={{ 
                            color: theme.accent, 
                            fontWeight: '600', 
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <FaMapMarkerAlt size={12} />
                            {s.category}
                          </div>
                        </div>
                        <div style={{ 
                          textAlign: 'right',
                          fontWeight: '700',
                          color: theme.accent,
                          fontSize: isDesktop ? '1.1rem' : '1rem'
                        }}>
                          {s.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {results.staff.length > 0 && (
                <div>
                  <h3 style={{ 
                    fontSize: isDesktop ? '1.2rem' : '1.1rem', 
                    color: theme.accent, 
                    margin: '0 0 1rem 0', 
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FaUser size={18} />
                    Staff ({results.staff.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {results.staff.map(s => (
                                             <div 
                         key={s.id} 
                         style={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: isDesktop ? '1rem' : '0.8rem', 
                           padding: isDesktop ? '1rem' : '0.8rem', 
                           borderRadius: '12px', 
                           cursor: 'pointer', 
                           transition: 'all 0.2s ease', 
                           color: theme.text,
                           background: mode === 'dark' 
                             ? 'rgba(255, 255, 255, 0.05)' 
                             : 'rgba(0, 0, 0, 0.02)',
                           border: '1px solid transparent',
                           minHeight: isDesktop ? 'auto' : '64px'
                         }}
                        onClick={() => navigate('/staff')}
                        onMouseEnter={(e) => {
                          e.target.style.background = mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(233, 30, 99, 0.05)';
                          e.target.style.border = `1px solid ${theme.accent}20`;
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)';
                          e.target.style.border = '1px solid transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                                                 <img 
                           src={s.avatar} 
                           alt={s.name} 
                           style={{ 
                             width: isDesktop ? '48px' : '40px', 
                             height: isDesktop ? '48px' : '40px', 
                             borderRadius: '50%', 
                             objectFit: 'cover',
                             boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                             flexShrink: 0
                           }} 
                         />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', fontSize: isDesktop ? '1rem' : '0.95rem', marginBottom: '0.2rem' }}>
                            {s.name}
                          </div>
                          <div style={{ 
                            color: theme.accent, 
                            fontWeight: '600', 
                            fontSize: '0.85rem'
                          }}>
                            {s.specialties}
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontWeight: '700',
                          color: '#fbbf24'
                        }}>
                          <FaStar size={14} />
                          {s.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: theme.text 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                margin: '0 0 0.5rem 0',
                color: theme.text
              }}>
                No results found
              </h3>
              <p style={{ 
                color: mode === 'dark' ? '#a0aec0' : '#718096',
                margin: 0,
                fontSize: '1rem'
              }}>
                Try searching for something else or browse our categories
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div style={{
          width: '100%',
          textAlign: 'center',
          padding: isDesktop ? '3rem 1rem' : '2rem 1rem',
          color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
        }}>
          <div style={{ fontSize: isDesktop ? '4rem' : '3rem', marginBottom: '1rem' }}>✨</div>
          <h3 style={{ 
            fontSize: isDesktop ? '1.5rem' : '1.3rem', 
            fontWeight: '600', 
            margin: '0 0 0.5rem 0',
            color: mode === 'dark' ? '#fff' : '#333'
          }}>
            Start searching
          </h3>
          <p style={{ 
            fontSize: isDesktop ? '1.1rem' : '1rem',
            margin: 0,
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            Search for services, staff members, or browse categories
          </p>
        </div>
      )}
      </div>
    </div>
  );
} 