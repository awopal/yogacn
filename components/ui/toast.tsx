'use client';

import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { AlertTriangle, CheckCircle2, CircleX, Info, Loader2, X } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, radius, spacing } from '../../styles/tokens.stylex';

const styles = stylex.create({
  viewport: {
    bottom: spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    maxWidth: 'min(420px, calc(100vw - 32px))',
    outline: 'none',
    position: 'fixed',
    right: spacing.md,
    width: '100%',
    zIndex: 100,
  },
  root: {
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 8px 20px rgb(31 18 53 / 0.16)',
    color: colors.text,
    display: 'flex',
    gap: spacing.sm,
    padding: spacing.md,
    width: '100%',
    ':focus-visible': {
      outline: `2px solid ${colors.primary}`,
      outlineOffset: 2,
    },
  },
  success: { borderColor: colors.healthy },
  info: { borderColor: colors.primary },
  warning: { backgroundColor: colors.tertiaryMuted, borderColor: colors.tertiary },
  error: { backgroundColor: colors.accentMuted, borderColor: colors.accent },
  loading: { borderColor: colors.secondary },
  icon: { flex: '0 0 auto', marginTop: 2 },
  successIcon: { color: colors.healthy },
  infoIcon: { color: colors.primary },
  warningIcon: { color: colors.text },
  errorIcon: { color: colors.danger },
  content: { display: 'grid', flex: '1 1 auto', gap: spacing.xs, minWidth: 0 },
  title: { fontSize: fontSize.sm, fontWeight: 700, margin: 0 },
  description: { color: colors.textMuted, fontSize: fontSize.sm, margin: 0 },
  close: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    border: 0,
    color: colors.textMuted,
    cursor: 'pointer',
    display: 'inline-flex',
    flex: '0 0 auto',
    justifyContent: 'center',
    margin: -4,
    padding: spacing.xs,
    ':hover': { color: colors.text },
    ':focus-visible': {
      borderRadius: radius.sm,
      outline: `2px solid ${colors.primary}`,
      outlineOffset: 1,
    },
  },
  action: {
    backgroundColor: colors.primary,
    border: 0,
    borderRadius: radius.sm,
    color: colors.background,
    cursor: 'pointer',
    fontSize: fontSize.xs,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
  },
});

export function useToast() {
  return BaseToast.useToastManager();
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseToast.Provider>
      {children}
      <Toaster />
    </BaseToast.Provider>
  );
}

function getTypeStyles(type: string | undefined) {
  switch (type) {
    case 'success':
      return { root: styles.success, icon: styles.successIcon };
    case 'info':
      return { root: styles.info, icon: styles.infoIcon };
    case 'warning':
      return { root: styles.warning, icon: styles.warningIcon };
    case 'error':
      return { root: styles.error, icon: styles.errorIcon };
    case 'loading':
      return { root: styles.loading, icon: styles.infoIcon };
    default:
      return { root: null, icon: styles.infoIcon };
  }
}

function ToastIcon({ type }: { type: string | undefined }) {
  const iconProps = { size: 18, 'aria-hidden': true } as const;
  switch (type) {
    case 'success':
      return <CheckCircle2 {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'error':
      return <CircleX {...iconProps} />;
    case 'loading':
      return <Loader2 {...iconProps} />;
    default:
      return null;
  }
}

export function Toaster() {
  const { toasts } = BaseToast.useToastManager();

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport {...stylex.props(styles.viewport)}>
        {toasts.map((toastItem) => {
          const typeStyles = getTypeStyles(toastItem.type);

          return (
            <BaseToast.Root
              key={toastItem.id}
              toast={toastItem}
              {...stylex.props(styles.root, typeStyles.root)}
            >
              <span {...stylex.props(styles.icon, typeStyles.icon)}>
                <ToastIcon type={toastItem.type} />
              </span>

              <BaseToast.Content {...stylex.props(styles.content)}>
                {toastItem.title && (
                  <BaseToast.Title {...stylex.props(styles.title)}>
                    {toastItem.title}
                  </BaseToast.Title>
                )}

                {toastItem.description && (
                  <BaseToast.Description {...stylex.props(styles.description)}>
                    {toastItem.description}
                  </BaseToast.Description>
                )}
              </BaseToast.Content>

              {toastItem.actionProps && (
                <BaseToast.Action {...toastItem.actionProps} {...stylex.props(styles.action)} />
              )}

              <BaseToast.Close aria-label="Dismiss notification" {...stylex.props(styles.close)}>
                <X size={16} aria-hidden="true" />
              </BaseToast.Close>
            </BaseToast.Root>
          );
        })}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}
