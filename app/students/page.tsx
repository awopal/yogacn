import AppShell from '../components/AppShell';
import { demoStudents } from '../../lib/server/demo';
import StudentManager from '../components/StudentManager';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { studentsStyles } from '@/styles/students.stylex';
import { typographyStyles } from '@/styles/typography.stylex';

export default function StudentsPage() {
  return (
    <AppShell>
      <div className="page">
        <div {...stylex.props(pageStyles.pageHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>Private · Teacher only</p>
            <h1 {...stylex.props(typographyStyles.h1)}>Student notes</h1>
            <p {...stylex.props(typographyStyles.muted)}>
              Notes that support safe and appropriate teaching
            </p>
          </div>
        </div>
        <aside {...stylex.props(studentsStyles.privacy)}>
          <strong>Privacy-minded note taking</strong>
          <ul {...stylex.props(studentsStyles.privacyList)}>
            <li>Record only information necessary for safe teaching</li>
            <li>Avoid medical diagnoses</li>
            <li>Obtain student consent when appropriate</li>
            <li>Delete information when it is no longer needed</li>
          </ul>
        </aside>
        <StudentManager initialStudents={demoStudents} />
      </div>
    </AppShell>
  );
}
