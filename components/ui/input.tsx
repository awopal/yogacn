import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, fontSize, radius, spacing } from '../../styles/tokens.stylex';

const inputStyles = stylex.create({
  input: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.text,
    fontSize: fontSize.sm,
    minHeight: 42,
    outline: 'none',
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    transitionDuration: '150ms',
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: 'ease-out',
    width: '100%',
    ':focus': {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.secondaryMuted}`,
    },
    ':disabled': {
      backgroundColor: colors.pageBackground,
      cursor: 'not-allowed',
      opacity: 0.65,
    },
    ':read-only': { backgroundColor: colors.pageBackground },
    ':invalid': { borderColor: colors.danger },
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
  },
  invalid: {
    borderColor: colors.danger,
    boxShadow: `0 0 0 3px ${colors.accentMuted}`,
  },
  readOnly: { backgroundColor: colors.pageBackground },
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, 'aria-invalid': ariaInvalid, readOnly, ...props }, ref) => {
    const styleProps = stylex.props(
      inputStyles.input,
      ariaInvalid === true || ariaInvalid === 'true' ? inputStyles.invalid : null,
      readOnly ? inputStyles.readOnly : null,
    );

    return (
      <input
        ref={ref}
        data-slot="input"
        aria-invalid={ariaInvalid}
        readOnly={readOnly}
        {...styleProps}
        className={cn('input', styleProps.className, className)}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
