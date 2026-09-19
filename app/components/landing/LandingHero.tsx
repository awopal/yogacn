import * as stylex from '@stylexjs/stylex';
import { landingStyles } from '@/styles/landing.stylex';
import { HeroCopy } from './HeroCopy';
import { LandingNav } from './LandingNav';
import { LandingVisual } from './LandingVisual';

export function LandingHero() {
  return (
    <div {...stylex.props(landingStyles.leftSide)}>
      <LandingNav />

      <div {...stylex.props(landingStyles.leftContent)}>
        <div {...stylex.props(landingStyles.orb)} aria-hidden="true" />
        <HeroCopy />
        <LandingVisual />
      </div>
    </div>
  );
}
