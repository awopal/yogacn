import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  primary: '#463366',
  secondary: '#c9bae2',
  tertiary: '#fbdd74',
  accent: '#ff6e6c',
  text: '#1f1235',
  textMuted: 'rgb(27 20 37 / 0.65)',
  stroke: '#1f1235',
  background: '#ffffff',
  surface: '#ffe5e5',
  healthy: '#57bc68',
  healthyMuted: '#dff3e2',
  danger: '#c94f5a'
});

export const fontSize = stylex.defineVars({
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  heading: '32px'
});

export const spacing = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px'
});

export const radius = stylex.defineVars({
  sm: '4px',
  md: '8px',
  lg: '12px',
  pill: '999px'
});
