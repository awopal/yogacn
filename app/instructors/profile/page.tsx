import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { PUBLIC_ROUTES } from '@/lib/routes';

export default async function ProfilePage() {
  if ((await cookies()).get('yoga_demo_auth')?.value !== '1') redirect(PUBLIC_ROUTES.ROOT);

  return (
    <main {...stylex.props(pageStyles.page)}>
      <p {...stylex.props(pageStyles.eyebrow)}>Account</p>
      <h1 {...stylex.props(typographyStyles.h1)}>Profile</h1>
      <p {...stylex.props(typographyStyles.body)}>
        Profile settings will be available here when account data is connected.
      </p>
    </main>
  );
}
