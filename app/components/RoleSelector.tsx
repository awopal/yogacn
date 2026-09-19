'use client';

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { landingStyles } from '@/styles/landing.stylex';
import { colors } from '@/styles/tokens.stylex';

type Role = 'teacher' | 'student';

export function RoleSelector() {
  const [role, setRole] = useState<Role>('student');

  return (
    <div
      {...stylex.props(landingStyles.roleSelector)}
      aria-label="Choose your role"
      role="radiogroup"
    >
      <label
        {...stylex.props(
          landingStyles.roleButtonBase,
          landingStyles.roleTeacherButton,
          role === 'teacher' && landingStyles.roleTeacherButtonActive,
        )}
      >
        <input
          {...stylex.props(landingStyles.roleOptionInput)}
          type="radio"
          name="role"
          value="teacher"
          checked={role === 'teacher'}
          onChange={() => setRole('teacher')}
        />
        I&apos;m a teacher
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
              role === 'student' && landingStyles.yinYangGraphicStudent,
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
          landingStyles.roleStudentButton,
          landingStyles.roleButtonStudent,
          role === 'student' && landingStyles.roleStudentButtonActive,
        )}
      >
        <input
          {...stylex.props(landingStyles.roleOptionInput)}
          type="radio"
          name="role"
          value="student"
          checked={role === 'student'}
          onChange={() => setRole('student')}
        />
        I&apos;m a student
      </label>
    </div>
  );
}
