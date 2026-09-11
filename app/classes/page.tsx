import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { demoPlans } from '../../lib/server/demo';
import AppShell from '../components/AppShell';
import { Badge } from '@/components/ui/badge';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { levelLabel, statusLabel } from '@/lib/utils';

export default function ClassesPage() {
  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page)}>
        <div {...stylex.props(pageStyles.pageHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>Classes / Teaching</p>
            <h1 {...stylex.props(typographyStyles.h1)}>Class library</h1>
            <p {...stylex.props(typographyStyles.muted)}>
              Your complete collection of plans and teaching paths.
            </p>
          </div>
        </div>
        <section
          aria-labelledby="class-library-title"
          {...stylex.props(dashboardStyles.overviewCard)}
        >
          <h2 id="class-library-title" {...stylex.props(typographyStyles.h2)}>
            All class plans
          </h2>
          <ul {...stylex.props(dashboardStyles.fullPlanList)}>
            {demoPlans.map((plan) => (
              <li key={plan.id} {...stylex.props(dashboardStyles.fullPlanRow)}>
                <div {...stylex.props(dashboardStyles.previewCopy)}>
                  <strong>{plan.title}</strong>
                  <span>
                    {plan.plannedDurationMinutes} min · {levelLabel[plan.level]} · taught{' '}
                    {plan.taughtCount} times
                  </span>
                </div>
                <Badge variant={plan.status}>{statusLabel[plan.status]}</Badge>
                <Link
                  href={`/classes/${plan.id}/edit`}
                  {...stylex.props(dashboardStyles.viewAllLink)}
                >
                  Open plan
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
