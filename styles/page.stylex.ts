import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, fontWeight, spacing } from './tokens.stylex';

export const pageStyles = stylex.create({
  page: {
    marginInline: 'auto',
    paddingBottom: spacing.page,
    paddingInline: spacing.page,
    width: '100%',
  },
  fullHeight: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  pageHead: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: '28px',
    '@media (max-width: 640px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  sectionHead: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: '0.14em',
    marginBlock: 0,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  backLink: {
    color: colors.primary,
    textDecorationLine: 'none',
    textUnderlineOffset: 3,
    ':hover': { textDecorationLine: 'underline' },
  },
  titleWithStatus: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
