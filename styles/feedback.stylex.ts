import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from './tokens.stylex';

export const feedbackStyles = stylex.create({
  success: {
    backgroundColor: colors.healthyMuted,
    borderRadius: radius.sm,
    marginBlock: 0,
    padding: spacing.sm
  },
  error: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    color: colors.danger,
    marginBlock: 0,
    padding: spacing.sm
  }
});
