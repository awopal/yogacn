import { notFound } from 'next/navigation';
import Link from 'next/link';
import AppShell from '../../../components/AppShell';
import Planner from '../../../components/Planner';
import { demoPlans } from '../../../../lib/server/demo';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { DeleteClassButton } from '../../../components/DeleteClassButton';
import { ClassPlanTitle } from '../../../components/ClassPlanTitle';

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const plan = demoPlans.find((item) => item.id === id);

  if (!plan) notFound();

  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page, pageStyles.fullHeight)}>
        <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>
              <Link href="/classes" {...stylex.props(pageStyles.backLink)}>
                CLASSES
              </Link>
              &nbsp;<span>•</span> Edit class plan
            </p>
            <ClassPlanTitle initialTitle={plan.title} initialStatus={plan.status} />
            <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
              Refine the details and teaching path for this class.
            </p>
          </div>
          <DeleteClassButton planId={id} planTitle={plan.title} />
        </header>

        <Planner
          planId={id}
          initialTitle={plan.title}
          storageKey={`class-plan:${id}`}
          initialIntention={plan.intention}
          initialLevel={plan.level}
          initialDuration={plan.plannedDurationMinutes}
          initialPeakPose={plan.peakPose}
          initialStatus={plan.status}
          initialDescription={plan.description ?? ''}
          initialSections={plan.sections ?? []}
        />
      </div>
    </AppShell>
  );
}
