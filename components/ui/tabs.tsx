'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import {
  boxShadow,
  colors,
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../../styles/tokens.stylex';

export const TabStyles = stylex.create({
  list: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 'fit-content',
    gap: spacing.xs,
    color: colors.text,
    borderRadius: radius.md,
    paddingRight: spacing.sm,
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    gap: spacing.xs,
    minHeight: 36,
    cursor: 'pointer',
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: fontSize.sm,
    border: 0,
    borderColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: radius.md,
    boxShadow: 'none',
    outline: 'none',
    padding: `${spacing.xs} ${spacing.md}`,
    transitionDuration: '150ms',
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: 'ease-out',
  },
  active: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: boxShadow.subtle,
    color: colors.primary,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    backgroundColor: colors.tertiaryMuted,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    marginLeft: spacing.xs,
  },
});

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const styleProps = stylex.props(TabStyles.list);

  return (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
});

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const styleProps = stylex.props(TabStyles.trigger);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      {...styleProps}
      className={cn('tabs-trigger', styleProps.className, className)}
      {...props}
    />
  );
});

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { Tabs, TabsList, TabsTrigger };
