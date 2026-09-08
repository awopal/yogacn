import * as stylex from '@stylexjs/stylex';
import { spacing } from './tokens.stylex';

export const layoutStyles = stylex.create({
  row: { alignItems: 'center', display: 'flex', flexDirection: 'row', gap: spacing.sm },
  rowBetween: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  rowStart: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },
  rowEnd: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  column: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
  center: { alignItems: 'center', display: 'flex', justifyContent: 'center' },
  wrap: { flexWrap: 'wrap' },
});
