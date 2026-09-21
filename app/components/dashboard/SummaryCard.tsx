import * as stylex from '@stylexjs/stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';

export function SummaryCard({
  label,
  value,
  detail,
  tone = 'purple',
  compact = false,
}: {
  label: string;
  value: number | string;
  detail: string;
  tone?: 'purple' | 'yellow' | 'green' | 'pink';
  compact?: boolean;
}) {
  return (
    <article
      {...stylex.props(
        dashboardStyles.statCard,
        tone === 'yellow' && dashboardStyles.statYellow,
        tone === 'green' && dashboardStyles.statGreen,
        tone === 'pink' && dashboardStyles.statPink,
        tone === 'purple' && dashboardStyles.statPurple,
        compact && dashboardStyles.statCardCompact,
      )}
    >
      <span
        {...stylex.props(dashboardStyles.statLabel, compact && dashboardStyles.statLabelCompact)}
      >
        {label}
      </span>
      <div {...stylex.props(dashboardStyles.statValueWrapper)}>
        <strong
          {...stylex.props(dashboardStyles.statValue, compact && dashboardStyles.statValueCompact)}
        >
          {value}
        </strong>
        <span {...stylex.props(dashboardStyles.statMeta)}>{detail}</span>
      </div>
    </article>
  );
}
