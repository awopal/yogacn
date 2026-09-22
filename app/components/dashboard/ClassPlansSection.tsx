import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { ClassPlan } from '../../../lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { levelLabel, statusLabel } from '../../../lib/utils';
import { EyeIcon } from '@/components/icons';
import { PublishToggle } from './PublishToggle';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export function ClassPlansSection({ plans }: { plans: ClassPlan[] }) {
  return (
    <section {...stylex.props(dashboardStyles.allPlans)}>
      <div {...stylex.props(pageStyles.sectionHead)}>
        <h2 {...stylex.props(typographyStyles.h2)}>Class plans</h2>
        <span {...stylex.props(typographyStyles.muted)}>{plans.length} plans</span>
      </div>

      <ul {...stylex.props(dashboardStyles.allClasses)}>
        {plans.map((plan) => (
          <li key={plan.id} {...stylex.props(dashboardStyles.allClassRow)}>
            <div {...stylex.props(dashboardStyles.allClassInfo)}>
              <span {...stylex.props(dashboardStyles.allClassTitle)}>{plan.title}</span>
              <span {...stylex.props(dashboardStyles.allClassMeta)}>
                {plan.plannedDurationMinutes} min · {levelLabel[plan.level]} · {plan.taughtCount}{' '}
                times taught
              </span>
            </div>

            <Badge variant={plan.status} {...stylex.props(dashboardStyles.allClassStatus)}>
              {statusLabel[plan.status]}
            </Badge>

            <PublishToggle planTitle={plan.title} initialPublished={plan.isPublished} />

            <Button variant="ghost" asChild {...stylex.props(dashboardStyles.allClassAction)}>
              <Link
                aria-label={`Open ${plan.title}`}
                href={INSTRUCTOR_ROUTES.CLASSES.EDIT(plan.id)}
                title="Open plan"
              >
                <EyeIcon size={28} aria-hidden="true" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
