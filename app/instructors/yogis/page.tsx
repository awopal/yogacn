import AppShell from '../../components/AppShell';
import { demoYogis } from '../../../lib/server/demo';
import YogisPageContent from '../../components/YogisPageContent';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';

export default function YogisPage() {
  return (
    <AppShell>
      <div {...stylex.props(pageStyles.page)}>
        <YogisPageContent initialYogis={demoYogis} />
      </div>
    </AppShell>
  );
}
