import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import YogiDashboard from '../components/yogi/YogiDashboard';
import { PUBLIC_ROUTES } from '@/lib/routes';

export default async function YogiPage() {
  const cookieStore = await cookies();
  if (cookieStore.get('yoga_demo_auth')?.value !== '1') redirect(PUBLIC_ROUTES.ROOT);

  return <YogiDashboard />;
}
