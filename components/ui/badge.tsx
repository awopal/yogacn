import * as React from 'react';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing, fontSize } from '../../styles/tokens.stylex';

export type BadgeVariant = 'default' | 'draft' | 'ready' | 'taught';

const styles = stylex.create({
  badge: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'inline-flex',
    fontSize: fontSize.xs,
    fontWeight: 700,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    color: colors.primary
  },
  draft: {
    backgroundColor: colors.surface,
  },
  ready: {
    backgroundColor: colors.healthyMuted,
  },
  taught: {
    backgroundColor: colors.secondary,
  },
});

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const styleProps = stylex.props(styles.badge, variant === 'default' ? null : styles[variant]);

  return (
    <span
      {...styleProps}
      className={cn('badge', variant, styleProps.className, className)}
      {...props}
    />
  );
}
