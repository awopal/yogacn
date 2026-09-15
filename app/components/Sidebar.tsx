'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Home, LogOut, UserRound, UsersRound, LibraryBig } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { YogaLogoIcon } from '@/components/icons';
import { appStyles } from '@/styles/app.stylex';
import { colors } from '@/styles/tokens.stylex';
import { Button } from '@/components/ui/button';

const items = [
  { href: '/dashboard', label: 'Dashboard', Icon: Home },
  { href: '/schedule', label: 'Class Schedule', Icon: CalendarDays },
  { href: '/classes', label: 'Classes', Icon: LibraryBig },
  { href: '/students', label: 'Student notes', Icon: UsersRound },
];

export default function Sidebar({ logoutAction }: { logoutAction: () => Promise<void> }) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

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
        {items.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`));
          const isLabelVisible = hoveredItem === href || focusedItem === href;

          return (
            <div
              key={href}
              {...stylex.props(appStyles.sidebarMenuItem)}
              onMouseEnter={() => setHoveredItem(href)}
              onMouseLeave={() => setHoveredItem(null)}
              onFocus={() => setFocusedItem(href)}
              onBlur={() => setFocusedItem(null)}
            >
              <Link
                href={href}
                {...stylex.props(appStyles.sidebarLink, isActive && appStyles.sidebarLinkActive)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
              >
                <Icon
                  {...stylex.props(isActive ? appStyles.sidebarIconActive : appStyles.sidebarIcon)}
                  size={24}
                  aria-hidden="true"
                />
              </Link>
              <span
                {...stylex.props(
                  appStyles.sidebarMenuLabel,
                  isLabelVisible && appStyles.sidebarMenuLabelVisible,
                )}
                aria-hidden="true"
              >
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      <div {...stylex.props(appStyles.sidebarBottom)}>
        <p {...stylex.props(appStyles.sidebarHint)}>A calm space to plan, teach and reflect.</p>
        <Button asChild variant="ghost" size="sm">
          <Link href="/profile" aria-label="Profile">
            <UserRound color={colors.secondaryMuted} aria-hidden="true" />
          </Link>
        </Button>

        <form id="profile-logout-form" action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm" aria-label="Log out">
            <LogOut color={colors.secondaryMuted} aria-hidden="true" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
