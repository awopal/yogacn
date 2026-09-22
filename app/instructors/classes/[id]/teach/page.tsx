import { notFound } from 'next/navigation';
import { demoPlans } from '@/lib/server/demo';
import TeachingMode from '../../../../components/TeachingMode';

export default async function TeachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = demoPlans.find((item) => item.id === id);
  if (!plan) notFound();
  return <TeachingMode title={plan.title} />;
}
