import { notFound } from 'next/navigation';
import { demoStudents } from '../../../lib/server/demo';
import AppShell from '../../components/AppShell';
import ObservationForm from '../../components/ObservationForm';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { typographyStyles } from '@/styles/typography.stylex';
export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = demoStudents.find((item) => item.id === id);
  if (!student) notFound();
  return (
    <AppShell>
      <div className="page">
        <a href="/students">← Student notes</a>
        <div {...stylex.props(pageStyles.pageHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>Private student profile</p>
            <h1 {...stylex.props(typographyStyles.h1)}>{student.displayName}</h1>
            <p {...stylex.props(typographyStyles.muted)}>{student.note}</p>
          </div>
          <Badge>{student.status}</Badge>
        </div>
        <Card>
          <h2 {...stylex.props(typographyStyles.h2)}>Observation timeline</h2>
          <p {...stylex.props(typographyStyles.muted)}>
            General, non-medical teaching observations are kept here.
          </p>
          <div className="empty">No observations yet</div>
          <ObservationForm />
        </Card>
      </div>
    </AppShell>
  );
}
