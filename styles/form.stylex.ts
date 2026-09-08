import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing, fontSize } from './tokens.stylex';

export const formStyles = stylex.create({
  field: {
    display: 'grid',
    gap: spacing.xs,
    marginBottom: spacing.sm
  },
  label: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: 700
  },
  control: {
    borderColor: colors.primary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 2,
    paddingBlock: 11,
    paddingInline: 12,
    width: '100%'
  },
  textarea: { minHeight: 120, resize: 'vertical' }
});
