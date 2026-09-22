import type { Metadata } from 'next';
import { Oooh_Baby } from 'next/font/google';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import './globals.css';
import * as stylex from '@stylexjs/stylex';
import { typographyStyles } from '../styles/typography.stylex';
import { ToastProvider } from '@/components/ui/toast';
import AppShell from './components/AppShell';
import { PUBLIC_ROUTES } from '@/lib/routes';

const ooohBaby = Oooh_Baby({
  variable: '--font-oooh-baby',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'yogacn',
  description: 'A workspace for planning and reviewing yoga classes',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  async function logout() {
    'use server';
    (await cookies()).delete('yoga_demo_auth');
    redirect(PUBLIC_ROUTES.ROOT);
  }

  return (
    <html lang="en">
      <body {...stylex.props(typographyStyles.body)} className={ooohBaby.variable}>
        <ToastProvider>
          <AppShell logoutAction={logout}>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
