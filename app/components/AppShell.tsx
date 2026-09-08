import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { YogaLogoIcon } from '@/components/icons';
import * as stylex from '@stylexjs/stylex';
import { appStyles } from '@/styles/app.stylex';
import { colors } from '@/styles/tokens.stylex';

export default function AppShell({ children }: { children: React.ReactNode }) {
  async function logout() {
    'use server';
    (await cookies()).delete('yoga_demo_auth');
    redirect('/login');
  }

  return (
    <>
      <div {...stylex.props(appStyles.demoNotice)}>
        Demo mode — sample data is separate from Supabase and is not suitable for real information
      </div>
      <header {...stylex.props(appStyles.header)}>
        <div {...stylex.props(appStyles.brandCluster)}>
          <span {...stylex.props(appStyles.brandMark)} aria-hidden="true">
            <YogaLogoIcon size={30} color={colors.text} />
          </span>
          <Link {...stylex.props(appStyles.brand)} href="/dashboard">
            <span>yogacn</span>
          </Link>
        </div>
        <nav {...stylex.props(appStyles.nav)} aria-label="Main navigation">
          <Link {...stylex.props(appStyles.navLink)} href="/dashboard">
            Dashboard
          </Link>
          <Link {...stylex.props(appStyles.navLink)} href="/classes/new">
            Create class
          </Link>
          <Link {...stylex.props(appStyles.navLink)} href="/students">
            Student notes
          </Link>
        </nav>
        <form action={logout}>
          <Button variant="ghost" size="sm" type="submit">
            Log out
          </Button>
        </form>
      </header>
      {children}
    </>
  );
}
