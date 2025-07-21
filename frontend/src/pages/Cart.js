import React from 'react';

const isDesktopWidth = () => window.innerWidth >= 900;

export default function Cart() {
  const [isDesktop, setIsDesktop] = React.useState(isDesktopWidth());
  React.useEffect(() => {
    const handleResize = () => setIsDesktop(isDesktopWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '100%' : 430,
      margin: isDesktop ? undefined : '0 auto',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: isDesktop ? '2rem' : '1rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: isDesktop ? 420 : '100%',
        maxWidth: '100%',
        background: '#fff',
        borderRadius: 24,
        boxShadow: isDesktop ? '0 2px 16px 0 #eee' : 'none',
        padding: isDesktop ? '2.5rem 2rem 2rem 2rem' : '1.5rem 1.2rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Cart Page</h2>
        {/* Add your cart content here */}
      </div>
    </div>
  );
} 