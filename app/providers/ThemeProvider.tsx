'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export type ThemeMode = 'system' | 'light' | 'dark';

type PresetName = 'neon' | 'tech' | 'classic' | 'solarized' | 'mono';

type ThemeSettings = {
  mode: ThemeMode;
  accent: string;
  text: string;
  bg: string;
  font: string;
  secondary: string;
  align: 'left' | 'center' | 'right';
};

type ThemeContextType = ThemeSettings & {
  setMode: (m: ThemeMode) => void;
  setAccent: (c: string) => void;
  setText: (c: string) => void;
  setBg: (c: string) => void;
  setFont: (f: string) => void;
  setAlign: (a: 'left' | 'center' | 'right') => void;
  applyPreset: (p: PresetName) => void;
  reset: () => void;
  effectiveMode: 'light' | 'dark';
  // Design tokens esperados pelos componentes
  colors: {
    background: string;
    text: string;
    muted: string;
    surface: string;
    border: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  typography: {
    h1: string;
    h2: string;
    subtitle: string;
    body: string;
  };
};

const DEFAULT_DARK = {
  accent: '#0E539A',
  text: '#FFFFFF',
  bg: '#0D111B',
  font: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
  secondary: '#272F44',
};

const DEFAULT_LIGHT = {
  accent: '#1e3a8a',
  text: '#111827',
  bg: '#ffffff',
  font: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
  secondary: '#f5f7fb',
};

const PRESETS: Record<
  PresetName,
  {
    accent: string;
    text: string;
    bg: string;
    secondary: string;
    font?: string;
    mode: 'light' | 'dark';
  }
> = {
  neon: {
    accent: '#39FF14',
    text: '#E6F3FF',
    bg: '#0A0F1A',
    secondary: '#0F1626',
    font: '"Segoe UI Variable", system-ui, sans-serif',
    mode: 'dark',
  },
  tech: {
    accent: '#00B8D9',
    text: '#D0E4FF',
    bg: '#0E1726',
    secondary: '#152238',
    font: 'Inter, system-ui, sans-serif',
    mode: 'dark',
  },
  classic: {
    accent: '#2563EB',
    text: '#111827',
    bg: '#FFFFFF',
    secondary: '#F3F4F6',
    font: '"Segoe UI Variable", system-ui, sans-serif',
    mode: 'light',
  },
  solarized: {
    accent: '#268BD2', // solarized blue
    text: '#073642', // base02
    bg: '#FDF6E3', // base3 light bg
    secondary: '#EEE8D5', // base2
    font: 'Inter, system-ui, sans-serif',
    mode: 'light',
  },
  mono: {
    accent: '#6B7280', // gray-500
    text: '#111827', // gray-900
    bg: '#FFFFFF',
    secondary: '#F3F4F6', // gray-100
    font: '"Segoe UI Variable", system-ui, sans-serif',
    mode: 'light',
  },
};

function getSystemMode(): 'light' | 'dark' {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'dark';
  }
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mode, setModeState] = useState<ThemeMode>('light');
  const [accent, setAccentState] = useState<string>(DEFAULT_LIGHT.accent);
  const [text, setTextState] = useState<string>(DEFAULT_LIGHT.text);
  const [bg, setBgState] = useState<string>(DEFAULT_LIGHT.bg);
  const [font, setFontState] = useState<string>(DEFAULT_DARK.font);
  const [secondary, setSecondaryState] = useState<string>(DEFAULT_LIGHT.secondary);
  const [align, setAlignState] = useState<'left' | 'center' | 'right'>('left');

  // Load saved preferences
  useEffect(() => {
    try {
      const m = localStorage.getItem('theme_mode') as ThemeMode | null;
      const a = localStorage.getItem('theme_accent');
      const t = localStorage.getItem('theme_text');
      const b = localStorage.getItem('theme_bg');
      const f = localStorage.getItem('theme_font');
      const s = localStorage.getItem('theme_secondary');
      const al = localStorage.getItem('theme_align') as 'left' | 'center' | 'right' | null;
      if (m === 'light' || m === 'dark' || m === 'system') setModeState(m);
      if (a) setAccentState(a);
      if (t) setTextState(t);
      if (b) setBgState(b);
      if (f) setFontState(f);
      if (s) setSecondaryState(s);
      if (al === 'left' || al === 'center' || al === 'right') setAlignState(al);
    } catch (error) {
      console.debug('Erro ao carregar preferências de tema:', error);
    }
  }, []);

  // Apply URL parameter overrides (non-persistent for /display)
  useEffect(() => {
    try {
      const preset = searchParams?.get('preset') as PresetName | null;
      const accentParam = searchParams?.get('accent');
      const textParam = searchParams?.get('text');
      const bgParam = searchParams?.get('bg');
      const fontParam = searchParams?.get('font');
      const alignParam = searchParams?.get('align') as 'left' | 'center' | 'right' | null;
      const modeParam = searchParams?.get('mode') as ThemeMode | null;
      if (preset && PRESETS[preset]) {
        const p = PRESETS[preset];
        setAccentState(p.accent);
        setTextState(p.text);
        setBgState(p.bg);
        setSecondaryState(p.secondary);
        if (p.font) setFontState(p.font);
        setModeState(p.mode);
      }
      if (accentParam) setAccentState(normalizeColor(accentParam));
      if (textParam) setTextState(normalizeColor(textParam));
      if (bgParam) setBgState(normalizeColor(bgParam));
      if (fontParam) setFontState(fontParam);
      if (alignParam === 'left' || alignParam === 'center' || alignParam === 'right')
        setAlignState(alignParam);
      if (modeParam === 'light' || modeParam === 'dark' || modeParam === 'system')
        setModeState(modeParam);
    } catch (error) {
      console.debug('Erro ao aplicar parâmetros de URL:', error);
    }
  }, [searchParams, pathname]);

  // Persist preferences (skip when on /display)
  useEffect(() => {
    if (pathname && pathname.startsWith('/display')) return;
    try {
      localStorage.setItem('theme_mode', mode);
      localStorage.setItem('theme_accent', accent);
      localStorage.setItem('theme_text', text);
      localStorage.setItem('theme_bg', bg);
      localStorage.setItem('theme_font', font);
      localStorage.setItem('theme_secondary', secondary);
      localStorage.setItem('theme_align', align);
    } catch (error) {
      console.debug('Erro ao persistir preferências de tema:', error);
    }
  }, [mode, accent, text, bg, font, secondary, align, pathname]);

  const effectiveMode = useMemo<'light' | 'dark'>(() => {
    if (mode === 'system') return typeof window !== 'undefined' ? getSystemMode() : 'dark';
    return mode;
  }, [mode]);

  // Tokens derivados do estado atual de tema
  const colorsTokens = useMemo(
    () => ({
      background: bg,
      text,
      muted: effectiveMode === 'dark' ? '#9aa4b2' : '#6b7280',
      surface: secondary,
      border: effectiveMode === 'dark' ? '#243242' : '#e5e7eb',
    }),
    [bg, text, secondary, effectiveMode]
  );

  const spacingTokens = useMemo(
    () => ({
      small: '8px',
      medium: '16px',
      large: '24px',
    }),
    []
  );

  const typographyTokens = useMemo(
    () => ({
      h1: '1.75rem',
      h2: '1.25rem',
      subtitle: '0.95rem',
      body: '1rem',
    }),
    []
  );

  // Apply CSS variables and dark class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (effectiveMode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      root.style.setProperty('--color-brand', accent);
      root.style.setProperty('--color-text', text);
      root.style.setProperty('--color-bg', bg);
      root.style.setProperty('--color-secondary', secondary);
      root.style.setProperty('--font-sans', font);
      root.style.setProperty('--text-align', align);
      // Ensure high contrast for text over brand background
      root.style.setProperty('--color-on-brand', getOnBrandColor(accent));
      root.setAttribute('data-theme', effectiveMode);
    }
  }, [accent, text, bg, font, secondary, align, effectiveMode]);

  // Sync base colors when system preference changes
  useEffect(() => {
    if (mode === 'system' && typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        const sys = mq.matches ? DEFAULT_DARK : DEFAULT_LIGHT;
        setTextState(sys.text);
        setBgState(sys.bg);
        setSecondaryState(sys.secondary);
      };
      handler();
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
  }, [mode]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    const base =
      m === 'dark'
        ? DEFAULT_DARK
        : m === 'light'
          ? DEFAULT_LIGHT
          : getSystemMode() === 'dark'
            ? DEFAULT_DARK
            : DEFAULT_LIGHT;
    setTextState(base.text);
    setBgState(base.bg);
    setSecondaryState(base.secondary);
  };
  const setAccent = (c: string) => setAccentState(c);
  const setText = (c: string) => setTextState(c);
  const setBg = (c: string) => setBgState(c);
  const setFont = (f: string) => setFontState(f);
  const setAlign = (a: 'left' | 'center' | 'right') => setAlignState(a);

  const applyPreset = (p: PresetName) => {
    const preset = PRESETS[p];
    if (!preset) return;
    setAccentState(preset.accent);
    setTextState(preset.text);
    setBgState(preset.bg);
    setSecondaryState(preset.secondary);
    if (preset.font) setFontState(preset.font);
    setModeState(preset.mode);
  };

  const reset = () => {
    const base = effectiveMode === 'dark' ? DEFAULT_DARK : DEFAULT_LIGHT;
    setAccentState(DEFAULT_DARK.accent); // cor original de marca
    setTextState(base.text);
    setBgState(base.bg);
    setSecondaryState(base.secondary);
    setFontState(DEFAULT_DARK.font);
    setAlignState('left');
    setModeState('system');
  };

  const value: ThemeContextType = {
    mode,
    accent,
    text,
    bg,
    font,
    secondary,
    align,
    setMode,
    setAccent,
    setText,
    setBg,
    setFont,
    setAlign,
    applyPreset,
    reset,
    effectiveMode,
    colors: colorsTokens,
    spacing: spacingTokens,
    typography: typographyTokens,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

function normalizeColor(c: string): string {
  const v = c.trim();
  if (v.startsWith('#')) return v;
  if (/^[0-9a-fA-F]{6}$/.test(v)) return `#${v}`;
  return v;
}

function getOnBrandColor(accent: string): string {
  // Parse hex or rgb and return either #000000 or #FFFFFF based on luminance
  const parsed = parseColor(accent);
  if (!parsed) return '#FFFFFF';
  const [r, g, b] = parsed.map((x) => x / 255);
  const lum = relLuminance(r, g, b);
  return lum > 0.5 ? '#000000' : '#FFFFFF';
}

function parseColor(c: string): [number, number, number] | null {
  try {
    if (!c) return null;
    const v = c.trim();
    if (v.startsWith('#')) {
      const hex = v.slice(1);
      const h = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;
      const int = parseInt(h, 16);
      const r = (int >> 16) & 255;
      const g = (int >> 8) & 255;
      const b = int & 255;
      return [r, g, b];
    }
    const rgbMatch = v.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch) return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
    const hslMatch = v.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
    if (hslMatch) {
      const h = Number(hslMatch[1]);
      const s = Number(hslMatch[2]) / 100;
      const l = Number(hslMatch[3]) / 100;
      return hslToRgb(h, s, l);
    }
    return null;
  } catch {
    return null;
  }
}

function relLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (0 <= h && h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (60 <= h && h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (120 <= h && h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (180 <= h && h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (240 <= h && h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }
  return [Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255)];
}
