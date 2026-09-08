'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { formStyles } from '../../styles/form.stylex';
import { plannerStyles } from '../../styles/planner.stylex';
import { feedbackStyles } from '../../styles/feedback.stylex';
import { typographyStyles } from '../../styles/typography.stylex';

const planSchema = z.object({
  title: z.string().min(2, 'กรุณาระบุชื่อคลาสอย่างน้อย 2 ตัวอักษร'),
  intention: z.string().min(2, 'กรุณาระบุ intention'),
  duration: z.number().min(10).max(240)
});

type Section = { name: string; items: string[] };

export default function Planner({
  initialTitle = 'Core & Control',
  initialIntention = 'Steady from the center',
  initialLevel = 'intermediate',
  initialDuration = 60,
  initialPeakPose = 'Navasana'
}: {
  initialTitle?: string;
  initialIntention?: string;
  initialLevel?: string;
  initialDuration?: number;
  initialPeakPose?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [intention, setIntention] = useState(initialIntention);
  const [level, setLevel] = useState(initialLevel);
  const [duration, setDuration] = useState(initialDuration);
  const [peakPose, setPeakPose] = useState(initialPeakPose);
  const [error, setError] = useState('');
  const [sections, setSections] = useState<Section[]>([
    { name: 'Arrival & Warm-up', items: ['Seated breathing', 'Cat–Cow', 'Bird Dog'] },
    {
      name: 'Sun A — Core Progression',
      items: ['Round 1: Hold Plank', 'Round 2: Add 2 Low Planks', 'Round 3: Add Side Plank']
    },
    {
      name: 'Balance & Peak Focus',
      items: ['High Lunge to Warrior III', 'Navasana', 'Core Compression']
    },
    { name: 'Cool Down', items: ['Supine Twist', 'Savasana'] }
  ]);

  const total = useMemo(
    () => sections.reduce((sum, section) => sum + section.items.length * 5, 0),
    [sections]
  );

  function save() {
    const result = planSchema.safeParse({ title, intention, duration });
    setError(
      result.success
        ? 'บันทึกแผนคลาสใน demo mode แล้ว'
        : (result.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง')
    );
  }

  function addSection() {
    setSections((current) => [...current, { name: 'New section', items: [] }]);
  }

  function addItem(index: number) {
    setSections((current) =>
      current.map((section, i) =>
        i === index ? { ...section, items: [...section.items, 'New pose'] } : section
      )
    );
  }

  return (
    <Card className={cn(stylex.props(plannerStyles.planner).className)}>
      <div {...stylex.props(plannerStyles.grid)}>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>ชื่อคลาส</span>
          <input
            {...stylex.props(formStyles.control)}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Intention</span>
          <input
            {...stylex.props(formStyles.control)}
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
          />
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Level</span>
          <select
            {...stylex.props(formStyles.control)}
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option>beginner</option>
            <option>all_levels</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Duration (minutes)</span>
          <input
            {...stylex.props(formStyles.control)}
            type="number"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          />
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Peak pose</span>
          <input
            {...stylex.props(formStyles.control)}
            value={peakPose}
            onChange={(event) => setPeakPose(event.target.value)}
          />
        </label>
      </div>
      <p {...stylex.props(total > duration * 60 ? feedbackStyles.error : typographyStyles.muted)}>
        Calculated content: {total} minutes{' '}
        {total > duration * 60 ? '— เนื้อหาเกินเวลาที่เลือก' : ''}
      </p>
      <div {...stylex.props(plannerStyles.sectionList)}>
        {sections.map((section, index) => (
          <Card key={`${section.name}-${index}`}>
            <input
              className={cn(stylex.props(formStyles.control, plannerStyles.sectionTitle).className)}
              value={section.name}
              onChange={(event) =>
                setSections((current) =>
                  current.map((item, i) =>
                    i === index ? { ...item, name: event.target.value } : item
                  )
                )
              }
            />
            {section.items.map((item, itemIndex) => (
              <div {...stylex.props(plannerStyles.item)} key={`${item}-${itemIndex}`}>
                <input
                  {...stylex.props(formStyles.control, plannerStyles.itemInput)}
                  value={item}
                  onChange={(event) =>
                    setSections((current) =>
                      current.map((s, i) =>
                        i === index
                          ? {
                              ...s,
                              items: s.items.map((value, j) =>
                                j === itemIndex ? event.target.value : value
                              )
                            }
                          : s
                      )
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSections((current) =>
                      current.map((s, i) =>
                        i === index ? { ...s, items: s.items.filter((_, j) => j !== itemIndex) } : s
                      )
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => addItem(index)}>
              ＋ Add item
            </Button>
          </Card>
        ))}
      </div>
      <div {...stylex.props(pageStyles.actions)}>
        <Button type="button" variant="ghost" onClick={addSection}>
          ＋ Add section
        </Button>
        <Button type="button" onClick={save}>
          Save plan
        </Button>
      </div>
      {error && (
        <p
          {...stylex.props(
            error.includes('บันทึก') ? feedbackStyles.success : feedbackStyles.error
          )}
          role="status"
        >
          {error}
        </p>
      )}
    </Card>
  );
}
