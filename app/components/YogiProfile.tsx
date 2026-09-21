'use client';

import * as stylex from '@stylexjs/stylex';
import type { Yogi } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { yogisStyles } from '@/styles/yogis.stylex';
import { PenLine } from 'lucide-react';
import { colors } from '@/styles/tokens.stylex';

function formatProfileValue(value?: string) {
  if (!value) return 'Not set';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function YogiProfile({ yogi, onEdit }: { yogi: Yogi; onEdit: () => void }) {
  return (
    <section {...stylex.props(yogisStyles.profileView)}>
      <SectionHeader
        title="Yogi profile"
        description="Personal details and teaching preferences"
        action={
          <Button type="button" size="sm" onClick={onEdit}>
            <PenLine size={18} color={colors.text} />
            Edit profile
          </Button>
        }
      />

      <div {...stylex.props(yogisStyles.profileViewGrid)}>
        <div {...stylex.props(yogisStyles.profileViewCard)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Email</p>
          <p {...stylex.props(yogisStyles.profileViewValue)}>{yogi.email || 'Not set'}</p>
        </div>
        <div {...stylex.props(yogisStyles.profileViewCard)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Phone number</p>
          <p {...stylex.props(yogisStyles.profileViewValue)}>{yogi.phoneNumber || 'Not set'}</p>
        </div>
        <div {...stylex.props(yogisStyles.profileViewCard)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Gender</p>
          <p {...stylex.props(yogisStyles.profileViewValue)}>{formatProfileValue(yogi.gender)}</p>
        </div>
        <div {...stylex.props(yogisStyles.profileViewCard)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Fitness level</p>
          <p {...stylex.props(yogisStyles.profileViewValue)}>
            {formatProfileValue(yogi.fitnessLevel)}
          </p>
        </div>
        <div {...stylex.props(yogisStyles.profileViewCard, yogisStyles.profileViewCardWide)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Notes</p>
          <p {...stylex.props(yogisStyles.profileViewValue)}>{yogi.note || 'No notes yet'}</p>
        </div>
        <div {...stylex.props(yogisStyles.profileViewCard)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Class preferences</p>
          <p {...stylex.props(yogisStyles.profileViewValue)}>
            {formatProfileValue(yogi.preferredClassLevel)} ·{' '}
            {yogi.preferredYogaType || 'Yoga type not set'}
          </p>
          {yogi.preferredClassTiming?.length ? (
            <div {...stylex.props(yogisStyles.profileViewTags)}>
              {yogi.preferredClassTiming.map((timing) => (
                <span key={timing} {...stylex.props(yogisStyles.profileViewTag)}>
                  {timing}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div {...stylex.props(yogisStyles.profileViewCard)}>
          <p {...stylex.props(yogisStyles.profileViewLabel)}>Primary goals</p>
          {yogi.primaryGoals?.length ? (
            <div {...stylex.props(yogisStyles.profileViewTags)}>
              {yogi.primaryGoals.map((goal) => (
                <span key={goal} {...stylex.props(yogisStyles.profileViewTag)}>
                  {goal}
                </span>
              ))}
            </div>
          ) : (
            <p {...stylex.props(yogisStyles.profileViewValue)}>No goals set</p>
          )}
        </div>
      </div>
    </section>
  );
}
