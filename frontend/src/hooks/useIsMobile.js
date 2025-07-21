import { useState, useEffect } from 'react';

const isMobileWidth = () => window.innerWidth < 900;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(isMobileWidth());

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}; 