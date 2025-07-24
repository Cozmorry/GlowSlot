import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaTwitter, FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart, FaUsers, FaStar, FaAward } from 'react-icons/fa';

const isDesktopWidth = () => window.innerWidth >= 900;

export default function About() {
  const { theme, mode } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    { icon: <FaUsers size={24} />, number: '500+', label: 'Happy Clients' },
    { icon: <FaStar size={24} />, number: '4.9', label: 'Average Rating' },
    { icon: <FaAward size={24} />, number: '50+', label: 'Expert Staff' },
    { icon: <FaHeart size={24} />, number: '1000+', label: 'Services Booked' }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '900px' : 'calc(100% - 2rem)',
      margin: '0 auto',
      padding: isDesktop ? '2rem' : '1rem',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.text,
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
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: isDesktop ? '3rem' : '2rem',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: isDesktop ? '3rem' : '2.5rem',
          fontWeight: '900',
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)'
            : 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 1rem 0',
          letterSpacing: '2px'
        }}>
          GlowSlot
        </h1>
        <p style={{
          fontSize: isDesktop ? '1.2rem' : '1.1rem',
          color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
          margin: 0,
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Your Beauty & Wellness Journey Starts Here
        </p>
      </div>

      {/* Stats Section */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
        gap: isDesktop ? '1rem' : '0.8rem',
        marginBottom: isDesktop ? '3rem' : '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.8)' 
              : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            padding: isDesktop ? '1.5rem' : '1rem',
            textAlign: 'center',
            border: mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
          }}
          >
            <div style={{
              color: theme.accent,
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: isDesktop ? '1.8rem' : '1.3rem',
              fontWeight: '700',
              color: theme.text,
              marginBottom: '0.3rem'
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%'
      }}>
        {/* Welcome Section */}
        <div style={{ 
          marginBottom: '2rem',
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '2rem' : '1.5rem',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: isDesktop ? '1.8rem' : '1.5rem',
            fontWeight: '700',
            color: theme.accent,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>✨</span>
            Welcome to GlowSlot!
          </h2>
          <p style={{
            fontSize: isDesktop ? '1.1rem' : '1rem',
            lineHeight: '1.7',
            color: mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
            margin: 0
          }}>
            At GlowSlot, we make it easy to book spa, hair, and nail appointments with our best beauty experts. 
            Our goal is to help you take care of yourself with minimal hassle and maximum satisfaction.
          </p>
        </div>

        {/* Our Story */}
        <div style={{ 
          marginBottom: '2rem',
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '2rem' : '1.5rem',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: isDesktop ? '1.4rem' : '1.2rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📖</span>
            Our Story
          </h3>
          <p style={{
            fontSize: isDesktop ? '1rem' : '0.95rem',
            lineHeight: '1.7',
            color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
            margin: 0
          }}>
            Founded in 2024, <strong>GlowSlot</strong> was created to simplify the process of booking beauty and wellness appointments. 
            We wanted to eliminate the inconvenience of phone calls and difficult scheduling, providing a straightforward, 
            user-friendly platform that connects you with the best beauty professionals in your area.
          </p>
        </div>

        {/* What We Offer */}
        <div style={{ 
          marginBottom: '2rem',
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '2rem' : '1.5rem',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: isDesktop ? '1.4rem' : '1.2rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🎯</span>
            What We Offer
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
            gap: '1rem'
          }}>
            {[
              'Variety of Services: From relaxing spa treatments to fresh haircuts and beautiful nails',
              'Trusted Providers: We work with reputable salons and spas to ensure quality care',
              'Simple Booking: Easy appointment scheduling with just a few taps',
              'Special Deals: Access exclusive promotions and discounts through our app'
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.8rem',
                background: mode === 'dark' 
                  ? 'rgba(45, 55, 72, 0.5)' 
                  : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                border: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.05)' 
                  : '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <span style={{ color: theme.accent, fontSize: '0.8rem', marginTop: '0.2rem' }}>•</span>
                <span style={{
                  fontSize: isDesktop ? '0.95rem' : '0.9rem',
                  lineHeight: '1.5',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div style={{ 
          marginBottom: '2rem',
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '2rem' : '1.5rem',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: isDesktop ? '1.4rem' : '1.2rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>💎</span>
            Why Choose Us?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr',
            gap: '1rem'
          }}>
            {[
              'Convenience: Book appointments anytime, anywhere',
              'Real Reviews: Check authentic reviews from other users',
              'Personalized: Save favorites and get tailored recommendations'
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '1rem',
                background: mode === 'dark' 
                  ? 'rgba(45, 55, 72, 0.5)' 
                  : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                border: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.05)' 
                  : '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  fontSize: isDesktop ? '1rem' : '0.9rem',
                  lineHeight: '1.5',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  fontWeight: '500'
                }}>
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ 
          marginBottom: '2rem',
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '2rem' : '1.5rem',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: isDesktop ? '1.4rem' : '1.2rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📞</span>
            Contact Us
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '1rem',
              background: mode === 'dark' 
                ? 'rgba(45, 55, 72, 0.5)' 
                : 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <FaPhone size={18} color={theme.accent} />
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '0.2rem'
                }}>
                  Phone
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                }}>
                  +254 712 345 689
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '1rem',
              background: mode === 'dark' 
                ? 'rgba(45, 55, 72, 0.5)' 
                : 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <FaEnvelope size={18} color={theme.accent} />
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '0.2rem'
                }}>
                  Email
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                }}>
                  glowslot@info.co.ke
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div style={{ 
          background: mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: isDesktop ? '2rem' : '1.5rem',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: isDesktop ? '1.4rem' : '1.2rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🌐</span>
            Follow Us
          </h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: isDesktop ? 'flex-start' : 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: <FaTwitter size={20} />, name: '@glow_slot', color: '#1DA1F2' },
              { icon: <FaFacebook size={20} />, name: 'GLOW SLOT', color: '#1877F2' },
              { icon: <FaInstagram size={20} />, name: 'glowslot', color: '#E4405F' }
            ].map((social, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.2rem',
                background: mode === 'dark' 
                  ? 'rgba(45, 55, 72, 0.8)' 
                  : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '25px',
                border: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div style={{ color: social.color }}>
                  {social.icon}
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: theme.text
                }}>
                  {social.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 