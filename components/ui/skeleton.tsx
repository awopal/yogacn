import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, radius } from '../../styles/tokens.stylex';

const styles = stylex.create({
  skeleton: {
    animationDuration: '1.8s',
    animationIterationCount: 'infinite',
    animationName: 'skeleton-pulse',
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors.tertiaryMuted,
    borderRadius: radius.sm,
    display: 'block',
  },
});

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const styleProps = stylex.props(styles.skeleton);
  return (
    <span
      aria-hidden="true"
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    />
  );
}
