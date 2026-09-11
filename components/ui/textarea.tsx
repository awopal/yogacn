import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, fontSize, radius, spacing } from '../../styles/tokens.stylex';

const textareaStyles = stylex.create({
  textarea: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.text,
    fontFamily: 'var(--font-commit-mono), ui-monospace, monospace',
    fontSize: fontSize.sm,
    lineHeight: 1.5,
    minHeight: 120,
    outline: 'none',
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    resize: 'vertical',
    transitionDuration: '150ms',
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: 'ease-out',
    width: '100%',
    ':hover': { backgroundColor: colors.primarySoft },
    ':focus': {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primarySoft}`,
    },
    ':disabled': {
      backgroundColor: colors.pageBackground,
      cursor: 'not-allowed',
      opacity: 0.65,
    },
    ':read-only': { backgroundColor: colors.pageBackground },
    ':invalid': { borderColor: colors.danger },
    '::placeholder': { color: colors.textSubtle, opacity: 1 },
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
  },
  invalid: {
    borderColor: colors.danger,
    boxShadow: `0 0 0 3px ${colors.accentSoft}`,
  },
  readOnly: { backgroundColor: colors.pageBackground },
});

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, 'aria-invalid': ariaInvalid, readOnly, ...props }, ref) => {
    const styleProps = stylex.props(
      textareaStyles.textarea,
      ariaInvalid === true || ariaInvalid === 'true' ? textareaStyles.invalid : null,
      readOnly ? textareaStyles.readOnly : null,
    );

    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        aria-invalid={ariaInvalid}
        readOnly={readOnly}
        {...styleProps}
        className={cn('textarea', styleProps.className, className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
