import type { ReactNode } from 'react';
import { AlertDialog } from 'radix-ui';
import * as stylex from '@stylexjs/stylex';
import { Button, type ButtonProps } from '@/components/ui/button';
import { dashboardStyles } from '@/styles/dashboard.stylex';

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps['variant'];
  onConfirm: () => void;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay {...stylex.props(dashboardStyles.dialogOverlay)} />
        <AlertDialog.Content {...stylex.props(dashboardStyles.dialogContent)}>
          <AlertDialog.Title {...stylex.props(dashboardStyles.dialogTitle)}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description {...stylex.props(dashboardStyles.dialogDescription)}>
            {description}
          </AlertDialog.Description>
          <div {...stylex.props(dashboardStyles.dialogActions)}>
            <AlertDialog.Cancel asChild>
              <Button variant="ghost" size="sm">
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant={confirmVariant} size="sm" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
