'use server';

import { redirect } from 'next/navigation';
import { createSession, type DemoRole } from './session';
import { INSTRUCTOR_ROUTES, YOGI_ROUTES } from '@/lib/routes';

function getRole(formData: FormData): DemoRole {
  return formData.get('role') === 'instructor' ? 'instructor' : 'yogi';
}

async function signIn(formData: FormData) {
  const role = getRole(formData);
  await createSession(role);
  redirect(role === 'yogi' ? YOGI_ROUTES.ROOT : INSTRUCTOR_ROUTES.ROOT);
}

export async function login(formData: FormData) {
  await signIn(formData);
}
