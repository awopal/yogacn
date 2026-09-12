import * as stylex from '@stylexjs/stylex';
import { colors, fontWeight, radius, spacing } from './tokens.stylex';

export const teachingStyles = stylex.create({
  mode: {
    backgroundColor: colors.secondary,
    minHeight: '100vh',
    padding: '5vw',
  },
  card: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 2,
    marginBlock: '8vh 24px',
    marginInline: 'auto',
    maxWidth: fontWeight.bold,
    padding: 'clamp(28px, 7vw, 80px)',
  },
  title: {
    color: colors.primary,
    fontSize: 'clamp(3rem, 9vw, 8rem)',
    marginBlock: spacing.md,
  },
  cue: {
    color: colors.text,
    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    maxWidth: 650,
  },
  progress: {
    backgroundColor: colors.accentMuted,
    height: 8,
    marginBlock: '48px 28px',
  },
  progressFill: {
    backgroundColor: colors.accent,
    display: 'block',
    height: '100%',
  },
});
