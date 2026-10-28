export type Theme = 'dark' | 'light' | 'glassy';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  glow: string;
  glass: string;
}

export const themes: Record<Theme, ThemeColors> = {
  dark: {
    background: '#0a0a0f',
    foreground: '#ffffff',
    card: '#15151a',
    cardForeground: '#ffffff',
    primary: '#8b5cf6',
    primaryForeground: '#ffffff',
    secondary: '#1e1e24',
    secondaryForeground: '#ffffff',
    accent: '#a78bfa',
    accentForeground: '#ffffff',
    muted: '#1f1f25',
    mutedForeground: '#a1a1aa',
    border: '#2a2a35',
    input: '#1e1e24',
    ring: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.3)',
    glass: 'rgba(21, 21, 26, 0.8)',
  },
  light: {
    background: '#ffffff',
    foreground: '#0a0a0f',
    card: '#f5f5f5',
    cardForeground: '#0a0a0f',
    primary: '#7c3aed',
    primaryForeground: '#ffffff',
    secondary: '#e5e5e5',
    secondaryForeground: '#0a0a0f',
    accent: '#8b5cf6',
    accentForeground: '#ffffff',
    muted: '#f0f0f0',
    mutedForeground: '#6b7280',
    border: '#e0e0e0',
    input: '#e5e5e5',
    ring: '#7c3aed',
    glow: 'rgba(124, 58, 237, 0.2)',
    glass: 'rgba(245, 245, 245, 0.8)',
  },
  glassy: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    foreground: '#ffffff',
    card: 'rgba(255, 255, 255, 0.1)',
    cardForeground: '#ffffff',
    primary: '#ffffff',
    primaryForeground: '#7c3aed',
    secondary: 'rgba(255, 255, 255, 0.15)',
    secondaryForeground: '#ffffff',
    accent: '#fbbf24',
    accentForeground: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.08)',
    mutedForeground: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.2)',
    input: 'rgba(255, 255, 255, 0.1)',
    ring: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.4)',
    glass: 'rgba(255, 255, 255, 0.15)',
  },
};

export const defaultTheme: Theme = 'dark';
