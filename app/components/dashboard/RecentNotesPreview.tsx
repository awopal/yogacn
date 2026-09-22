import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { Yogi } from '@/lib/types';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { ViewAllLink } from './ViewAllLink';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export function RecentNotesPreview({ yogis }: { yogis: Yogi[] }) {
  return (
    <section aria-labelledby="recent-notes-title">
      <div {...stylex.props(dashboardStyles.previewHeader)}>
        <div>
          <p {...stylex.props(dashboardStyles.kicker)}>Yogi notes</p>
          <h2 id="recent-notes-title" {...stylex.props(typographyStyles.h2)}>
            Recent notes
          </h2>
        </div>
        <ViewAllLink href={INSTRUCTOR_ROUTES.YOGIS.ROOT}>View all notes</ViewAllLink>
      </div>
      <div {...stylex.props(dashboardStyles.previewList)}>
        {yogis.slice(0, 3).map((yogi) => (
          <Link
            key={yogi.id}
            href={INSTRUCTOR_ROUTES.YOGIS.BY_ID(yogi.id)}
            {...stylex.props(dashboardStyles.noteRow)}
          >
            <span {...stylex.props(dashboardStyles.previewIcon)} aria-hidden="true">
              {yogi.displayName[0]}
            </span>
            <span {...stylex.props(dashboardStyles.previewCopy)}>
              <strong>{yogi.displayName}</strong>
              <span>{yogi.note || 'No general note yet'}</span>
            </span>
            <span {...stylex.props(dashboardStyles.noteStatus)}>{yogi.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
