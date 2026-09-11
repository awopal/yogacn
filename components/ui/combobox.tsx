'use client';

import * as React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, fontSize, radius, spacing } from '../../styles/tokens.stylex';

const styles = stylex.create({
  chips: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    minHeight: 42,
    padding: spacing.xs,
    width: '100%',
    ':focus-within': {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primarySoft}`,
    },
  },
  chip: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    color: colors.primary,
    display: 'inline-flex',
    fontSize: fontSize.sm,
    gap: spacing.xs,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
  },
  chipRemove: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    color: colors.textMuted,
    cursor: 'pointer',
    display: 'inline-flex',
    lineHeight: 1,
    margin: 0,
    padding: 0,
  },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    flex: '1 1 140px',
    minHeight: 34,
    minWidth: 120,
    outline: 'none',
    paddingBlock: spacing.xs,
    paddingInline: spacing.xs,
    width: 'auto',
    ':focus': { boxShadow: 'none', outline: 'none' },
  },
  inputGroup: {
    alignItems: 'center',
    display: 'flex',
    position: 'relative',
    width: '100%',
  },
  basicInput: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.text,
    minHeight: 42,
    outline: 'none',
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    paddingInlineEnd: spacing.xl,
    transitionDuration: '150ms',
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionTimingFunction: 'ease-out',
    width: '100%',
    ':focus': {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primarySoft}`,
    },
  },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    color: colors.text,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    lineHeight: 1,
    margin: 0,
    padding: 0,
    position: 'absolute',
    right: spacing.xs,
    width: 18,
    height: 18,
    ':focus': { outline: 'none' },
    ':focus-visible': { outline: `2px solid ${colors.primary}`, outlineOffset: 2 },
  },
  positioner: { zIndex: 20, width: 'var(--anchor-width)' },
  popup: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 8px 20px rgb(31 18 53 / 0.14)',
    maxHeight: 290,
    overflowY: 'auto',
    padding: spacing.xs,
  },
  list: { display: 'grid', gap: spacing.xs },
  item: {
    alignItems: 'center',
    backgroundColor: colors.background,
    border: 0,
    borderRadius: radius.sm,
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    fontSize: fontSize.md,
    justifyContent: 'space-between',
    minHeight: 46,
    paddingBlock: spacing.sm,
    paddingInline: spacing.md,
    textAlign: 'left',
    width: '100%',
    ':hover': { backgroundColor: colors.primarySoft },
    ':focus-visible': {
      backgroundColor: colors.primarySoft,
      outline: `2px solid ${colors.primary}`,
      outlineOffset: -2,
    },
    ':where([data-highlighted])': { backgroundColor: colors.primarySoft },
  },
  itemIndicator: { color: colors.text, display: 'inline-flex' },
  empty: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    padding: 0,
    ':where([data-empty])': { padding: spacing.md },
  },
  footer: { borderTop: `1px solid ${colors.secondaryMuted}`, marginTop: spacing.xs },
});

export function useComboboxAnchor() {
  return React.useRef<HTMLDivElement>(null);
}

export function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: React.ComponentProps<typeof BaseCombobox.Root<Value, Multiple>>,
) {
  return <BaseCombobox.Root {...props} />;
}

export const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chips>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Chips
    ref={ref}
    {...props}
    {...stylex.props(styles.chips)}
    className={cn(stylex.props(styles.chips).className, className)}
  />
));
ComboboxChips.displayName = 'ComboboxChips';

export const ComboboxValue = BaseCombobox.Value;

export const ComboboxChipsInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Input
    ref={ref}
    {...props}
    {...stylex.props(styles.input)}
    style={{
      border: 0,
      outline: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      ...(props.style ?? {}),
    }}
    className={cn(stylex.props(styles.input).className, className)}
  />
));
ComboboxChipsInput.displayName = 'ComboboxChipsInput';

export const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>
>(({ className, ...props }, ref) => (
  <BaseCombobox.InputGroup {...stylex.props(styles.inputGroup)}>
    <BaseCombobox.Input
      ref={ref}
      {...props}
      {...stylex.props(styles.basicInput)}
      className={cn(stylex.props(styles.basicInput).className, className)}
    />
    <BaseCombobox.Trigger
      type="button"
      aria-label="Open options"
      {...stylex.props(styles.trigger)}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 0,
        boxShadow: 'none',
        outline: 'none',
        padding: 0,
      }}
    >
      <ChevronDown size={18} />
    </BaseCombobox.Trigger>
  </BaseCombobox.InputGroup>
));
ComboboxInput.displayName = 'ComboboxInput';

export const ComboboxChip = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Chip>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Chip
    ref={ref}
    {...props}
    {...stylex.props(styles.chip)}
    className={cn(stylex.props(styles.chip).className, className)}
  >
    {children}
    <BaseCombobox.ChipRemove
      aria-label={`Remove ${typeof children === 'string' ? children : 'selected item'}`}
      {...stylex.props(styles.chipRemove)}
      style={{
        border: 0,
        outline: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <X size={14} />
    </BaseCombobox.ChipRemove>
  </BaseCombobox.Chip>
));
ComboboxChip.displayName = 'ComboboxChip';

export function ComboboxContent({
  anchor,
  children,
}: {
  anchor?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        anchor={anchor}
        sideOffset={4}
        align="start"
        {...stylex.props(styles.positioner)}
      >
        <BaseCombobox.Popup {...stylex.props(styles.popup)}>{children}</BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Empty
    ref={ref}
    {...props}
    {...stylex.props(styles.empty)}
    className={cn(stylex.props(styles.empty).className, className)}
  />
));
ComboboxEmpty.displayName = 'ComboboxEmpty';

export const ComboboxList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.List>
>(({ className, ...props }, ref) => (
  <BaseCombobox.List
    ref={ref}
    {...props}
    {...stylex.props(styles.list)}
    className={cn(stylex.props(styles.list).className, className)}
  />
));
ComboboxList.displayName = 'ComboboxList';

export const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Item>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Item
    ref={ref}
    {...props}
    {...stylex.props(styles.item)}
    className={cn(stylex.props(styles.item).className, className)}
  >
    {children}
    <BaseCombobox.ItemIndicator {...stylex.props(styles.itemIndicator)}>
      <Check size={18} />
    </BaseCombobox.ItemIndicator>
  </BaseCombobox.Item>
));
ComboboxItem.displayName = 'ComboboxItem';

export function ComboboxFooter({ children }: { children: React.ReactNode }) {
  return <div {...stylex.props(styles.footer)}>{children}</div>;
}

export const comboboxStyles = stylex.create({
  action: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 0,
    color: colors.primary,
    cursor: 'pointer',
    display: 'flex',
    fontSize: fontSize.sm,
    gap: spacing.sm,
    minHeight: 52,
    paddingInline: spacing.md,
    textAlign: 'left',
    width: '100%',
    ':hover': { backgroundColor: colors.primarySoft },
  },
});
