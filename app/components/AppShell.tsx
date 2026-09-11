import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  async function logout() {
    'use server';
    (await cookies()).delete('yoga_demo_auth');
    redirect('/login');
  }

  return (
    <div {...stylex.props(layoutStyles.appFrame)}>
      <Sidebar logoutAction={logout} />
      <main {...stylex.props(layoutStyles.contentShell, layoutStyles.main)}>
        <AppHeader />
        <div {...stylex.props(layoutStyles.contentArea)}>{children}</div>
      </main>
    </div>
  );
}
