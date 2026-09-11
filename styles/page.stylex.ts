import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, spacing } from './tokens.stylex';

export const pageStyles = stylex.create({
  page: {
    marginInline: 'auto',
    paddingBottom: spacing.page,
    paddingInline: spacing.page,
    width: '100%',
  },
  pageHead: {
    alignItems: 'flex-end',
    display: 'flex',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
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
    fontWeight: 700,
    letterSpacing: '0.14em',
    marginBlock: 0,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
