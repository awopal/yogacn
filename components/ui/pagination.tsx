'use client';

import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, fontSize, fontWeight, radius, spacing } from '../../styles/tokens.stylex';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const styles = stylex.create({
  root: { display: 'flex', justifyContent: 'center', marginTop: spacing.lg },
  content: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing.xs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'inline-flex',
    justifyContent: 'center',
    paddingInline: spacing.sm,
    alignItems: 'center',

    borderStyle: 'none',
    border: 0,
    borderRadius: radius.md,

    backgroundColor: 'transparent',
    color: colors.primary,
    cursor: 'pointer',

    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,

    minHeight: 36,
    minWidth: 36,

    ':hover': { backgroundColor: colors.tertiaryMuted, color: colors.primary },
    ':focus-visible': { outline: `2px solid ${colors.accent}`, outlineOffset: 2 },
  },
  active: { backgroundColor: colors.tertiary, color: colors.primary },
  disabled: { color: colors.textMuted, cursor: 'not-allowed', opacity: 0.55 },
});

export function Pagination({ children, className }: React.HTMLAttributes<HTMLElement>) {
  const styleProps = stylex.props(styles.root);
  return (
    <nav aria-label="Pagination" {...styleProps} className={cn(styleProps.className, className)}>
      {children}
    </nav>
  );
}

export function PaginationContent({ children }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul {...stylex.props(styles.content)}>{children}</ul>;
}

export function PaginationItem({ children }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li>{children}</li>;
}

type PaginationLinkProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean };

export function PaginationLink({
  children,
  className,
  isActive,
  disabled,
  ...props
}: PaginationLinkProps) {
  const styleProps = stylex.props(
    styles.link,
    isActive ? styles.active : null,
    disabled ? styles.disabled : null,
  );
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      disabled={disabled}
      {...styleProps}
      className={cn(styleProps.className, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious(props: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <ChevronLeft />
    </PaginationLink>
  );
}

export function PaginationNext(props: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      <ChevronRight />
    </PaginationLink>
  );
}
