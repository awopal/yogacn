import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { WorkshopForm } from '../../../components/WorkshopForm';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export default function CreateWorkshopPage() {
  return (
    <div {...stylex.props(pageStyles.page, pageStyles.fullHeight)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <p {...stylex.props(pageStyles.eyebrow)}>
            <Link href={INSTRUCTOR_ROUTES.WORKSHOPS.ROOT} {...stylex.props(pageStyles.backLink)}>
              WORKSHOPS
            </Link>{' '}
            <span>•</span> Create
          </p>
          <h1 {...stylex.props(typographyStyles.h3)}>Open a new workshop</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Set up the details, schedule, and booking information for a special session.
          </p>
        </div>
      </header>
      <WorkshopForm />
    </div>
  );
}
