import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from './tokens.stylex';

export const loginStyles = stylex.create({
  wrap: {
    alignItems: 'center',
    display: 'grid',
    gap: '8vw',
    gridTemplateColumns: '1fr minmax(320px, 460px)',
    minHeight: '100vh',
    padding: '8vw',
    '@media (max-width: 700px)': {
      display: 'flex',
      flexWrap: 'wrap',
      paddingBlock: spacing.lg,
      paddingInline: spacing.md,
    },
  },
  card: {
    display: 'grid',
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.primary,
    marginBlock: 0,
  },
  cardDescription: {
    marginBlock: 0,
  },
});
