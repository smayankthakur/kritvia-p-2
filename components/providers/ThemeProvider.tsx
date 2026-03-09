'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: 'class' | 'data-theme' | string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of wrong theme and enable smooth transitions
  useEffect(() => {
    if (mounted) {
      // Remove no-transitions class after theme is applied
      const timer = setTimeout(() => {
        document.documentElement.classList.remove('no-transitions');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Add transition class to html for smooth theme switching
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.add('theme-transition');
    }
  }, [mounted]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="kritvia-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
