'use client';

import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { MoonDayIndicator } from '@/components/MoonDayIndicator';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

function getMenuLabel(pathname: string) {
  if (pathname.startsWith(INSTRUCTOR_ROUTES.CLASSES.NEW)) return 'New class';
  if (pathname.startsWith(`${INSTRUCTOR_ROUTES.CLASSES.ROOT}/`)) return 'Classes';
  if (pathname.startsWith(INSTRUCTOR_ROUTES.CLASSES.ROOT)) return 'Classes';
  if (pathname.startsWith(INSTRUCTOR_ROUTES.SCHEDULE)) return 'Class Schedule';
  if (pathname.startsWith(INSTRUCTOR_ROUTES.YOGIS.ROOT)) return 'Yogi notes';
  if (pathname.startsWith(INSTRUCTOR_ROUTES.PROFILE)) return 'Profile';
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
