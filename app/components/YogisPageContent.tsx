'use client';

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Yogi } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import YogiManager from './YogiManager';

export default function YogisPageContent({ initialYogis }: { initialYogis: Yogi[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <h1 {...stylex.props(typographyStyles.h3)}>Yogi notes</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Notes that support safe and appropriate teaching.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          ＋ Add yogi
        </Button>
      </header>
      <YogiManager initialYogis={initialYogis} open={open} onOpenChange={setOpen} />
    </>
  );
}
