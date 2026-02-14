import React from 'react';
import { ThemeProvider } from '@/components/ThemeContext';

export default function Root({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}