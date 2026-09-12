import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, fontWeight, radius, spacing } from './tokens.stylex';

export const typographyStyles = stylex.create({
  body: { color: colors.text, fontSize: fontSize.md, lineHeight: 1.5, marginBlock: 0 },
  brand: {
    fontWeight: fontWeight.bold,
    color: colors.primary,
    backgroundColor: colors.tertiary,
    paddingInline: spacing.md,
    paddingBlock: spacing.xs,
    borderRadius: radius.pill,
  },
  muted: { color: colors.textMuted, marginBlock: 0 },
  caption: { fontSize: fontSize.xs, lineHeight: 1.3 },
  h1: {
    color: colors.primary,
    fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
    fontWeight: fontWeight.bold,
    lineHeight: 1.08,
    marginBlock: 0,
  },
  h2: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
    lineHeight: 1.08,
    marginBlock: 0,
    paddingBlock: spacing.sm,
  },
  h3: { color: colors.primary, fontWeight: fontWeight.bold, lineHeight: 1.08, marginBlock: 0 },
  p: { color: colors.text, fontSize: fontSize.md, lineHeight: 1.5, marginBlock: 0 },
});
