import { notFound } from 'next/navigation';
import { demoAttendance, demoPlans, demoStudents } from '../../../lib/server/demo';
import AppShell from '../../components/AppShell';
import StudentDetailTabs from '../../components/StudentDetailTabs';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { levelLabel } from '@/lib/utils';

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = demoStudents.find((item) => item.id === id);
  if (!student) notFound();
  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page)}>
        <StudentDetailTabs
          student={student}
          attendance={demoAttendance
            .filter((entry) => entry.studentId === student.id)
            .sort((a, b) => b.attendedAt.localeCompare(a.attendedAt))
            .map((entry) => ({
              ...entry,
              level: (() => {
                const plan = demoPlans.find((item) => item.title === entry.classTitle);
                return plan ? levelLabel[plan.level] : undefined;
              })(),
            }))}
        />
      </div>
    </AppShell>
  );
}
