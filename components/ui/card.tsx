import * as React from 'react';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../styles/tokens.stylex';

export const cardStyles = stylex.create({
  card: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: spacing.lg,
  },
});

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const styleProps = stylex.props(cardStyles.card);
    return (
      <div ref={ref} {...styleProps} className={cn(styleProps.className, className)} {...props} />
    );
  },
);
Card.displayName = 'Card';
