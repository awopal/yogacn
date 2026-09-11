import Link from 'next/link';
import { Plus } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@/components/ui/button';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';

export function DashboardHeader() {
  return (
    <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
      <div>
        <h1 {...stylex.props(typographyStyles.h3)}>Hello, Opal!</h1>
        <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
          A quick view of your teaching studio.
        </p>
      </div>
      <Button asChild>
        <Link href="/classes/new">
          <Plus size={18} aria-hidden="true" /> Create new class
        </Link>
      </Button>
    </header>
  );
}
