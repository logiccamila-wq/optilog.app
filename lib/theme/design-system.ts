// Design System - OptiLog TMS
// Sistema de design unificado para garantir consistência visual

export const DESIGN_SYSTEM = {
  // Paleta de cores
  colors: {
    primary: {
      main: '#2563eb',      // Azul principal
      light: '#60a5fa',     // Azul claro
      dark: '#1e40af',      // Azul escuro
      contrast: '#ffffff',  // Texto sobre primário
    },
    secondary: {
      main: '#10b981',      // Verde
      light: '#34d399',
      dark: '#059669',
      contrast: '#ffffff',
    },
    error: {
      main: '#ef4444',      // Vermelho
      light: '#f87171',
      dark: '#dc2626',
      contrast: '#ffffff',
    },
    warning: {
      main: '#f59e0b',      // Laranja
      light: '#fbbf24',
      dark: '#d97706',
      contrast: '#000000',
    },
    info: {
      main: '#3b82f6',      // Azul info
      light: '#60a5fa',
      dark: '#2563eb',
      contrast: '#ffffff',
    },
    success: {
      main: '#10b981',      // Verde sucesso
      light: '#34d399',
      dark: '#059669',
      contrast: '#ffffff',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
      dark: '#111827',
    },
  },

  // Tipografia
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'].join(','),
      mono: ['Fira Code', 'monospace'].join(','),
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Espaçamentos
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  // Bordas
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Sombras
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Transições
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Breakpoints (mobile-first)
  breakpoints: {
    xs: '0px',
    sm: '640px',     // Mobile landscape / Tablet portrait
    md: '768px',     // Tablet
    lg: '1024px',    // Desktop
    xl: '1280px',    // Large desktop
    '2xl': '1536px', // Extra large desktop
  },

  // Z-index
  zIndex: {
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  // Animações
  animation: {
    fadeIn: {
      keyframes: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      duration: '250ms',
      timingFunction: 'ease-in',
    },
    slideUp: {
      keyframes: {
        '0%': { transform: 'translateY(20px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      duration: '300ms',
      timingFunction: 'ease-out',
    },
    scaleIn: {
      keyframes: {
        '0%': { transform: 'scale(0.9)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
      duration: '200ms',
      timingFunction: 'ease-out',
    },
  },
};

// Tipos TypeScript
export type ColorKey = keyof typeof DESIGN_SYSTEM.colors;
export type SpacingKey = keyof typeof DESIGN_SYSTEM.spacing;
export type BorderRadiusKey = keyof typeof DESIGN_SYSTEM.borderRadius;
export type ShadowKey = keyof typeof DESIGN_SYSTEM.shadows;
export type BreakpointKey = keyof typeof DESIGN_SYSTEM.breakpoints;

// Helper functions
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = DESIGN_SYSTEM.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export const getSpacing = (key: SpacingKey): string => {
  return DESIGN_SYSTEM.spacing[key];
};

export const getBorderRadius = (key: BorderRadiusKey): string => {
  return DESIGN_SYSTEM.borderRadius[key];
};

export const getShadow = (key: ShadowKey): string => {
  return DESIGN_SYSTEM.shadows[key];
};

// Media query helper
export const mediaQuery = (breakpoint: BreakpointKey): string => {
  return `@media (min-width: ${DESIGN_SYSTEM.breakpoints[breakpoint]})`;
};