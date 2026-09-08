import AppShell from '../../components/AppShell';
import Planner from '../../components/Planner';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { Button } from '@/components/ui/button';
import { typographyStyles } from '@/styles/typography.stylex';

export default function NewClassPage() {
  return (
    <AppShell>
      <div className="page">
        <div {...stylex.props(pageStyles.pageHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>New class plan</p>
            <h1 {...stylex.props(typographyStyles.h1)}>Design your class sequence</h1>
          </div>
          <Button variant="outline" asChild>
            <a href="/dashboard">Cancel</a>
          </Button>
        </div>
        <Planner />
      </div>
    </AppShell>
  );
}
