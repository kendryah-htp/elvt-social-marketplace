import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { settings: null };
  }
  return context;
};

const fontSizeMap = {
  small: '14px',
  medium: '16px',
  large: '18px'
};

const fontImports = {
  'Inter': '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");',
  'Poppins': '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");',
  'Montserrat': '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap");',
  'Playfair Display': '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap");',
  'Space Grotesk': '@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");'
};

export default function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const results = await base44.entities.PlatformSettings.list();
      return results[0] || {
        theme_mode: 'dark',
        theme_style: 'modern',
        primary_color: '#8B5CF6',
        font_family: 'Inter',
        font_size: 'medium'
      };
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!settings || !mounted) return;

    // Apply theme mode
    if (settings.theme_mode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Apply primary color
    if (settings.primary_color) {
      document.documentElement.style.setProperty('--accent', settings.primary_color);
    }

    // Apply font
    if (settings.font_family) {
      const styleId = 'dynamic-font-import';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = fontImports[settings.font_family] || fontImports['Inter'];
      document.body.style.fontFamily = `'${settings.font_family}', sans-serif`;
    }

    // Apply font size
    if (settings.font_size) {
      document.documentElement.style.fontSize = fontSizeMap[settings.font_size] || fontSizeMap.medium;
    }
  }, [settings, mounted]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ settings }}>
      {children}
    </ThemeContext.Provider>
  );
}