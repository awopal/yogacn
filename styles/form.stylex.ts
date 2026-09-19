import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing, fontSize, fontWeight } from './tokens.stylex';

export const formStyles = stylex.create({
  field: {
    display: 'grid',
    gap: spacing.xs,
    marginBottom: '12px',
  },
  label: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: '0.04em',
  },
  requiredMark: { color: colors.danger },
  control: {
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    minHeight: 38,
    paddingBlock: 8,
    paddingInline: 12,
    width: '100%',
  },
  textarea: { minHeight: 120 },
});
