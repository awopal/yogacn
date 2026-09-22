'use client';

import { usePathname } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import { PUBLIC_ROUTES, INSTRUCTOR_ROUTES, YOGI_ROUTES } from '@/lib/routes';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';

export default function AppShell({
  children,
  logoutAction,
}: {
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const isPublicRoute = Object.values(PUBLIC_ROUTES).some((route) => route === pathname);
  const isBaseRoute = pathname.startsWith(YOGI_ROUTES.ROOT);

  if (isPublicRoute) return children;

  return (
    <div {...stylex.props(layoutStyles.appFrame)}>
      <Sidebar
        isBaseRoute={isBaseRoute}
        logoutAction={logoutAction}
        brandHref={isBaseRoute ? YOGI_ROUTES.ROOT : INSTRUCTOR_ROUTES.ROOT}
      />
      <main {...stylex.props(layoutStyles.contentShell, layoutStyles.main)}>
        {isBaseRoute ? null : <AppHeader />}
        <div {...stylex.props(layoutStyles.contentArea)}>{children}</div>
      </main>
    </div>
  );
}
