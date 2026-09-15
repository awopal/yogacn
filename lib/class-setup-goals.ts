import type { ClassBuilderDraft, ClassBuilderSection } from '@/lib/stores/class-builder-store';

export type SetupGoalStatus = 'not-started' | 'in-progress' | 'completed';
export type SaveGoalState = 'ready' | 'saving' | 'saved' | 'error';

export type SetupGoalProgress = {
  status: SetupGoalStatus;
  percent: number;
  detail: string;
  accessibleValue: string;
};

const validName = (value: string, placeholders: string[]) => {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !placeholders.includes(normalized);
};

export function getClassBasicsProgress(
  draft: Pick<ClassBuilderDraft, 'title' | 'intention' | 'duration'>,
): SetupGoalProgress {
  const completedFields = [
    draft.title.trim().length >= 2,
    draft.intention.trim().length >= 2,
    Number.isInteger(draft.duration) && draft.duration >= 10 && draft.duration <= 240,
  ].filter(Boolean).length;

  return {
    status:
      completedFields === 0 ? 'not-started' : completedFields === 3 ? 'completed' : 'in-progress',
    percent: Math.round((completedFields / 3) * 100),
    detail: `${completedFields}/3 required fields`,
    accessibleValue: `${completedFields} of 3 required fields complete`,
  };
}

export function getFlowProgress(sections: ClassBuilderSection[]): SetupGoalProgress {
  const usableSections = sections.filter((section) =>
    validName(section.name, ['new section']),
  ).length;
  const usableItems = sections.reduce(
    (count, section) =>
      count + section.items.filter((item) => validName(item.name, ['new pose', 'new item'])).length,
    0,
  );
  const hasProgress = usableSections > 0 || usableItems > 0;
  const complete = usableSections > 0 && usableItems > 0;

  return {
    status: complete ? 'completed' : hasProgress ? 'in-progress' : 'not-started',
    percent: complete ? 100 : hasProgress ? 50 : 0,
    detail: `${usableSections} section${usableSections === 1 ? '' : 's'} · ${usableItems} pose${usableItems === 1 ? '' : 's'}`,
    accessibleValue: `${usableSections} usable sections and ${usableItems} usable poses`,
  };
}

export function getTimeProgress(
  duration: number,
  planned: number,
): SetupGoalProgress & { overBy: number; remaining: number } {
  const validDuration = Number.isInteger(duration) && duration >= 10 && duration <= 240;
  const safeDuration = validDuration ? duration : Math.max(duration, 0);
  const complete = validDuration && planned === duration;
  const hasProgress = planned > 0;
  const overBy = Math.max(planned - duration, 0);
  const remaining = Math.max(duration - planned, 0);

  return {
    status: complete ? 'completed' : hasProgress ? 'in-progress' : 'not-started',
    percent: safeDuration > 0 ? Math.min(100, Math.round((planned / safeDuration) * 100)) : 0,
    detail:
      overBy > 0
        ? `${planned}/${duration} min · ${overBy} min over`
        : `${planned}/${duration} min · ${remaining} min remaining`,
    accessibleValue: `${planned} of ${duration} minutes planned${overBy > 0 ? `, ${overBy} minutes over` : ''}`,
    overBy,
    remaining,
  };
}

export function getSaveProgress(saveState: SaveGoalState, setupReady = true): SetupGoalProgress {
  const completed = saveState === 'saved';
  const saving = saveState === 'saving';
  const failed = saveState === 'error';
  return {
    status: completed ? 'completed' : saving || failed ? 'in-progress' : 'not-started',
    percent: completed || (setupReady && saveState === 'ready') ? 100 : 0,
    detail: saving
      ? 'Saving…'
      : completed
        ? 'Saved'
        : failed
          ? 'Not saved'
          : setupReady
            ? 'Ready'
            : 'Not ready',
    accessibleValue: completed
      ? 'Saved successfully'
      : saving
        ? 'Saving'
        : failed
          ? 'Save failed; not saved'
          : setupReady
            ? 'Ready to save'
            : 'Not ready until the first three goals are complete',
  };
}
