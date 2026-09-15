'use client';

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Student } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import StudentManager from './StudentManager';

export default function StudentsPageContent({ initialStudents }: { initialStudents: Student[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <h1 {...stylex.props(typographyStyles.h3)}>Student notes</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Notes that support safe and appropriate teaching.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          ＋ Add student
        </Button>
      </header>
      <StudentManager initialStudents={initialStudents} open={open} onOpenChange={setOpen} />
    </>
  );
}
