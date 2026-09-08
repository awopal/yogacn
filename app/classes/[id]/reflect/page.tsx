import { notFound } from 'next/navigation';
import { demoPlans } from '../../../../lib/server/demo';
import ReflectionForm from '../../../components/ReflectionForm';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { Button } from '@/components/ui/button';
import { typographyStyles } from '@/styles/typography.stylex';
export default async function ReflectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = demoPlans.find((item) => item.id === id);
  if (!plan) notFound();
  return (
    <div className="page">
      <div {...stylex.props(pageStyles.pageHead)}>
        <div>
          <p {...stylex.props(pageStyles.eyebrow)}>Post-class reflection</p>
          <h1 {...stylex.props(typographyStyles.h1)}>{plan.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <a href="/dashboard">Dashboard</a>
        </Button>
      </div>
      <ReflectionForm planned={plan.plannedDurationMinutes} />
    </div>
  );
}
