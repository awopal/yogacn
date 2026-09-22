import Link from 'next/link';
import { Plus } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { demoPlans } from '@/lib/server/demo';
import { Button } from '@/components/ui/button';
import ClassLibrary from '../../components/ClassLibrary';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export default function ClassesPage() {
  return (
    <div {...stylex.props(pageStyles.page, pageStyles.fullHeight)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <h1 {...stylex.props(typographyStyles.h3)}>Class library</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Your complete collection of plans and teaching paths.
          </p>
        </div>
        <Button asChild>
          <Link href={INSTRUCTOR_ROUTES.CLASSES.NEW}>
            <Plus size={18} aria-hidden="true" /> Create new class
          </Link>
        </Button>
      </header>
      <ClassLibrary
        initialPlans={demoPlans.slice(0, 10)}
        initialTotal={demoPlans.length}
        initialCounts={{
          all: demoPlans.length,
          ready: demoPlans.filter((plan) => plan.status === 'ready').length,
          draft: demoPlans.filter((plan) => plan.status === 'draft').length,
          taught: demoPlans.filter((plan) => plan.status === 'taught').length,
        }}
      />
    </div>
  );
}
