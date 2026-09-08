import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from './tokens.stylex';

export const plannerStyles = stylex.create({
  planner: {
    display: 'grid',
    gap: spacing.lg
  },
  grid: {
    display: 'grid',
    gap: spacing.md,
    gridTemplateColumns: 'repeat(2, 1fr)',
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr'
    }
  },
  sectionList: { display: 'grid', gap: spacing.md },
  sectionTitle: {
    border: 0,
    borderBottomColor: colors.primary,
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    fontSize: '1.1rem',
    fontWeight: 800,
    padding: spacing.sm,
    width: '100%'
  },
  item: { display: 'flex', gap: spacing.sm, marginTop: spacing.sm },
  itemInput: { flex: 1 }
});
