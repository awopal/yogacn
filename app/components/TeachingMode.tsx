'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '../../styles/page.stylex';
import { teachingStyles } from '../../styles/teaching.stylex';
import { typographyStyles } from '../../styles/typography.stylex';
export default function TeachingMode({ title }: { title: string }) {
  const items = ['Seated breathing', 'Cat–Cow', 'Bird Dog', 'Hold Plank', 'Navasana', 'Savasana'];
  const [current, setCurrent] = useState(0);
  return (
    <main {...stylex.props(teachingStyles.mode)}>
      <p {...stylex.props(pageStyles.eyebrow)}>Teaching Mode · {title}</p>
      <p {...stylex.props(typographyStyles.muted)}>
        2 students may need modifications · เปิดรายละเอียดนักเรียนโดยตั้งใจ
      </p>
      <div {...stylex.props(teachingStyles.card)}>
        <span>
          Step {current + 1} / {items.length}
        </span>
        <h1 {...stylex.props(teachingStyles.title)}>{items[current]}</h1>
        <p {...stylex.props(teachingStyles.cue)}>
          Move slowly with the breath. Keep the torso steady.
        </p>
        <div {...stylex.props(teachingStyles.progress)}>
          <span
            {...stylex.props(teachingStyles.progressFill)}
            style={{ width: `${((current + 1) / items.length) * 100}%` }}
          />
        </div>
        <div {...stylex.props(pageStyles.actions)}>
          <Button
            variant="ghost"
            disabled={current === 0}
            onClick={() => setCurrent((value) => value - 1)}
          >
            ← Previous
          </Button>
          <Button
            disabled={current === items.length - 1}
            onClick={() => setCurrent((value) => value + 1)}
          >
            Next →
          </Button>
        </div>
      </div>
      <Button variant="outline" asChild>
        <a
          href={`/classes/${title === 'Core & Control' ? 'core-control' : 'gentle-balance'}/reflect`}
        >
          Finish and reflect
        </a>
      </Button>
    </main>
  );
}
