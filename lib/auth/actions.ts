'use server';

import { redirect } from 'next/navigation';
import { createSession, type DemoRole } from './session';

function getRole(formData: FormData): DemoRole {
  return formData.get('role') === 'teacher' ? 'teacher' : 'student';
}

async function signIn(formData: FormData) {
  await createSession(getRole(formData));
  redirect('/dashboard');
}

export async function login(formData: FormData) {
  await signIn(formData);
}
