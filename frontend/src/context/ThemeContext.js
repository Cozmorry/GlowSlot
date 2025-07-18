import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  background: '#f5c6ea',
  card: '#fff',
  text: '#222',
  accent: '#ff6f91',
  input: '#f7f7fa',
  border: '#e3c6f7',
};

const darkTheme = {
  background: '#1a1a1a',
  card: '#232323',
  text: '#fff',
  accent: '#ff6f91',
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