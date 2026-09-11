'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, CalendarRange, Home, LogOut, UserRound, UsersRound } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { YogaLogoIcon } from '@/components/icons';
import { appStyles } from '@/styles/app.stylex';
import { colors } from '@/styles/tokens.stylex';
import ProfileMenu from './ProfileMenu';
import { Button } from '@/components/ui/button';

const items = [
  { href: '/dashboard', label: 'Dashboard', Icon: Home },
  { href: '/classes', label: 'Classes', Icon: CalendarDays },
  { href: '/schedule', label: 'Class Schedule', Icon: CalendarRange },
  { href: '/students', label: 'Student notes', Icon: UsersRound },
];

export default function Sidebar({ logoutAction }: { logoutAction: () => Promise<void> }) {
  const pathname = usePathname();

  return (
    <aside {...stylex.props(appStyles.sidebar)} aria-label="Workspace navigation">
      <Link
        href="/dashboard"
        {...stylex.props(appStyles.sidebarBrand)}
        aria-label="yogacn dashboard"
      >
        <span {...stylex.props(appStyles.sidebarLogo)}>
          <YogaLogoIcon size={36} color={colors.tertiary} />
        </span>
      </Link>

      <nav {...stylex.props(appStyles.sidebarNav)} aria-label="Main navigation">
        {items.map(({ href, Icon }) =>
          (() => {
            const isActive =
              pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                {...stylex.props(appStyles.sidebarLink, isActive && appStyles.sidebarLinkActive)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  {...stylex.props(isActive ? appStyles.sidebarIconActive : appStyles.sidebarIcon)}
                  size={24}
                  stroke={isActive ? colors.primary : colors.onPrimaryMuted}
                  aria-hidden="true"
                />
              </Link>
            );
          })(),
        )}
      </nav>

      <div {...stylex.props(appStyles.sidebarBottom)}>
        <p {...stylex.props(appStyles.sidebarHint)}>A calm space to plan, teach and reflect.</p>
        <Button asChild variant="ghost" size="sm">
          <Link href="/profile">
            <UserRound color={colors.secondaryMuted} aria-hidden="true" />
          </Link>
        </Button>
        <Button type="submit" form="profile-logout-form" variant="ghost" size="sm">
          <LogOut color={colors.secondaryMuted} aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
}
