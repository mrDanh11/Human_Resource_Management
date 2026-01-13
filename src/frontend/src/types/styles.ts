/**
 * Application-wide style constants
 */

export const COLORS = {
  background: {
    primary: '#fafdff',
    card: '#ffffff',
    hover: '#EDF4FF',
  },
  border: {
    default: '#E6E6E6',
    primary: '#0066FF',
  },
  text: {
    primary: '#0066FF',
    secondary: '#6B7280',
  },
} as const;

export const SHADOWS = {
  card: '0 1px 4px rgba(0,102,255,0.08)',
} as const;

export const BACKGROUNDS = {
  page: { background: COLORS.background.primary },
  card: { background: COLORS.background.card },
} as const;
