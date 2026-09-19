import * as stylex from '@stylexjs/stylex';
import { LandingHero } from '@/app/components/landing/LandingHero';
import { SignInPanel } from '@/app/components/landing/SignInPanel';
import { landingStyles } from '@/styles/landing.stylex';

export default function Home() {
  return (
    <main {...stylex.props(landingStyles.page)}>
      <section {...stylex.props(landingStyles.hero)} aria-labelledby="hero-title">
        <LandingHero />
        <SignInPanel />
      </section>
    </main>
  );
}
