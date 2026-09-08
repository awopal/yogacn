import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from './tokens.stylex';

export const studentStyles = stylex.create({
  list: { display: 'grid', gap: spacing.sm },
  item: { alignItems: 'center', display: 'flex', gap: spacing.md },
  content: { flex: 1 },
  title: { color: colors.primary, marginBlock: 0 },
  description: { marginBlock: 0, marginTop: spacing.xs }
});
