'use client';

import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { MoonDayIndicator } from '@/components/MoonDayIndicator';

function getMenuLabel(pathname: string) {
  if (pathname.startsWith('/classes/new')) return 'New class';
  if (pathname.startsWith('/classes/')) return 'Classes';
  if (pathname.startsWith('/classes')) return 'Classes';
  if (pathname.startsWith('/schedule')) return 'Class Schedule';
  if (pathname.startsWith('/instructors/yogis')) return 'Yogi notes';
  if (pathname.startsWith('/profile')) return 'Profile';
  return 'Dashboard';
}

export default function AppHeader() {
  const pathname = usePathname();
  const menuLabel = getMenuLabel(pathname);

  return (
    <header {...stylex.props(layoutStyles.appHeader)}>
      <p {...stylex.props(layoutStyles.appHeaderTitle, typographyStyles.body)}>
        <span {...stylex.props(typographyStyles.brand)}>yogacn</span>
        <MoonDayIndicator />
        <span>{menuLabel}</span>
      </p>
    </header>
  );
}
