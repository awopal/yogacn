'use client';

import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@/components/icons';
import { colors } from '@/styles/tokens.stylex';

export function DeleteClassButton({ planId, planTitle }: { planId: string; planTitle: string }) {
  const router = useRouter();

  async function deleteClass() {
    const response = await fetch(`/api/classes/${planId}`, { method: 'DELETE' });
    if (!response.ok) return;
    router.push('/classes');
  }

  return (
    <ConfirmDialog
      trigger={
        <Button
          type="button"
          variant="ghost"
          aria-label={`Delete ${planTitle}`}
          title="Delete class"
        >
          <TrashIcon size={18} color={colors.danger} />
          Delete class
        </Button>
      }
      title="Delete this class?"
      description={`Are you sure you want to delete “${planTitle}” and all of its class plan data?`}
      confirmLabel="Delete class"
      confirmVariant="destructive"
      onConfirm={() => {
        void deleteClass();
      }}
    />
  );
}
