import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { AttendanceSummary } from '@/lib/server/attendance';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';
import { ViewAllLink } from './ViewAllLink';

export function ActivitySummaryCard({ summary }: { summary: AttendanceSummary }) {
  return (
    <section id="teaching-activity" aria-labelledby="activity-title">
      <div {...stylex.props(dashboardStyles.previewHeader)}>
        <div>
          <p {...stylex.props(dashboardStyles.kicker)}>Teaching activity</p>
          <h2 id="activity-title" {...stylex.props(typographyStyles.h2)}>
            A healthy rhythm
          </h2>
        </div>
        <ViewAllLink href="#teaching-activity">View timeline</ViewAllLink>
      </div>
      <div {...stylex.props(dashboardStyles.activityMetrics)}>
        <div>
          <strong>{summary.activeYogis}</strong>
          <span>active yogis</span>
        </div>
        <div>
          <strong>{summary.uniqueYogis}</strong>
          <span>attended recently</span>
        </div>
        <div>
          <strong>{summary.totalVisits}</strong>
          <span>total visits</span>
        </div>
      </div>
      <Link href={INSTRUCTOR_ROUTES.YOGIS.ROOT} {...stylex.props(dashboardStyles.activityPreview)}>
        <span>Attendance is building steadily</span>
        <progress
          value={summary.totalVisits}
          max={10}
          {...stylex.props(dashboardStyles.activityBar)}
          aria-label="Attendance progress"
        />
        <span>View yogi notes →</span>
      </Link>
    </section>
  );
}
