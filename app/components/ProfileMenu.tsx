'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import { Popover } from 'radix-ui';
import * as stylex from '@stylexjs/stylex';
import { appStyles } from '@/styles/app.stylex';
import { Button } from '@/components/ui/button';

type ProfileMenuProps = {
  displayName: string;
  logoutAction: () => Promise<void>;
  placement?: 'header' | 'sidebar';
  collapsed?: boolean;
};

export default function ProfileMenu({
  displayName,
  logoutAction,
  placement = 'header',
  collapsed = false,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div
        {...stylex.props(
          appStyles.profileMenuWrapper,
          placement === 'sidebar' && appStyles.sidebarProfileMenuWrapper,
        )}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
      >
        <Popover.Trigger asChild>
          <Button
            aria-label={`Open profile menu for ${displayName}`}
            title="Profile menu"
            variant="ghost"
            size="sm"
            {...stylex.props(
              appStyles.profileLink,
              placement === 'sidebar' && appStyles.sidebarProfileLink,
              collapsed && appStyles.sidebarProfileLinkCollapsed,
            )}
            onClick={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setOpen(true);
              }
            }}
          >
            <span
              {...stylex.props(
                appStyles.profileCopy,
                placement === 'sidebar' && appStyles.sidebarProfileCopy,
                collapsed && appStyles.sidebarProfileCopyCollapsed,
              )}
            >
              <span
                {...stylex.props(
                  appStyles.accountGreeting,
                  placement === 'sidebar' && appStyles.sidebarAccountGreeting,
                )}
              >
                Hello, {displayName}!
              </span>
              <span
                {...stylex.props(
                  appStyles.profileSubtitle,
                  placement === 'sidebar' && appStyles.sidebarProfileSubtitle,
                )}
              >
                My settings
              </span>
            </span>
            <span
              {...stylex.props(
                appStyles.profileAvatar,
                placement === 'sidebar' && appStyles.sidebarProfileAvatar,
              )}
              aria-hidden="true"
            >
              <UserRound size={28} />
            </span>
          </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="end"
            side={placement === 'sidebar' ? 'right' : undefined}
            sideOffset={8}
            alignOffset={0}
            collisionPadding={12}
            avoidCollisions
            sticky="always"
            {...stylex.props(
              appStyles.dropdownContent,
              placement === 'sidebar' && appStyles.sidebarDropdownContent,
            )}
          >
            <Popover.Close asChild>
              <Button asChild variant="ghost" size="sm" {...stylex.props(appStyles.dropdownItem)}>
                <Link href="/profile">
                  <UserRound {...stylex.props(appStyles.dropdownIcon)} aria-hidden="true" />
                  Profile settings
                </Link>
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button
                type="submit"
                form="profile-logout-form"
                variant="ghost"
                size="sm"
                {...stylex.props(appStyles.dropdownItem)}
              >
                <LogOut {...stylex.props(appStyles.dropdownIcon)} aria-hidden="true" />
                Log out
              </Button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </div>

      <form id="profile-logout-form" action={logoutAction} hidden />
    </Popover.Root>
  );
}
