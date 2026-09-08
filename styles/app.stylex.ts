import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, radius, spacing } from './tokens.stylex';

export const appStyles = stylex.create({
  demoNotice: {
    backgroundColor: colors.primary,
    color: colors.healthy,
    fontSize: fontSize.xs,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    textAlign: 'center'
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.lg,
    justifyContent: 'space-between',
    minHeight: 92,
    paddingBlock: 22,
    paddingInline: 'clamp(18px, 4.7vw, 60px)'
  },
  nav: {
    display: 'flex',
    gap: spacing.sm,
    '@media (max-width: 700px)': {
      order: 3,
      overflowX: 'auto',
      width: '100%'
    }
  },
  navLink: {
    borderRadius: radius.sm,
    fontWeight: 700,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    ':hover': {
      backgroundColor: colors.surface,
      fontWeight: 900
    }
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    borderStyle: 'solid',
    borderWidth: 2,
    display: 'grid',
    justifyContent: 'center',
    height: 40,
    width: 40
  },
  brandCluster: { alignItems: 'center', display: 'flex', gap: spacing.sm },
  brand: {
    alignItems: 'center',
    display: 'flex',
    fontSize: fontSize.lg,
    fontWeight: 800,
    gap: spacing.sm,
    lineHeight: 1
  },
  brandSmall: {
    display: 'inline-block',
    fontSize: fontSize.xs,
    letterSpacing: '0.13em',
    marginTop: spacing.xs
  }
});
