import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  primary: '#463366',
  secondary: '#c9bae2',
  secondaryMuted: '#eee8f7',
  tertiary: '#fbdd74',
  tertiaryMuted: '#fff3c4',
  accent: '#ff6e6c',
  accentMuted: '#ffe5e5',
  text: '#1f1235',
  textMuted: '#1B1425A6',
  stroke: '#1f1235',
  background: '#ffffff',
  pageBackground: '#f8f7fb',
  healthy: '#57bc68',
  healthyMuted: '#dff3e2',
  danger: '#c94f5a',
});

export const fontSize = stylex.defineVars({
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  heading: '32px',
});

export const spacing = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  page: 'clamp(14px, 2vw, 28px)',
  grid: 'clamp(14px, 2vw, 20px)',
});

export const radius = stylex.defineVars({
  sm: '4px',
  md: '8px',
  lg: '12px',
  card: '24px',
  shell: '30px',
  pill: '999px',
});

export const boxShadow = stylex.defineVars({
  none: 'none',
  subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  sm: '0 2px 0 rgb(31 18 53 / 0.16)',
  md: '0 4px 10px rgb(31 18 53 / 0.16)',
  lg: '0 8px 20px rgb(31 18 53 / 0.18)',
  moonGlow: '0 0 0 4px rgb(251 221 116 / 0.18), 0 0 18px rgb(251 221 116 / 0.58)',
});

export const fontWeight = stylex.defineVars({
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 700,
  bold: 900,
});
