'use client';

import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import * as stylex from '@stylexjs/stylex';
import type { StudentObservation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { formStyles } from '@/styles/form.stylex';
import { observationStyles } from '@/styles/observation.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { colors } from '@/styles/tokens.stylex';

const CURRENT_USER = 'Teacher';
const schema = z.object({
  observation: z.string().trim().min(2, 'Please enter an observation.'),
});
const storageKey = (studentId: string) => `student-observations:${studentId}`;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function StudentObservationTimeline({ studentId }: { studentId: string }) {
  const [observations, setObservations] = useState<StudentObservation[]>([]);
  const [observation, setObservation] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [observationPage, setObservationPage] = useState(1);
  const toastManager = useToast();

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey(studentId));
    if (!stored) return;
    try {
      setObservations(
        (JSON.parse(stored) as StudentObservation[]).sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        ),
      );
    } catch {
      toastManager.add({
        title: 'Unable to load observations',
        description: 'Please try again.',
        type: 'error',
      });
    }
  }, [studentId, toastManager]);

  const observationPageSize = 5;
  const observationPageCount = Math.max(1, Math.ceil(observations.length / observationPageSize));
  const visibleObservations = observations.slice(
    (observationPage - 1) * observationPageSize,
    observationPage * observationPageSize,
  );

  function persist(next: StudentObservation[]) {
    window.localStorage.setItem(storageKey(studentId), JSON.stringify(next));
    setObservations(next);
    setObservationPage((page) =>
      Math.min(page, Math.max(1, Math.ceil(next.length / observationPageSize))),
    );
  }

  function startAdd() {
    setEditingId(null);
    setObservation('');
    setIsAdding(true);
  }

  function startEdit(item: StudentObservation) {
    setEditingId(item.id);
    setObservation(item.observation);
    setIsAdding(true);
  }

  function cancel() {
    setEditingId(null);
    setObservation('');
    setIsAdding(false);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    const result = schema.safeParse({ observation });
    if (!result.success) {
      toastManager.add({
        title: 'Observation could not be saved',
        description: result.error.issues[0]?.message ?? 'Invalid observation.',
        type: 'error',
      });
      return;
    }

    if (editingId) {
      const next = observations
        .map((item) =>
          item.id === editingId ? { ...item, observation: result.data.observation } : item,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      persist(next);
      toastManager.add({
        title: 'Observation updated',
        description: 'The student timeline has been updated.',
        type: 'success',
      });
    } else {
      const next: StudentObservation[] = [
        {
          id: `observation-${Date.now()}`,
          studentId,
          observation: result.data.observation,
          createdAt: new Date().toISOString(),
          createdBy: CURRENT_USER,
        },
        ...observations,
      ];
      persist(next);
      setObservationPage(1);
      toastManager.add({
        title: 'Observation saved',
        description: 'The observation was added to the student timeline.',
        type: 'success',
      });
    }
    setObservation('');
    setEditingId(null);
    setIsAdding(false);
  }

  function remove(id: string) {
    persist(observations.filter((item) => item.id !== id));
    toastManager.add({
      title: 'Observation deleted',
      description: 'The observation was removed from the student timeline.',
      type: 'success',
    });
  }

  function renderEditor(isEditing: boolean) {
    return (
      <form
        {...stylex.props(isEditing ? observationStyles.inlineForm : observationStyles.form)}
        onSubmit={save}
      >
        <h3 {...stylex.props(observationStyles.formTitle)}>
          {isEditing ? 'Edit observation' : 'Add observation'}
        </h3>

        <label {...stylex.props(formStyles.field)}>
          <span {...stylex.props(formStyles.label)}>Observation</span>
          <Textarea
            {...stylex.props(formStyles.textarea)}
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            placeholder="Describe a general, non-medical teaching observation…"
            autoFocus
          />
        </label>

        <div {...stylex.props(observationStyles.formRow)}>
          <p {...stylex.props(typographyStyles.caption, typographyStyles.muted)}>
            Recorded automatically as {CURRENT_USER} · {formatDateTime(new Date().toISOString())}
          </p>
          <div {...stylex.props(observationStyles.formActions)}>
            <Button type="button" variant="ghost" size="sm" onClick={cancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {isEditing ? 'Save changes' : 'Save observation'}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <section
      {...stylex.props(observationStyles.section)}
      aria-labelledby="teacher-observations-title"
    >
      <SectionHeader
        titleId="teacher-observations-title"
        title="Teacher observations"
        description="General, non-medical teaching observations about this student."
        disclaimer="(This is not diagnostic information or a medical history.)"
        action={
          !isAdding ? (
            <Button type="button" size="sm" onClick={startAdd}>
              <Plus size={18} color={colors.text} />
              Add observation
            </Button>
          ) : undefined
        }
      />

      {isAdding && !editingId && renderEditor(false)}

      {observations.length === 0 ? (
        <p {...stylex.props(observationStyles.empty)}>
          No observations yet. Add a general teaching observation to start the timeline.
        </p>
      ) : (
        <ul {...stylex.props(observationStyles.list)}>
          {visibleObservations.map((item) => (
            <li key={item.id} {...stylex.props(observationStyles.item)}>
              <div {...stylex.props(observationStyles.itemMeta)}>
                <time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
                <span>Recorded by {item.createdBy}</span>
              </div>

              {editingId === item.id ? (
                renderEditor(true)
              ) : (
                <div {...stylex.props(observationStyles.itemGrid)}>
                  <p {...stylex.props(observationStyles.itemText)}>{item.observation}</p>
                  <div {...stylex.props(observationStyles.itemActions)}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="Edit observation"
                      title="Edit observation"
                      onClick={() => startEdit(item)}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label="Delete observation"
                          title="Delete observation"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </Button>
                      }
                      title="Delete observation?"
                      description="This observation will be removed from the student timeline."
                      confirmLabel="Delete"
                      confirmVariant="destructive"
                      onConfirm={() => remove(item.id)}
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {observationPageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={observationPage === 1}
                onClick={() => setObservationPage((page) => page - 1)}
              />
            </PaginationItem>
            {Array.from({ length: observationPageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === observationPage}
                    onClick={() => setObservationPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                disabled={observationPage === observationPageCount}
                onClick={() => setObservationPage((page) => page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
