'use client';

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { landingStyles } from '@/styles/landing.stylex';
import { colors } from '@/styles/tokens.stylex';

type Role = 'instructor' | 'yogi';

export function RoleSelector() {
  const [role, setRole] = useState<Role>('yogi');

  return (
    <div
      {...stylex.props(landingStyles.roleSelector)}
      aria-label="Choose your role"
      role="radiogroup"
    >
      <label
        {...stylex.props(
          landingStyles.roleButtonBase,
          landingStyles.roleInstructorButton,
          role === 'instructor' && landingStyles.roleInstructorButtonActive,
        )}
      >
        <input
          {...stylex.props(landingStyles.roleOptionInput)}
          type="radio"
          name="role"
          value="instructor"
          checked={role === 'instructor'}
          onChange={() => setRole('instructor')}
        />
        I&apos;m an instructor
      </label>

      <span {...stylex.props(landingStyles.yinYangCenter)} aria-hidden="true">
        <span {...stylex.props(landingStyles.orbit)}>
          <span {...stylex.props(landingStyles.orbitDot)} />
          <span {...stylex.props(landingStyles.orbitDot, landingStyles.orbitDotSecondary)} />
        </span>

        <span {...stylex.props(landingStyles.yinYangMotion)}>
          <svg
            {...stylex.props(
              landingStyles.yinYangGraphic,
              role === 'yogi' && landingStyles.yinYangGraphicYogi,
            )}
            viewBox="0 0 100 100"
          >
            <path
              d="M50 0a50 50 0 0 1 0 100 25 25 0 0 1 0-50 25 25 0 0 0 0-50Z"
              fill={colors.primary}
            />
            <circle cx="50" cy="25" fill={colors.primary} r="8" />
            <circle cx="50" cy="75" fill={colors.secondaryMuted} r="8" />
          </svg>
        </span>
      </span>

      <label
        {...stylex.props(
          landingStyles.roleButtonBase,
          landingStyles.roleYogiButton,
          landingStyles.roleButtonYogi,
          role === 'yogi' && landingStyles.roleYogiButtonActive,
        )}
      >
        <input
          {...stylex.props(landingStyles.roleOptionInput)}
          type="radio"
          name="role"
          value="yogi"
          checked={role === 'yogi'}
          onChange={() => setRole('yogi')}
        />
        I&apos;m a yogi
      </label>
    </div>
  );
}
