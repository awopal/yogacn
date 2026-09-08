'use client';

import { useState } from 'react';
import type { Student } from '../../lib/types';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cardStyles } from '@/components/ui/card';
import { pageStyles } from '../../styles/page.stylex';
import { formStyles } from '../../styles/form.stylex';
import { studentStyles } from '../../styles/student.stylex';

export default function StudentManager({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  function addStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setStudents((current) => [
      ...current,
      {
        id: `student-${Date.now()}`,
        displayName: name.trim(),
        note: note.trim(),
        status: 'active'
      }
    ]);
    setName('');
    setNote('');
    setOpen(false);
  }
  return (
    <>
      <Button type="button" onClick={() => setOpen((value) => !value)}>
        ＋ Add student
      </Button>
      {open && (
        <form {...stylex.props(ui.surface)} className="add-form" onSubmit={addStudent}>
          <label {...stylex.props(formStyles.field)}>
            <span {...stylex.props(formStyles.label)}>Display name</span>
            <input
              {...stylex.props(formStyles.control, formStyles.textarea)}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label {...stylex.props(formStyles.field)}>
            <span {...stylex.props(formStyles.label)}>General note (not a diagnosis)</span>
            <textarea
              {...stylex.props(formStyles.control)}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <div {...stylex.props(pageStyles.actions)}>
            <Button type="submit">Save student</Button>
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
      <div {...stylex.props(studentStyles.list)}>
        {students.map((student) => (
          <a
            {...stylex.props(cardStyles.card)}
            className={stylex.props(studentStyles.item).className}
            key={student.id}
            href={`/students/${student.id}`}
          >
            <div className="avatar">{student.displayName[0]}</div>
            <div {...stylex.props(studentStyles.content)}>
              <h2 {...stylex.props(studentStyles.title)}>{student.displayName}</h2>
              <p {...stylex.props(studentStyles.description)}>
                {student.note || 'No general note yet'}
              </p>
            </div>
            <Badge>{student.status === 'active' ? 'Active' : 'Archived'}</Badge>
          </a>
        ))}
      </div>
    </>
  );
}
