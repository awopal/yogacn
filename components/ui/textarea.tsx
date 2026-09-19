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
    ':hover': { backgroundColor: colors.secondaryMuted },
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
    ':user-invalid': { borderColor: colors.danger },
    '::placeholder': { color: colors.textMuted, opacity: 1 },
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
  },
  invalid: {
    borderColor: colors.danger,
    boxShadow: `0 0 0 3px ${colors.accentMuted}`,
  },
  readOnly: { backgroundColor: colors.pageBackground },
  countWrapper: { display: 'grid', gap: spacing.xs, width: '100%' },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 1.3,
    textAlign: 'right',
  },
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      'aria-invalid': ariaInvalid,
      readOnly,
      showCount = false,
      value,
      defaultValue,
      onChange,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
      typeof defaultValue === 'string' || typeof defaultValue === 'number'
        ? String(defaultValue)
        : '',
    );
    const styleProps = stylex.props(
      textareaStyles.textarea,
      ariaInvalid === true || ariaInvalid === 'true' ? textareaStyles.invalid : null,
      readOnly ? textareaStyles.readOnly : null,
    );
    const currentValue = value === undefined ? uncontrolledValue : String(value ?? '');
    const shouldShowCount = showCount && maxLength !== undefined;

    const textarea = (
      <textarea
        ref={ref}
        data-slot="textarea"
        aria-invalid={ariaInvalid}
        readOnly={readOnly}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.target.value);
          onChange?.(event);
        }}
        {...styleProps}
        className={cn('textarea', styleProps.className, className)}
        {...props}
      />
    );

    if (!shouldShowCount) return textarea;

    return (
      <div {...stylex.props(textareaStyles.countWrapper)}>
        {textarea}
        <span aria-live="polite" {...stylex.props(textareaStyles.count)}>
          {currentValue.length}/{maxLength}
        </span>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
