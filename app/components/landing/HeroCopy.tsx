import * as stylex from '@stylexjs/stylex';
import { YogaLogoIcon } from '@/components/icons';
import { landingStyles } from '@/styles/landing.stylex';
import { colors } from '@/styles/tokens.stylex';

export function HeroCopy() {
  return (
    <>
      <h1 id="hero-title" {...stylex.props(landingStyles.title)}>
        <span {...stylex.props(landingStyles.titleWord)}>
          <span {...stylex.props(landingStyles.spacing)}>Bring</span>
          <YogaLogoIcon
            size="48px"
            color={colors.tertiary}
            strokeWidth={8}
            preserveAspectRatio="none"
          />
        </span>
        <br />
        movement
        <br />
        <span {...stylex.props(landingStyles.together)}>together.</span>
        <br />
        <span {...stylex.props(landingStyles.titleScriptGroup)}>
          <span {...stylex.props(landingStyles.titleScript)}>
            create your <br />
            <span {...stylex.props(landingStyles.titleJourney)}>
              JOURNEY.
              <span {...stylex.props(landingStyles.titleBrand)}>yogacn</span>
            </span>
          </span>
        </span>
      </h1>

      <p {...stylex.props(landingStyles.description)}>
        One happy little home for yoga instructors and yogis to plan classes, keep track of your
        practice and grow together.
      </p>
    </>
  );
}
