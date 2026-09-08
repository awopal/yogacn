'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import * as stylex from '@stylexjs/stylex';
import { formStyles } from '../../styles/form.stylex';
import { feedbackStyles } from '../../styles/feedback.stylex';
import { reflectionStyles } from '../../styles/reflection.stylex';
import { typographyStyles } from '../../styles/typography.stylex';

const schema = z.object({
  observation: z.string().min(2, 'กรุณาระบุ observation'),
  modification: z.string().min(2, 'กรุณาระบุ teaching modification')
});

export default function ObservationForm() {
  const [observation, setObservation] = useState('');
  const [modification, setModification] = useState('');
  const [message, setMessage] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = schema.safeParse({ observation, modification });
    setMessage(
      result.success
        ? 'บันทึก observation ใน demo mode แล้ว'
        : (result.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง')
    );
  }

  return (
    <form {...stylex.props(reflectionStyles.form)} onSubmit={submit}>
      <h3 {...stylex.props(typographyStyles.h3)}>Add observation</h3>
      <label {...stylex.props(formStyles.field)}>
        <span {...stylex.props(formStyles.label)}>Observation</span>
        <textarea
          {...stylex.props(formStyles.control, formStyles.textarea)}
          value={observation}
          onChange={(event) => setObservation(event.target.value)}
        />
      </label>
      <label {...stylex.props(formStyles.field)}>
        <span {...stylex.props(formStyles.label)}>Teaching modification</span>
        <textarea
          {...stylex.props(formStyles.control, formStyles.textarea)}
          value={modification}
          onChange={(event) => setModification(event.target.value)}
        />
      </label>
      <Button type="submit">Save observation</Button>
      {message && (
        <p
          {...stylex.props(
            message.startsWith('บันทึก') ? feedbackStyles.success : feedbackStyles.error
          )}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
