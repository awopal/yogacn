'use client';

import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Badge } from '@/components/ui/badge';
import { useClassBuilderStore } from '@/lib/stores/class-builder-store';
import { statusLabel } from '@/lib/utils';
import type { PlanStatus } from '@/lib/types';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';

export function ClassPlanTitle({
  initialTitle,
  initialStatus,
}: {
  initialTitle: string;
  initialStatus: PlanStatus;
}) {
  const title = useClassBuilderStore((state) => state.draft.title);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const displayedTitle = (ready ? title : initialTitle).trim() || 'Untitled class';

  return (
    <h1 {...stylex.props(typographyStyles.h3, pageStyles.titleWithStatus)}>
      {displayedTitle}
      <Badge variant={initialStatus} aria-label={`Class status: ${statusLabel[initialStatus]}`}>
        {statusLabel[initialStatus]}
      </Badge>
    </h1>
  );
}
