"use client";
import React, { createContext, useContext } from 'react';

interface Theme {
  colors: { background: string; text: string; muted: string };
  spacing: { small: string; medium: string; large: string };
  typography: { h1: string; subtitle: string; body: string };
}

const theme: Theme = {
  colors: { background: '#0D111B', text: '#F0F6FC', muted: '#8B949E' },
  spacing: { small: '0.5rem', medium: '1rem', large: '2rem' },
  typography: { h1: '2rem', subtitle: '1rem', body: '1rem' },
};

const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);