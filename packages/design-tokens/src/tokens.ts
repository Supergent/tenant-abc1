/**
 * Design Tokens - TypeScript Constants
 *
 * Type-safe access to design tokens
 */

export const colors = {
  primary: {
    base: '#6366f1',
    foreground: '#ffffff',
    emphasis: '#4338ca',
  },
  secondary: {
    base: '#0ea5e9',
    foreground: '#0f172a',
    emphasis: '#0284c7',
  },
  accent: {
    base: '#f97316',
    foreground: '#0f172a',
    emphasis: '#ea580c',
  },
  success: {
    base: '#16a34a',
    foreground: '#022c22',
    emphasis: '#15803d',
  },
  warning: {
    base: '#facc15',
    foreground: '#422006',
    emphasis: '#eab308',
  },
  danger: {
    base: '#ef4444',
    foreground: '#450a0a',
    emphasis: '#dc2626',
  },
} as const;

export const neutrals = {
  background: '#f8fafc',
  surface: '#ffffff',
  muted: '#e2e8f0',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  '2xl': 40,
} as const;

export const typography = {
  fontFamily: "Inter, 'Inter Variable', system-ui, sans-serif",
  headingsFamily: "'Plus Jakarta Sans', 'Inter Variable', sans-serif",
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const motion = {
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  duration: {
    fast: 120,
    base: 200,
    slow: 320,
  },
} as const;
