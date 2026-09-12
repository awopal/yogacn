import * as React from 'react';
import { Checkbox as RadixCheckbox } from 'radix-ui';
import { Check } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, radius } from '../../styles/tokens.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.background,
    cursor: 'pointer',
    display: 'inline-flex',
    flex: '0 0 auto',
    height: 18,
    justifyContent: 'center',
    padding: 0,
    transitionDuration: '150ms',
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: 'ease-out',
    width: 18,
    ':hover': {
      backgroundColor: colors.secondaryMuted,
      borderColor: colors.primary,
    },
    ':focus-visible': {
      borderColor: colors.primary,
      outline: `2px solid ${colors.secondaryMuted}`,
      outlineOffset: 1,
    },
    ':disabled': { cursor: 'not-allowed', opacity: 0.55 },
    ':where([data-state="checked"])': {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
  },
  indicator: { display: 'inline-flex' },
});

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>;

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <RadixCheckbox.Root
    ref={ref}
    data-slot="checkbox"
    {...props}
    {...stylex.props(styles.root)}
    className={cn('checkbox', stylex.props(styles.root).className, className)}
  >
    <RadixCheckbox.Indicator {...stylex.props(styles.indicator)}>
      <Check size={13} strokeWidth={3} aria-hidden="true" />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
));

Checkbox.displayName = RadixCheckbox.Root.displayName;
