import type { SidebarMenuItem } from '@/app/components/Sidebar';
import { YOGI_ROUTES } from '@/lib/routes';

export const yogiSidebarItems: SidebarMenuItem[] = [
  { href: YOGI_ROUTES.ROOT, label: 'Overview', icon: 'home' },
  { href: YOGI_ROUTES.CLASSES, label: 'Classes', icon: 'library' },
  { href: YOGI_ROUTES.INSTRUCTORS, label: 'Instructors', icon: 'users' },
  { href: YOGI_ROUTES.BOOKINGS, label: 'Bookings', icon: 'calendar' },
];

export const yogiProfile: SidebarMenuItem = {
  href: YOGI_ROUTES.PROFILE,
  label: 'Overview',
  icon: 'home',
};
