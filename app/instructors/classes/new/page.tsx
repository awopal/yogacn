import Link from 'next/link';
import Planner from '../../../components/Planner';
import { Badge } from '@/components/ui/badge';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export default function NewClassPage() {
  return (
    <div {...stylex.props(pageStyles.page, pageStyles.fullHeight)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <p {...stylex.props(pageStyles.eyebrow)}>
            <Link href={INSTRUCTOR_ROUTES.CLASSES.ROOT} {...stylex.props(pageStyles.backLink)}>
              CLASSES
            </Link>
            &nbsp;<span>•</span> New class plan
          </p>
          <div {...stylex.props(pageStyles.titleWithStatus)}>
            <h1 {...stylex.props(typographyStyles.h3)}>Let’s map out your class</h1>
            <Badge variant="draft" aria-label="Class status: Draft">
              Draft
            </Badge>
          </div>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Put together a class that feels just right.
          </p>
        </div>
      </header>

      <Planner
        loadStoredDraft={false}
        initialTitle=""
        initialIntention=""
        initialLevel="beginner"
        initialSections={[]}
      />
    </div>
  );
}
