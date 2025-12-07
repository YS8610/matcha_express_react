'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, ThemeContextType } from '@/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function initializeTheme(): void {
  if (typeof document === 'undefined') return;

  const savedTheme = localStorage.getItem('theme');
  let theme: Theme = (savedTheme as Theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const htmlElement = document.documentElement;

  if (theme === 'dark') {
    htmlElement.classList.add('dark');
    htmlElement.classList.remove('light');
  } else {
    htmlElement.classList.add('light');
    htmlElement.classList.remove('dark');
  }
  htmlElement.setAttribute('data-theme', theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const currentTheme = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
    setThemeState(currentTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const htmlElement = document.documentElement;
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }
    htmlElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
