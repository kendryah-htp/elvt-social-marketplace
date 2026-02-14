import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('elvt-theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    const themes = {
      dark: {
        '--bg-primary': '#0A0A0A',
        '--bg-secondary': '#1A1A1A',
        '--bg-tertiary': '#2A2A2A',
        '--text-primary': '#F5F0EB',
        '--text-secondary': '#E5E0DB',
        '--text-muted': '#A0A0A0',
        '--accent': '#D4AF37',
        '--border': 'rgba(212, 175, 55, 0.1)',
      },
      light: {
        '--bg-primary': '#FFFFFF',
        '--bg-secondary': '#F8F6F2',
        '--bg-tertiary': '#EDE8E0',
        '--text-primary': '#1A1A1A',
        '--text-secondary': '#333333',
        '--text-muted': '#666666',
        '--accent': '#D4AF37',
        '--border': 'rgba(0, 0, 0, 0.1)',
      }
    };

    const themeVars = themes[themeName] || themes.dark;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('elvt-theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}