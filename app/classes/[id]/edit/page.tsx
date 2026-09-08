import { notFound } from 'next/navigation';
import AppShell from '../../../components/AppShell';
import Planner from '../../../components/Planner';
import { demoPlans } from '../../../../lib/server/demo';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { Button } from '@/components/ui/button';
import { typographyStyles } from '@/styles/typography.stylex';

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = demoPlans.find((item) => item.id === id);
  if (!plan) notFound();
  return (
    <AppShell>
      <div className="page">
        <div {...stylex.props(pageStyles.pageHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>Edit class plan</p>
            <h1 {...stylex.props(typographyStyles.h1)}>{plan.title}</h1>
          </div>
          <Button variant="outline" asChild>
            <a href="/dashboard">Back</a>
          </Button>
        </div>
        <Planner
          initialTitle={plan.title}
          initialIntention={plan.intention}
          initialLevel={plan.level}
          initialDuration={plan.plannedDurationMinutes}
          initialPeakPose={plan.peakPose}
        />
      </div>
    </AppShell>
  );
}
