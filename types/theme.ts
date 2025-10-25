export interface Colors {
  background: string;
  surface: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
}

export const lightColors: Colors = {
  background: '#ffffff',
  surface: '#f4f4f5', 
  accent: '#0891b2',
  text: '#18181b',
  textMuted: '#71717a',
  border: '#e4e4e7'
};

export const darkColors: Colors = {
  background: '#1a1b1e',
  surface: '#2c2e33',
  accent: '#06b6d4',
  text: '#ffffff', 
  textMuted: '#a1a1aa',
  border: '#2e2e2e'
};