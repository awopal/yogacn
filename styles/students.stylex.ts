import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from './tokens.stylex';

export const studentsStyles = stylex.create({
  privacy: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    paddingBlock: spacing.md,
    paddingInline: spacing.lg,
  },
  privacyList: { marginBottom: 0 },
});
