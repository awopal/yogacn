'use client';

import { useState } from 'react';
import { AlertDialog } from 'radix-ui';
import { LockIcon, LockOpenIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import * as stylex from '@stylexjs/stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';

export function PublishToggle({
  planTitle,
  initialPublished,
}: {
  planTitle: string;
  initialPublished: boolean;
}) {
  const [published, setPublished] = useState(initialPublished);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button
          variant="ghost"
          size="xs"
          aria-label={`${published ? 'Unpublish' : 'Publish'} ${planTitle}`}
          title={published ? 'Published — click to unpublish' : 'Private — click to publish'}
          {...stylex.props(dashboardStyles.publishButton)}
        >
          {published ? (
            <LockOpenIcon size={24} aria-hidden="true" />
          ) : (
            <LockIcon size={24} aria-hidden="true" />
          )}
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay {...stylex.props(dashboardStyles.dialogOverlay)} />
        <AlertDialog.Content {...stylex.props(dashboardStyles.dialogContent)}>
          <AlertDialog.Title {...stylex.props(dashboardStyles.dialogTitle)}>
            {published ? 'Unpublish this class?' : 'Publish this class?'}
          </AlertDialog.Title>
          <AlertDialog.Description {...stylex.props(dashboardStyles.dialogDescription)}>
            {published
              ? `“${planTitle}” will become private and will no longer be visible as a published class.`
              : `Are you sure you want to publish “${planTitle}”?`}
          </AlertDialog.Description>
          <div {...stylex.props(dashboardStyles.dialogActions)}>
            <AlertDialog.Cancel asChild>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button size="sm" onClick={() => setPublished((current) => !current)}>
                {published ? 'Make private' : 'Publish class'}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
