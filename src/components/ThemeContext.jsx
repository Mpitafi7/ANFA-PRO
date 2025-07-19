import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'light');
      }
    } else {
      // system
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'system');
      }
    }
  }, [theme]);

  // Listen to system theme changes if theme is 'system'
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return;
    
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (media.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      // system: toggle to dark
      return 'dark';
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 