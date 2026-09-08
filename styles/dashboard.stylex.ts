import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, radius, spacing } from './tokens.stylex';

export const dashboardStyles = stylex.create({
  planList: { display: 'grid', gap: spacing.md, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  planCard: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 2,
    display: 'grid',
    gap: spacing.md,
    minHeight: 286,
    padding: spacing.md
  },
  planTop: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  taughtMeta: { textAlign: 'end' },
  meta: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: fontSize.sm,
    gap: spacing.sm
  },
  actions: {
    alignItems: 'center',
    alignSelf: 'end',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: spacing.sm
  },
  adjustment: {
    backgroundColor: colors.surface,
    borderLeftColor: colors.accent,
    borderLeftStyle: 'solid',
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    display: 'grid',
    fontSize: fontSize.sm,
    gap: spacing.xs,
    lineHeight: 1.35,
    marginTop: 1,
    paddingBlock: 11,
    paddingInline: 12
  },
  adjustmentTitle: { fontSize: fontSize.xs },
  attendance: { marginTop: 56 },
  summaryGrid: {
    display: 'grid',
    gap: spacing.md,
    gridTemplateColumns: 'repeat(3, 1fr)',
    marginBlock: spacing.md,
    marginBottom: 28
  },
  summaryCard: { borderRadius: radius.lg, display: 'grid', gap: spacing.sm, padding: spacing.lg },
  summaryGreen: { backgroundColor: colors.healthyMuted },
  summaryPink: { backgroundColor: '#ffe0df' },
  summaryLavender: { backgroundColor: '#e9e1f3' },
  feed: { display: 'grid', gap: spacing.sm, maxWidth: 760 },
  attendanceItem: {
    alignItems: 'center',
    borderBottomColor: '#ded8e6',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: spacing.md,
    paddingBlock: 14
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    display: 'grid',
    fontWeight: 800,
    height: 38,
    justifyContent: 'center',
    width: 38
  }
});
