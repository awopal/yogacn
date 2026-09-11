import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { ClassPlan } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { levelLabel, statusLabel } from '@/lib/utils';
import { ViewAllLink } from './ViewAllLink';

export function ClassPlansPreview({ plans }: { plans: ClassPlan[] }) {
  return (
    <section aria-labelledby="class-plans-title">
      <div {...stylex.props(dashboardStyles.previewHeader)}>
        <div>
          <p {...stylex.props(dashboardStyles.kicker)}>Planning space</p>
          <h2 id="class-plans-title" {...stylex.props(typographyStyles.h2)}>
            Class plans
          </h2>
        </div>
        <ViewAllLink href="/classes">View all plans</ViewAllLink>
      </div>
      <p {...stylex.props(dashboardStyles.planCount)}>{plans.length} plans ready in your library</p>
      <div {...stylex.props(dashboardStyles.previewList)}>
        {plans.slice(0, 3).map((plan) => (
          <Link
            key={plan.id}
            href={`/classes/${plan.id}/edit`}
            {...stylex.props(dashboardStyles.planPreviewRow)}
          >
            <span {...stylex.props(dashboardStyles.previewCopy)}>
              <strong>{plan.title}</strong>
              <span>
                {plan.plannedDurationMinutes} min · {levelLabel[plan.level]}
              </span>
            </span>
            <Badge variant={plan.status}>{statusLabel[plan.status]}</Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
