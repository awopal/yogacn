import type { HttpMiddleware, HttpRequestContext, ToastMessage } from './client';

export type ToastNotifier = (message: ToastMessage & { type: 'success' | 'error' }) => void;

let notify: ToastNotifier | undefined;

export function configureHttpToastNotifier(next: ToastNotifier | undefined) {
  notify = next;
}

const methodOf = (context: HttpRequestContext) => (context.options.method ?? 'GET').toUpperCase();

export const toastMiddleware: HttpMiddleware = {
  onSuccess(context) {
    if (context.options.successToast === false || !context.options.successToast) return;
    notify?.({ ...context.options.successToast, type: 'success' });
  },
  onError(error, context) {
    if (context.options.errorToast === false) return;
    if (error instanceof Error && error.name === 'AbortError') return;

    const customMessage = context.options.errorToast;
    notify?.({
      title: customMessage?.title ?? 'Request failed',
      description:
        customMessage?.description ??
        (error instanceof Error
          ? error.message
          : `Unable to complete ${methodOf(context)} request`),
      type: 'error',
    });
  },
};
