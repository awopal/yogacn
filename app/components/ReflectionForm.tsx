'use client';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { cardStyles } from '@/components/ui/card';
import { formStyles } from '../../styles/form.stylex';
import { feedbackStyles } from '../../styles/feedback.stylex';
import { reflectionStyles } from '../../styles/reflection.stylex';
import { typographyStyles } from '../../styles/typography.stylex';
const schema = z.object({
  actual: z.number().min(1).max(360),
  reflection: z.string().min(2, 'กรุณาเขียน reflection อย่างน้อยเล็กน้อย'),
  adjustment: z.string().min(2, 'กรุณาระบุ adjustment สำหรับครั้งถัดไป'),
});
export default function ReflectionForm({ planned }: { planned: number }) {
  const [actual, setActual] = useState(planned);
  const [reflection, setReflection] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [message, setMessage] = useState('');
  function save() {
    const result = schema.safeParse({ actual, reflection, adjustment });
    setMessage(
      result.success
        ? 'บันทึก reflection แล้ว และเก็บเป็นประวัติใหม่'
        : (result.error.issues[0]?.message ?? 'กรุณาตรวจสอบข้อมูล'),
    );
  }
  return (
    <form
      {...stylex.props(cardStyles.card)}
      className={stylex.props(reflectionStyles.form).className}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <p {...stylex.props(typographyStyles.muted)}>
        Planned duration: {planned} min · Actual duration: {actual} min
      </p>
      <label {...stylex.props(formStyles.field)}>
        <span {...stylex.props(formStyles.label)}>Actual duration</span>
        <Input
          className={stylex.props(formStyles.control, formStyles.textarea).className}
          type="number"
          value={actual}
          onChange={(event) => setActual(Number(event.target.value))}
        />
      </label>
      <label {...stylex.props(formStyles.field)}>
        <span {...stylex.props(formStyles.label)}>What worked well</span>
        <Textarea
          {...stylex.props(formStyles.textarea)}
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
        />
      </label>
      <label {...stylex.props(formStyles.field)}>
        <span {...stylex.props(formStyles.label)}>Adjustment for next time</span>
        <Textarea value={adjustment} onChange={(event) => setAdjustment(event.target.value)} />
      </label>
      <div {...stylex.props(pageStyles.actions)}>
        <Button type="submit">Save reflection</Button>
        <Button variant="outline" asChild>
          <a href="/instructors">Cancel</a>
        </Button>
      </div>
      {message && (
        <p
          {...stylex.props(
            message.startsWith('บันทึก') ? feedbackStyles.success : feedbackStyles.error,
          )}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
