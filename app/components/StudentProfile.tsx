'use client';

import * as stylex from '@stylexjs/stylex';
import type { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { studentsStyles } from '@/styles/students.stylex';
import { PenLine } from 'lucide-react';
import { colors } from '@/styles/tokens.stylex';

function formatProfileValue(value?: string) {
  if (!value) return 'Not set';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function StudentProfile({
  student,
  onEdit,
}: {
  student: Student;
  onEdit: () => void;
}) {
  return (
    <section {...stylex.props(studentsStyles.profileView)}>
      <SectionHeader
        title="Student profile"
        description="Personal details and teaching preferences"
        action={
          <Button type="button" size="sm" onClick={onEdit}>
            <PenLine size={18} color={colors.text} />
            Edit profile
          </Button>
        }
      />

      <div {...stylex.props(studentsStyles.profileViewGrid)}>
        <div {...stylex.props(studentsStyles.profileViewCard)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Email</p>
          <p {...stylex.props(studentsStyles.profileViewValue)}>{student.email || 'Not set'}</p>
        </div>
        <div {...stylex.props(studentsStyles.profileViewCard)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Phone number</p>
          <p {...stylex.props(studentsStyles.profileViewValue)}>
            {student.phoneNumber || 'Not set'}
          </p>
        </div>
        <div {...stylex.props(studentsStyles.profileViewCard)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Gender</p>
          <p {...stylex.props(studentsStyles.profileViewValue)}>
            {formatProfileValue(student.gender)}
          </p>
        </div>
        <div {...stylex.props(studentsStyles.profileViewCard)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Fitness level</p>
          <p {...stylex.props(studentsStyles.profileViewValue)}>
            {formatProfileValue(student.fitnessLevel)}
          </p>
        </div>
        <div {...stylex.props(studentsStyles.profileViewCard, studentsStyles.profileViewCardWide)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Notes</p>
          <p {...stylex.props(studentsStyles.profileViewValue)}>{student.note || 'No notes yet'}</p>
        </div>
        <div {...stylex.props(studentsStyles.profileViewCard)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Class preferences</p>
          <p {...stylex.props(studentsStyles.profileViewValue)}>
            {formatProfileValue(student.preferredClassLevel)} ·{' '}
            {student.preferredYogaType || 'Yoga type not set'}
          </p>
          {student.preferredClassTiming?.length ? (
            <div {...stylex.props(studentsStyles.profileViewTags)}>
              {student.preferredClassTiming.map((timing) => (
                <span key={timing} {...stylex.props(studentsStyles.profileViewTag)}>
                  {timing}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div {...stylex.props(studentsStyles.profileViewCard)}>
          <p {...stylex.props(studentsStyles.profileViewLabel)}>Primary goals</p>
          {student.primaryGoals?.length ? (
            <div {...stylex.props(studentsStyles.profileViewTags)}>
              {student.primaryGoals.map((goal) => (
                <span key={goal} {...stylex.props(studentsStyles.profileViewTag)}>
                  {goal}
                </span>
              ))}
            </div>
          ) : (
            <p {...stylex.props(studentsStyles.profileViewValue)}>No goals set</p>
          )}
        </div>
      </div>
    </section>
  );
}
