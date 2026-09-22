import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { ClassPlan } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { levelLabel, statusLabel } from '@/lib/utils';
import { ViewAllLink } from './ViewAllLink';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export function RecentClassesCard({ plans }: { plans: ClassPlan[] }) {
  const recent = [...plans]
    .sort((a, b) => b.lastTaughtAt.getTime() - a.lastTaughtAt.getTime())
    .slice(0, 3);

  return (
    <section aria-labelledby="recent-classes-title">
      <div {...stylex.props(dashboardStyles.previewHeader)}>
        <div>
          <p {...stylex.props(dashboardStyles.kicker)}>Classes / Teaching</p>
          <h2 id="recent-classes-title" {...stylex.props(typographyStyles.h2)}>
            Recently taught
          </h2>
        </div>

        <ViewAllLink href={INSTRUCTOR_ROUTES.CLASSES.ROOT}>View all classes</ViewAllLink>
      </div>

      <div {...stylex.props(dashboardStyles.previewList)}>
        {recent.map((plan) => (
          <Link
            key={plan.id}
            href={INSTRUCTOR_ROUTES.CLASSES.TEACH(plan.id)}
            {...stylex.props(dashboardStyles.previewRow)}
          >
            <span {...stylex.props(dashboardStyles.previewIcon)} aria-hidden="true">
              {plan.title[0]}
            </span>

            <span {...stylex.props(dashboardStyles.previewCopy)}>
              <strong>{plan.title}</strong>
              <span>
                {levelLabel[plan.level]} · {new Date(plan.lastTaughtAt).toLocaleDateString('en-US')}
              </span>
            </span>

            <Badge variant={plan.status}>{statusLabel[plan.status]}</Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
