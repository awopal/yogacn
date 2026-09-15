import AppShell from '../components/AppShell';
import { demoStudents } from '../../lib/server/demo';
import StudentsPageContent from '../components/StudentsPageContent';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';

export default function StudentsPage() {
  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page)}>
        <StudentsPageContent initialStudents={demoStudents} />
      </div>
    </AppShell>
  );
}
