import type { SidebarMenuItem } from '@/app/components/Sidebar';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';

export const instructorSidebarItems: SidebarMenuItem[] = [
  { href: INSTRUCTOR_ROUTES.ROOT, label: 'Dashboard', icon: 'home' },
  { href: INSTRUCTOR_ROUTES.SCHEDULE, label: 'Class Schedule', icon: 'calendar' },
  { href: INSTRUCTOR_ROUTES.CLASSES.ROOT, label: 'Classes', icon: 'library' },
  { href: INSTRUCTOR_ROUTES.YOGIS.ROOT, label: 'Yogi notes', icon: 'users' },
];

export const instructorProfile: SidebarMenuItem = {
  href: INSTRUCTOR_ROUTES.PROFILE,
  label: 'Overview',
  icon: 'home',
};
