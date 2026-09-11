import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { Student } from '@/lib/types';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { ViewAllLink } from './ViewAllLink';

export function RecentNotesPreview({ students }: { students: Student[] }) {
  return (
    <section aria-labelledby="recent-notes-title">
      <div {...stylex.props(dashboardStyles.previewHeader)}>
        <div>
          <p {...stylex.props(dashboardStyles.kicker)}>Student notes</p>
          <h2 id="recent-notes-title" {...stylex.props(typographyStyles.h2)}>
            Recent notes
          </h2>
        </div>
        <ViewAllLink href="/students">View all notes</ViewAllLink>
      </div>
      <div {...stylex.props(dashboardStyles.previewList)}>
        {students.slice(0, 3).map((student) => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            {...stylex.props(dashboardStyles.noteRow)}
          >
            <span {...stylex.props(dashboardStyles.previewIcon)} aria-hidden="true">
              {student.displayName[0]}
            </span>
            <span {...stylex.props(dashboardStyles.previewCopy)}>
              <strong>{student.displayName}</strong>
              <span>{student.note || 'No general note yet'}</span>
            </span>
            <span {...stylex.props(dashboardStyles.noteStatus)}>{student.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
