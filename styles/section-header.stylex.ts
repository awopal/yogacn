import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, fontWeight, spacing } from './tokens.stylex';
import { size } from 'zod';

export const sectionHeaderStyles = stylex.create({
  header: {
    alignItems: 'start',
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'space-between',
    '@media (max-width: 560px)': { flexDirection: 'column' },
  },
  content: {
    display: 'grid',
    gap: spacing.xs,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBlock: 0,
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginBlock: 0,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBlock: 0,
  },
});
