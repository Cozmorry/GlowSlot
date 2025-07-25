import React, { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaGem, FaMagic } from 'react-icons/fa';

const LoadingPage = () => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  
  const loadingTexts = [
    "Preparing your beauty journey...",
    "Loading amazing services...",
    "Getting everything ready...",
    "Almost there...",
    "Welcome to GlowSlot ✨"
  ];

  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1000);

    const sparkleTimer = setTimeout(() => {
      setShowSparkles(true);
    }, 800);

    return () => {
      clearInterval(textTimer);
      clearTimeout(sparkleTimer);
    };
  }, []);

  useEffect(() => {
    setCurrentText('');
    let charIndex = 0;
    const text = loadingTexts[textIndex];
    
    const typeTimer = setInterval(() => {
      if (charIndex < text.length) {
        setCurrentText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeTimer);
      }
    }, 50);

    return () => clearInterval(typeTimer);
  }, [textIndex]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
              background: '#e91e63',
              borderRadius: '50%',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
      }}>
        {/* Enhanced logo with better styling */}
        <div style={{
          position: 'relative',
          marginBottom: 40,
        }}>
          <div style={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 25px 50px rgba(233, 30, 99, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            animation: 'pulse 3s ease-in-out infinite',
            position: 'relative',
            border: '3px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <img
                src={process.env.PUBLIC_URL + '/logo192.png'}
                alt="GlowSlot Logo"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  animation: 'logoFloat 4s ease-in-out infinite',
                  display: 'block',
                  maxWidth: '100%',
                  height: 'auto',
                }}
                onError={(e) => {
                  console.log('Logo failed to load, using fallback');
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Enhanced rotating sparkles around logo */}
            {showSparkles && (
              <>
                <FaMagic
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#fff',
                    fontSize: 24,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    animation: 'sparkleRotate 4s linear infinite',
                  }}
                />
                <FaStar
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: -15,
                    transform: 'translateY(-50%)',
                    color: '#fff',
                    fontSize: 20,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    animation: 'sparkleRotate 4s linear infinite reverse',
                  }}
                />
                <FaGem
                  style={{
                    position: 'absolute',
                    bottom: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#fff',
                    fontSize: 22,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    animation: 'sparkleRotate 4s linear infinite',
                  }}
                />
                <FaHeart
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: -15,
                    transform: 'translateY(-50%)',
                    color: '#fff',
                    fontSize: 20,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    animation: 'sparkleRotate 4s linear infinite reverse',
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Enhanced main title with better typography */}
        <h1
          style={{
            fontFamily: '"Playfair Display", "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            color: '#1f2937',
            letterSpacing: '0.05em',
            marginBottom: 16,
            opacity: 0,
            transform: 'translateY(30px)',
            animation: 'fadeInUp 1.5s ease 0.3s forwards',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          GlowSlot
        </h1>

        {/* Enhanced subtitle */}
        <p
          style={{
            fontSize: '1.3rem',
            color: '#6b7280',
            marginBottom: 50,
            opacity: 0,
            transform: 'translateY(30px)',
            animation: 'fadeInUp 1.5s ease 0.5s forwards',
            fontWeight: 400,
            fontFamily: '"Inter", "Segoe UI", sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Your Beauty Journey Starts Here ✨
        </p>

        {/* Enhanced typing text */}
        <div
          style={{
            minHeight: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 50,
          }}
        >
          <p
            style={{
              fontSize: '1.1rem',
              color: '#e91e63',
              fontWeight: 500,
              opacity: 0,
              transform: 'translateY(30px)',
              animation: 'fadeInUp 1.5s ease 0.7s forwards',
              fontFamily: '"Inter", "Segoe UI", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            {currentText}
            <span
              style={{
                animation: 'blink 1s infinite',
                marginLeft: 3,
                color: '#e91e63',
              }}
            >
              |
            </span>
          </p>
        </div>

        {/* Enhanced loading spinner */}
        <div style={{
          position: 'relative',
          width: 100,
          height: 100,
          margin: '0 auto',
        }}>
          {/* Outer ring */}
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute' }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(233, 30, 99, 0.2)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e91e63"
              strokeWidth="4"
              fill="none"
              strokeDasharray="200"
              strokeDashoffset="200"
              strokeLinecap="round"
              style={{
                transformOrigin: 'center',
                animation: 'spin 2.5s linear infinite',
              }}
            />
          </svg>
          
          {/* Inner ring */}
          <svg width="70" height="70" viewBox="0 0 70 70" style={{ position: 'absolute', top: 15, left: 15 }}>
            <circle
              cx="35"
              cy="35"
              r="28"
              stroke="rgba(194, 24, 91, 0.2)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="35"
              cy="35"
              r="28"
              stroke="#c2185b"
              strokeWidth="3"
              fill="none"
              strokeDasharray="150"
              strokeDashoffset="150"
              strokeLinecap="round"
              style={{
                transformOrigin: 'center',
                animation: 'spin 2s linear infinite reverse',
              }}
            />
          </svg>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 25px 50px rgba(233, 30, 99, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 35px 70px rgba(233, 30, 99, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        
        @keyframes sparkleRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.3); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-25px) rotate(180deg); 
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage; 