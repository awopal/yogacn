import { cookies } from 'next/headers';

export type DemoRole = 'yogi' | 'instructor';

const AUTH_COOKIE = 'yoga_demo_auth';
const ROLE_COOKIE = 'yoga_demo_role';

export async function createSession(role: DemoRole) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  cookieStore.set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}
