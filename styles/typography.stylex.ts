import * as stylex from '@stylexjs/stylex';
import { colors, fontSize } from './tokens.stylex';

export const typographyStyles = stylex.create({
  body: { color: colors.text, fontSize: fontSize.md, lineHeight: 1.5, marginBlock: 0 },
  muted: { color: colors.textMuted, marginBlock: 0 },
  caption: { fontSize: fontSize.xs, lineHeight: 1.3 },
  h1: {
    color: colors.primary,
    fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
    fontWeight: 800,
    lineHeight: 1.08,
    marginBlock: 0
  },
  h2: { color: colors.primary, fontWeight: 800, lineHeight: 1.08, marginBlock: 0 },
  h3: { color: colors.primary, fontWeight: 800, lineHeight: 1.08, marginBlock: 0 },
  p: { color: colors.text, fontSize: fontSize.md, lineHeight: 1.5, marginBlock: 0 }
});
