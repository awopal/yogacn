'use client';

import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { formStyles } from '../../styles/form.stylex';
import { plannerStyles } from '../../styles/planner.stylex';
import { feedbackStyles } from '../../styles/feedback.stylex';
import { typographyStyles } from '../../styles/typography.stylex';
import { useClassBuilderStore } from '@/lib/stores/class-builder-store';
import type { Level } from '@/lib/types';

const planSchema = z.object({
  title: z.string().min(2, 'กรุณาระบุชื่อคลาสอย่างน้อย 2 ตัวอักษร'),
  intention: z.string().min(2, 'กรุณาระบุ intention'),
  duration: z.number().min(10).max(240),
});

export default function Planner({
  initialTitle = 'Core & Control',
  initialIntention = 'Steady from the center',
  initialLevel = 'intermediate',
  initialDuration = 60,
  initialPeakPose = 'Navasana',
}: {
  initialTitle?: string;
  initialIntention?: string;
  initialLevel?: Level;
  initialDuration?: number;
  initialPeakPose?: string;
}) {
  const draft = useClassBuilderStore((state) => state.draft);
  const error = useClassBuilderStore((state) => state.error);
  const setField = useClassBuilderStore((state) => state.setField);
  const addSection = useClassBuilderStore((state) => state.addSection);
  const updateSection = useClassBuilderStore((state) => state.updateSection);
  const addItem = useClassBuilderStore((state) => state.addItem);
  const updateItem = useClassBuilderStore((state) => state.updateItem);
  const removeItem = useClassBuilderStore((state) => state.removeItem);
  const reorderItem = useClassBuilderStore((state) => state.reorderItem);
  const setError = useClassBuilderStore((state) => state.setError);
  const reset = useClassBuilderStore((state) => state.reset);

  useEffect(() => {
    reset({
      title: initialTitle,
      intention: initialIntention,
      level: initialLevel,
      duration: initialDuration,
      peakPose: initialPeakPose,
    });
  }, [initialDuration, initialIntention, initialLevel, initialPeakPose, initialTitle, reset]);

  const total = useMemo(
    () => draft.sections.reduce((sum, section) => sum + section.items.length * 5, 0),
    [draft.sections],
  );

  function save() {
    const result = planSchema.safeParse({
      title: draft.title,
      intention: draft.intention,
      duration: draft.duration,
    });
    setError(
      result.success
        ? 'บันทึกแผนคลาสใน demo mode แล้ว'
        : (result.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง'),
    );
  }

  return (
    <Card className={cn(stylex.props(plannerStyles.planner).className)}>
      <div {...stylex.props(plannerStyles.grid)}>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>ชื่อคลาส</span>
          <Input
            className={stylex.props(formStyles.control).className}
            value={draft.title}
            onChange={(event) => setField('title', event.target.value)}
          />
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Intention</span>
          <Input
            className={stylex.props(formStyles.control).className}
            value={draft.intention}
            onChange={(event) => setField('intention', event.target.value)}
          />
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Level</span>
          <select
            {...stylex.props(formStyles.control)}
            value={draft.level}
            onChange={(event) => setField('level', event.target.value as Level)}
          >
            <option>beginner</option>
            <option>all_levels</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Duration (minutes)</span>
          <Input
            className={stylex.props(formStyles.control).className}
            type="number"
            value={draft.duration}
            onChange={(event) => setField('duration', Number(event.target.value))}
          />
        </label>
        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Peak pose</span>
          <Input
            className={stylex.props(formStyles.control).className}
            value={draft.peakPose}
            onChange={(event) => setField('peakPose', event.target.value)}
          />
        </label>
      </div>
      <p
        {...stylex.props(
          total > draft.duration * 60 ? feedbackStyles.error : typographyStyles.muted,
        )}
      >
        Calculated content: {total} minutes{' '}
        {total > draft.duration * 60 ? '— เนื้อหาเกินเวลาที่เลือก' : ''}
      </p>
      <div {...stylex.props(plannerStyles.sectionList)}>
        {draft.sections.map((section) => (
          <Card key={section.id}>
            <Input
              className={cn(stylex.props(formStyles.control, plannerStyles.sectionTitle).className)}
              value={section.name}
              onChange={(event) => updateSection(section.id, event.target.value)}
            />
            {section.items.map((item, itemIndex) => (
              <div {...stylex.props(plannerStyles.item)} key={item.id}>
                <Input
                  className={stylex.props(formStyles.control, plannerStyles.itemInput).className}
                  value={item.name}
                  onChange={(event) => updateItem(section.id, item.id, event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={itemIndex === 0}
                  onClick={() => reorderItem(section.id, itemIndex, itemIndex - 1)}
                  aria-label="Move pose up"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={itemIndex === section.items.length - 1}
                  onClick={() => reorderItem(section.id, itemIndex, itemIndex + 1)}
                  aria-label="Move pose down"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(section.id, item.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => addItem(section.id)}>
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
          {...stylex.props(error.includes('บันทึก') ? feedbackStyles.success : feedbackStyles.error)}
          role="status"
        >
          {error}
        </p>
      )}
    </Card>
  );
}
