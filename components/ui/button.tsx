import * as React from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';
import { colors, fontSize, fontWeight, radius, spacing } from '../../styles/tokens.stylex';

const styles = stylex.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    color: colors.text,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: radius.sm,
    borderWidth: 2,
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: fontWeight.bold,
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    transitionDuration: '150ms',
    transitionProperty: 'transform, filter, background-color',
    transitionTimingFunction: 'ease-out',
    ':hover': {
      filter: 'brightness(0.96)',
      transform: 'translateY(-1px)',
    },
    ':active': { transform: 'translateY(0)' },
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '0ms',
      ':hover': { transform: 'none' },
      ':active': { transform: 'none' },
    },
  },
  outline: { backgroundColor: 'transparent', borderColor: colors.primary },
  secondary: { backgroundColor: colors.secondaryMuted },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  calendarCell: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    display: 'grid',
    gap: spacing.xs,
    gridTemplateRows: '1fr auto',
    justifyItems: 'center',
  },
  destructive: { backgroundColor: colors.danger, color: colors.background },
  link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: colors.primary,
    textDecoration: 'underline',
  },
  noPadding: { paddingBlock: 0, paddingInline: 0 },
  xs: {
    fontSize: fontSize.xs,
    minHeight: 24,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
  },
  sm: {
    fontSize: fontSize.sm,
    minHeight: 34,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
  },
  md: {
    fontSize: fontSize.md,
    minHeight: 42,
    paddingBlock: spacing.xs,
    paddingInline: spacing.md,
  },
  lg: { minHeight: 46, paddingBlock: spacing.sm, paddingInline: spacing.lg },
  calendar: {
    borderRadius: radius.sm,
    fontFamily: 'inherit',
    fontSize: fontSize.sm,
    minHeight: 42,
    paddingBlock: spacing.xs,
    paddingInline: spacing.xs,
  },
});

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'calendar'
  | 'calendarCell';
export type ButtonSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'calendar';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  noPadding?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      noPadding = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : 'button';
    const styleProps = stylex.props(
      styles.button,
      variant !== 'default' && styles[variant],
      size !== 'default' && styles[size],
      noPadding && styles.noPadding,
    );
    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        {...styleProps}
        className={cn('button', variant, size, styleProps.className, className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
