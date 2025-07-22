import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  background: '#FFFFFF', // White
  card: '#F5F5F5', // Light Grey
  text: '#333333', // Dark Grey for text
  accent: '#D72660', // Darker Pink
  input: '#F5F5F5', // Light Grey
  border: '#DDDDDD', // Lighter Grey for borders
};

const darkTheme = {
  background: '#1a1a1a',
  card: '#232323',
  text: '#fff',
  accent: '#D72660', // Darker Pink
  input: '#2a2a2a',
  border: '#444',
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.body.style.background = theme.background;
  }, [mode, theme.background]);

  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 