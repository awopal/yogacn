'use client';

import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@/components/icons';
import { colors } from '@/styles/tokens.stylex';
import { httpClientWithToast } from '@/lib/http/client';
import { API_ROUTES, INSTRUCTOR_ROUTES } from '@/lib/routes';

export function DeleteClassButton({ planId, planTitle }: { planId: string; planTitle: string }) {
  const router = useRouter();

  async function deleteClass() {
    try {
      await httpClientWithToast.request(API_ROUTES.CLASS_BY_ID(planId), {
        method: 'DELETE',
        successToast: { title: 'Class deleted successfully' },
        errorToast: { title: 'Failed to delete the class' },
      });
      router.push(INSTRUCTOR_ROUTES.CLASSES.ROOT);
    } catch (error) {
      // User feedback is handled by the HTTP toast middleware.
      console.error('Failed to delete class plan', { planId, error });
    }
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
