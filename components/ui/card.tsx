import * as React from 'react';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';

export const cardStyles = stylex.create({
  card: {},
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
