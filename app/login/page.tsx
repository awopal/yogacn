import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import * as stylex from '@stylexjs/stylex';
import { loginStyles } from '../../styles/login.stylex';
import { formStyles } from '../../styles/form.stylex';
import { feedbackStyles } from '../../styles/feedback.stylex';
import { typographyStyles } from '../../styles/typography.stylex';
import { pageStyles } from '../../styles/page.stylex';

export default async function LoginPage() {
  const demoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  async function login() {
    'use server';
    (await cookies()).set('yoga_demo_auth', '1', { httpOnly: true, sameSite: 'lax', path: '/' });
    redirect('/dashboard');
  }
  return (
    <main {...stylex.props(loginStyles.wrap)}>
      <section className="login-copy">
        <p {...stylex.props(pageStyles.eyebrow)}>A workspace for yoga teachers</p>
        <h1 {...stylex.props(typographyStyles.h1)}>
          Plan
          <br />
          Teach
          <br />
          Improve
        </h1>
        <p {...stylex.props(typographyStyles.body)}>
          Keep your class sequences, capture what happened, and turn each lesson into a better next
          class.
        </p>
      </section>
      <Card className={stylex.props(loginStyles.card).className}>
        <h2 {...stylex.props(loginStyles.cardTitle)}>Welcome back</h2>
        <p {...stylex.props(loginStyles.cardDescription, typographyStyles.muted)}>
          Sign in to open your workspace
        </p>
        {demoMode && (
          <p {...stylex.props(feedbackStyles.success)}>
            Supabase is not configured — sign in to explore the sample workspace
          </p>
        )}
        <form action={login}>
          <div {...stylex.props(formStyles.field)}>
            <label {...stylex.props(formStyles.label)} htmlFor="email">
              Email
            </label>
            <input
              {...stylex.props(formStyles.control)}
              id="email"
              name="email"
              type="email"
              defaultValue={demoMode ? 'demo@yoga.local' : ''}
              required={!demoMode}
            />
          </div>
          <div {...stylex.props(formStyles.field)}>
            <label {...stylex.props(formStyles.label)} htmlFor="password">
              Password
            </label>
            <input
              {...stylex.props(formStyles.control)}
              id="password"
              name="password"
              type="password"
              defaultValue={demoMode ? 'demo-password' : ''}
              required={!demoMode}
            />
          </div>
          <Button type="submit">{demoMode ? 'Enter demo mode' : 'Sign in'}</Button>
        </form>
      </Card>
    </main>
  );
}
