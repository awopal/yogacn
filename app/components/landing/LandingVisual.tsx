import * as stylex from '@stylexjs/stylex';
import { landingStyles } from '@/styles/landing.stylex';

export function LandingVisual() {
  return (
    <div {...stylex.props(landingStyles.visual)} aria-hidden="true">
      <div {...stylex.props(landingStyles.panel)}>
        <p {...stylex.props(landingStyles.panelLabel)}>Today&apos;s tiny intention</p>
        <p {...stylex.props(landingStyles.panelTitle)}>Breathe in. Wiggle out. Teach with heart.</p>
        <div {...stylex.props(landingStyles.panelLine)} />
        <div {...stylex.props(landingStyles.panelLine, landingStyles.panelLineShort)} />
      </div>

      <div {...stylex.props(landingStyles.roleCard)}>
        <div {...stylex.props(landingStyles.roleHeader)}>
          <span {...stylex.props(landingStyles.roleDot)} />
          <p {...stylex.props(landingStyles.roleTitle)}>Made for your yoga era</p>
        </div>
        <p {...stylex.props(landingStyles.roleText)}>
          Leading a class or finding your balance? You&apos;ve got this—and we&apos;ve got you.
        </p>
      </div>
    </div>
  );
}
