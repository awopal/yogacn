import { redirect } from 'next/navigation';
import { PUBLIC_ROUTES } from '@/lib/routes';

export default function LegacyLandingPage() {
  redirect(PUBLIC_ROUTES.NAMASTE);
}
