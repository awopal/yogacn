import Link from 'next/link';
import { Plus } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@/components/ui/button';
import { demoWorkshops } from '@/lib/workshops';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';
import WorkshopLibrary from '../../components/WorkshopLibrary';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';

export default function WorkshopsPage() {
  return (
    <div {...stylex.props(pageStyles.page, pageStyles.fullHeight)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <h1 {...stylex.props(typographyStyles.h3)}>Workshops</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Create, publish, and manage special sessions beyond your regular class plans.
          </p>
        </div>
        <Button asChild>
          <Link href={INSTRUCTOR_ROUTES.WORKSHOPS.CREATE}>
            <Plus size={18} aria-hidden="true" /> Create workshop
          </Link>
        </Button>
      </header>
      <WorkshopLibrary workshops={demoWorkshops} />
    </div>
  );
}
