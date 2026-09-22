'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Home, LibraryBig, LogOut, UserRound, UsersRound } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { YogaLogoIcon } from '@/components/icons';
import { appStyles } from '@/styles/app.stylex';
import { colors } from '@/styles/tokens.stylex';
import { Button } from '@/components/ui/button';
import geometry from './Sidebar.module.css';
import { yogiProfile, yogiSidebarItems } from '../yogis/sidebar-menu';
import { instructorProfile, instructorSidebarItems } from '../instructors/sidebar-menu';

export type SidebarMenuItem = {
  href: string;
  label: string;
  icon: 'calendar' | 'home' | 'library' | 'users';
};

const sidebarIcons = {
  calendar: CalendarDays,
  home: Home,
  library: LibraryBig,
  users: UsersRound,
} as const;

export default function Sidebar({
  logoutAction,
  isBaseRoute,
  brandHref,
}: {
  logoutAction: () => Promise<void>;
  isBaseRoute: boolean;
  brandHref?: string;
}) {
  const menuItems = isBaseRoute ? yogiSidebarItems : instructorSidebarItems;
  const profile = isBaseRoute ? yogiProfile : instructorProfile;

  const pathname = usePathname();
  const homeHref = menuItems[0]?.href ?? '/';
  const homePath = homeHref.split('#')[0];
  const resolvedBrandHref = brandHref ?? homeHref;

  return (
    <aside {...stylex.props(appStyles.sidebar)} aria-label="Workspace navigation">
      <div>
        <Link
          href={resolvedBrandHref}
          {...stylex.props(appStyles.sidebarBrand)}
          aria-label="yogacn dashboard"
        >
          <span {...stylex.props(appStyles.sidebarLogo)}>
            <YogaLogoIcon size={42} strokeWidth={4} color={colors.tertiary} />
          </span>
        </Link>

        <nav {...stylex.props(appStyles.sidebarNav)} aria-label="Main navigation">
          {menuItems.map(({ href, label, icon }, index) => {
            const Icon = sidebarIcons[icon];
            const isActive =
              href === homeHref
                ? pathname === homePath
                : !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));
            return (
              <div key={href} {...stylex.props(appStyles.sidebarMenuItem)}>
                {index < menuItems.length - 1 ? (
                  <svg
                    {...stylex.props(appStyles.sidebarConnector)}
                    viewBox="0 0 60 64"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      className={geometry.connector}
                      d="M0 0 C0 12.71349 0 24.046441 0 28.284271 C0 29.698485 0 34.301515 0 35.715729 C0 39.953559 0 51.28651 0 64 L60 64 C60 51.28651 60 39.953559 60 35.715729 C60 34.301515 60 29.698485 60 28.284271 C60 24.046441 60 12.71349 60 0 Z"
                    />
                  </svg>
                ) : null}
                <Link
                  href={href}
                  {...stylex.props(appStyles.sidebarLink, isActive && appStyles.sidebarLinkActive)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                >
                  <Icon
                    {...stylex.props(appStyles.sidebarIcon)}
                    size={isActive ? 28 : 24}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            );
          })}
        </nav>

        <Button
          asChild
          variant="secondary"
          size="sm"
          {...stylex.props(appStyles.sidebarProfileButton)}
        >
          <Link href={profile.href} aria-label="Profile">
            <UserRound color={colors.primary} aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div {...stylex.props(appStyles.sidebarBottom)}>
        <p {...stylex.props(appStyles.sidebarRemarkBottom)}>
          A calm space to plan, teach and reflect.
        </p>
        <form id="profile-logout-form" action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            aria-label="Log out"
            {...stylex.props(appStyles.sidebarUtilityButton)}
          >
            <LogOut color={colors.primary} aria-hidden="true" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
