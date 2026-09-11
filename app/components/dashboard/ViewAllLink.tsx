import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';

export function ViewAllLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} {...stylex.props(dashboardStyles.viewAllLink)}>
      {children} <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
