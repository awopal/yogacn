import * as stylex from '@stylexjs/stylex';
import { landingStyles } from '@/styles/landing.stylex';

export function LandingNav() {
  return (
    <nav {...stylex.props(landingStyles.nav)} aria-label="Main navigation">
      <span {...stylex.props(landingStyles.navBrand)}>yogacn</span>
    </nav>
  );
}
