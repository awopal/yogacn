'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClockAlert, GripVertical, PencilSparkles, PenLine, Route } from 'lucide-react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxInput,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import * as stylex from '@stylexjs/stylex';
import { pageStyles } from '@/styles/page.stylex';
import { formStyles } from '../../styles/form.stylex';
import { plannerStyles } from '../../styles/planner.stylex';
import { feedbackStyles } from '../../styles/feedback.stylex';
import { typographyStyles } from '../../styles/typography.stylex';
import {
  useClassBuilderStore,
  type ClassBuilderDraft,
  type ClassBuilderSection,
} from '@/lib/stores/class-builder-store';
import type { Level } from '@/lib/types';
import type { PlanStatus } from '@/lib/types';
import { statusLabel } from '@/lib/utils';
import { TrashIcon } from '@/components/icons';
import { colors } from '@/styles/tokens.stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import { classTemplates, cloneTemplate } from '@/lib/class-templates';
import { classPlanApi } from '@/lib/class-plan-api';
import { browserDraftStorage } from '@/lib/class-plan-draft';
import { useToast } from '@/components/ui/toast';
import { ClassSetupGoals } from '@/app/components/ClassSetupGoals';
import {
  getClassBasicsProgress,
  getFlowProgress,
  getTimeProgress,
  type SaveGoalState,
} from '@/lib/class-setup-goals';

const levels: Level[] = ['beginner', 'all_levels', 'intermediate', 'advanced'];

type SortablePlannerItemProps = {
  sectionId: string;
  item: { id: string; name: string };
  itemIndex: number;
  updateItem: (sectionId: string, itemId: string, name: string) => void;
  removeItem: (sectionId: string, itemId: string) => void;
};

function SortablePlannerItem({
  sectionId,
  item,
  itemIndex,
  updateItem,
  removeItem,
}: SortablePlannerItemProps) {
  const sortable = useSortable({
    id: `${sectionId}:${item.id}`,
    index: itemIndex,
    group: sectionId,
    type: 'planner-item',
    accept: 'planner-item',
    transition: {
      duration: 200,
      easing: 'cubic-bezier(.22, 1, .36, 1)',
      idle: true,
    },
  });

  return (
    <div
      ref={sortable.ref}
      {...stylex.props(plannerStyles.item, sortable.isDragging && plannerStyles.itemDragging)}
      data-sortable-id={`${sectionId}:${item.id}`}
    >
      <button
        ref={sortable.handleRef}
        type="button"
        {...stylex.props(plannerStyles.dragHandle)}
        aria-label={`Reorder ${item.name}`}
        data-drag-handle
      >
        <GripVertical size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <Input
        className={stylex.props(formStyles.control, plannerStyles.itemInput).className}
        value={item.name}
        onChange={(event) => updateItem(sectionId, item.id, event.target.value)}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => removeItem(sectionId, item.id)}
      >
        <TrashIcon size={18} color={colors.danger} />
      </Button>
    </div>
  );
}

export default function Planner({
  initialTitle = 'Core & Control',
  planId,
  loadStoredDraft = true,
  initialSections,
  storageKey = 'class-builder:new',
  initialDescription = '',
  initialIntention = 'Steady from the center',
  initialLevel = 'intermediate',
  initialDuration = 60,
  initialPeakPose = 'Navasana',
  initialStatus = 'draft',
}: {
  initialTitle?: string;
  planId?: string;
  loadStoredDraft?: boolean;
  initialSections?: ClassBuilderSection[];
  storageKey?: string;
  initialDescription?: string;
  initialIntention?: string;
  initialLevel?: Level;
  initialDuration?: number;
  initialPeakPose?: string;
  initialStatus?: PlanStatus;
}) {
  const draft = useClassBuilderStore((state) => state.draft);
  const error = useClassBuilderStore((state) => state.error);
  const setField = useClassBuilderStore((state) => state.setField);
  const addSection = useClassBuilderStore((state) => state.addSection);
  const removeSection = useClassBuilderStore((state) => state.removeSection);
  const updateSection = useClassBuilderStore((state) => state.updateSection);
  const updateSectionDuration = useClassBuilderStore((state) => state.updateSectionDuration);
  const addItem = useClassBuilderStore((state) => state.addItem);
  const updateItem = useClassBuilderStore((state) => state.updateItem);
  const removeItem = useClassBuilderStore((state) => state.removeItem);
  const reorderItem = useClassBuilderStore((state) => state.reorderItem);
  const setError = useClassBuilderStore((state) => state.setError);
  const reset = useClassBuilderStore((state) => state.reset);

  const router = useRouter();
  const toastManager = useToast();

  const [storageReady, setStorageReady] = useState(false);
  const [startMode, setStartMode] = useState<'manual' | 'template'>('manual');
  const [selectedTemplateId, setSelectedTemplateId] = useState(classTemplates[0]?.id ?? '');
  const [saveState, setSaveState] = useState<SaveGoalState>('ready');

  useEffect(() => {
    const initialDraft: Partial<ClassBuilderDraft> = {
      title: initialTitle,
      description: initialDescription,
      intention: initialIntention,
      level: initialLevel,
      duration: initialDuration,
      peakPose: initialPeakPose,
      ...(initialSections ? { sections: initialSections } : {}),
    };

    let savedDraft: Partial<ClassBuilderDraft> | undefined;
    savedDraft = loadStoredDraft ? browserDraftStorage.load(storageKey) : undefined;

    reset({ ...initialDraft, ...savedDraft });
    setStorageReady(true);
  }, [
    initialDescription,
    initialDuration,
    initialIntention,
    initialLevel,
    initialPeakPose,
    initialTitle,
    initialSections,
    loadStoredDraft,
    reset,
    storageKey,
  ]);

  useEffect(() => {
    if (!storageReady) return;
    browserDraftStorage.save(storageKey, draft);
  }, [draft, storageKey, storageReady]);

  const total = useMemo(
    () => draft.sections.reduce((sum, section) => sum + section.duration, 0),
    [draft.sections],
  );

  const setupGoalsComplete = [
    getClassBasicsProgress(draft),
    getFlowProgress(draft.sections),
    getTimeProgress(draft.duration, total),
  ].every((goal) => goal.status === 'completed');

  const requiredFieldsComplete =
    draft.title.trim().length >= 2 &&
    draft.intention.trim().length >= 2 &&
    Number.isInteger(draft.duration) &&
    draft.duration >= 10 &&
    draft.duration <= 240;

  const hasDraftContent = Boolean(
    draft.title.trim() ||
    draft.intention.trim() ||
    draft.description.trim() ||
    draft.sections.length,
  );

  function applySelectedTemplate() {
    const template = classTemplates.find((item) => item.id === selectedTemplateId);
    if (!template) return;

    reset(cloneTemplate(template));
  }

  function applyTemplateButton() {
    if (hasDraftContent) return;
    applySelectedTemplate();
  }

  function focusField(fieldId: string) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const control = field.querySelector<HTMLElement>('input, textarea') ?? field;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Defer this until after a possible confirmation dialog has restored focus.
    window.setTimeout(() => {
      field.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      window.setTimeout(() => control.focus({ preventScroll: true }), reduceMotion ? 0 : 250);
    }, 0);
  }

  async function save() {
    if (saveState === 'saving') return;

    const title = draft.title.trim();
    const intention = draft.intention.trim();
    const validDuration =
      Number.isInteger(draft.duration) && draft.duration >= 10 && draft.duration <= 240;

    if (title.length < 2 || intention.length < 2 || !validDuration) {
      const invalidFieldId =
        title.length < 2 ? 'class-basics' : intention.length < 2 ? 'intention' : 'duration';
      const message =
        title.length < 2
          ? 'Please enter a class name with at least 2 characters'
          : intention.length < 2
            ? 'Please enter an intention'
            : 'Duration must be between 10 and 240 minutes';
      setError('');
      focusField(invalidFieldId);

      toastManager.add({
        title: 'Please check the information before saving',
        description: message,
        type: 'warning',
      });

      return;
    }

    if (total > draft.duration) {
      const message = `Unable to save: content exceeds the allotted time by ${total - draft.duration} minutes`;
      setError(message);

      toastManager.add({
        title: 'Content exceeds the class time',
        description: message,
        type: 'warning',
      });

      return;
    }

    setSaveState('saving');

    try {
      await classPlanApi.save(draft, planId);
    } catch {
      const message = 'Unable to save the class plan. Please try again.';
      setSaveState('error');
      setError(message);

      return;
    }

    setSaveState('saved');

    router.push('/classes');
  }

  return (
    <>
      <ClassSetupGoals draft={draft} planned={total} saveState={saveState} />
      <Card className={cn(stylex.props(plannerStyles.planner).className)}>
        <div {...stylex.props(plannerStyles.grid)}>
          {!planId && (
            <fieldset
              {...stylex.props(
                formStyles.field,
                plannerStyles.halfField,
                plannerStyles.startFieldset,
              )}
            >
              <legend {...stylex.props(formStyles.label)}>Start with</legend>
              <p {...stylex.props(plannerStyles.startDescription)}>
                Create your class from scratch or start from a template.
              </p>

              <div {...stylex.props(plannerStyles.startOptions)}>
                <Button
                  type="button"
                  size="sm"
                  variant={startMode === 'manual' ? 'secondary' : 'ghost'}
                  aria-pressed={startMode === 'manual'}
                  onClick={() => setStartMode('manual')}
                >
                  Create yourself
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={startMode === 'template' ? 'secondary' : 'ghost'}
                  aria-pressed={startMode === 'template'}
                  onClick={() => setStartMode('template')}
                >
                  Use template
                </Button>
              </div>

              {startMode === 'template' && (
                <div {...stylex.props(plannerStyles.templateRow)}>
                  <Combobox
                    items={classTemplates.map((template) => template.name)}
                    value={
                      classTemplates.find((template) => template.id === selectedTemplateId)?.name
                    }
                    onValueChange={(value) => {
                      const template = classTemplates.find((item) => item.name === value);
                      if (template) setSelectedTemplateId(template.id);
                    }}
                  >
                    <ComboboxInput className={stylex.props(formStyles.control).className} />
                    <ComboboxContent>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {hasDraftContent ? (
                    <ConfirmDialog
                      trigger={
                        <Button type="button" size="md">
                          Use template
                        </Button>
                      }
                      title="Replace your current plan?"
                      description="Your current form changes will be replaced by the selected template."
                      confirmLabel="Replace plan"
                      confirmVariant="destructive"
                      onConfirm={applySelectedTemplate}
                    />
                  ) : (
                    <Button type="button" size="md" onClick={applyTemplateButton}>
                      Use template
                    </Button>
                  )}
                </div>
              )}
            </fieldset>
          )}

          <label
            id="class-basics"
            tabIndex={-1}
            {...stylex.props(formStyles.field, plannerStyles.halfField)}
          >
            <span {...stylex.props(formStyles.label)}>
              Class name{' '}
              <span {...stylex.props(formStyles.requiredMark)} aria-hidden="true">
                *
              </span>
            </span>
            <Input
              className={stylex.props(formStyles.control).className}
              value={draft.title}
              aria-required="true"
              onChange={(event) => setField('title', event.target.value)}
            />
          </label>

          <label id="intention" {...stylex.props(formStyles.field, plannerStyles.secondHalfField)}>
            <span {...stylex.props(formStyles.label)}>
              Intention{' '}
              <span {...stylex.props(formStyles.requiredMark)} aria-hidden="true">
                *
              </span>
            </span>
            <Input
              className={stylex.props(formStyles.control).className}
              value={draft.intention}
              aria-required="true"
              onChange={(event) => setField('intention', event.target.value)}
            />
          </label>

          <label {...stylex.props(formStyles.field)}>
            <span {...stylex.props(formStyles.label)}>Level</span>
            <Combobox
              items={levels}
              value={draft.level}
              onValueChange={(value) => {
                if (value) setField('level', value as Level);
              }}
            >
              <ComboboxInput className={stylex.props(formStyles.control).className} />
              <ComboboxContent>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </label>

          <label id="duration" {...stylex.props(formStyles.field)}>
            <span {...stylex.props(formStyles.label)}>
              Duration (minutes){' '}
              <span {...stylex.props(formStyles.requiredMark)} aria-hidden="true">
                *
              </span>
            </span>
            <Input
              className={stylex.props(formStyles.control).className}
              type="number"
              min={10}
              max={240}
              value={draft.duration}
              aria-required="true"
              onChange={(event) => setField('duration', Number(event.target.value))}
            />
          </label>

          <label {...stylex.props(formStyles.field, plannerStyles.halfField)}>
            <span {...stylex.props(formStyles.label)}>A little about this class</span>
            <Textarea
              className={stylex.props(formStyles.control, formStyles.textarea).className}
              value={draft.description}
              onChange={(event) => setField('description', event.target.value)}
              placeholder="What should students feel or focus on?"
              maxLength={140}
              showCount
            />
          </label>
        </div>

        <div {...stylex.props(plannerStyles.sectionEditorHeader)}>
          <h2 {...stylex.props(plannerStyles.sectionEditorTitle)}>Build your flow</h2>
          <p {...stylex.props(plannerStyles.sectionEditorDescription)}>
            Add sections and poses for your class.
          </p>
        </div>

        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;

            const source = event.operation.source;
            if (!isSortable(source)) return;

            const { initialIndex, index, initialGroup, group } = source;
            if (initialGroup === group && typeof group === 'string' && initialIndex !== index) {
              reorderItem(group, initialIndex, index);
            }
          }}
        >
          <div id="flow-editor" tabIndex={-1} {...stylex.props(plannerStyles.sectionList)}>
            {draft.sections.length === 0 ? (
              <Card className={stylex.props(plannerStyles.emptySections).className}>
                <div {...stylex.props(plannerStyles.emptyIcon)}>
                  <Route size={64} color={colors.primary} />
                </div>

                <p {...stylex.props(plannerStyles.emptySectionsTitle)}>Your flow is empty</p>
                <p {...stylex.props(plannerStyles.emptySectionsDescription)}>
                  Add a section to start building your class sequence.
                </p>

                <Button type="button" variant="secondary" size="md" onClick={addSection}>
                  ＋ Add your first section
                </Button>
              </Card>
            ) : (
              draft.sections.map((section, sectionIndex) => (
                <Fragment key={section.id}>
                  {sectionIndex > 0 && <hr {...stylex.props(plannerStyles.sectionDivider)} />}

                  <Card>
                    <div {...stylex.props(plannerStyles.sectionHeader)}>
                      <label {...stylex.props(plannerStyles.sectionNameField)}>
                        <span {...stylex.props(formStyles.label)}>
                          What should we call this part?
                        </span>
                        <Input
                          className={cn(stylex.props(formStyles.control).className)}
                          value={section.name}
                          onChange={(event) => updateSection(section.id, event.target.value)}
                        />
                      </label>

                      <label {...stylex.props(plannerStyles.durationField)}>
                        <span {...stylex.props(formStyles.label)}>How long?</span>
                        <Input
                          className={stylex.props(formStyles.control).className}
                          type="number"
                          min={0}
                          max={240}
                          value={section.duration}
                          onChange={(event) =>
                            updateSectionDuration(section.id, Number(event.target.value))
                          }
                        />
                      </label>

                      <ConfirmDialog
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${section.name} section`}
                            title="Delete section"
                          >
                            <TrashIcon size={18} color={colors.danger} />
                          </Button>
                        }
                        title="Delete this section?"
                        description={`Are you sure you want to delete “${section.name}” and all of its items in this section?`}
                        confirmLabel="Delete section"
                        confirmVariant="destructive"
                        onConfirm={() => removeSection(section.id)}
                      />
                    </div>

                    {section.items.map((item, itemIndex) => (
                      <SortablePlannerItem
                        key={item.id}
                        sectionId={section.id}
                        item={item}
                        itemIndex={itemIndex}
                        updateItem={updateItem}
                        removeItem={removeItem}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addItem(section.id)}
                    >
                      ＋ Add item
                    </Button>
                  </Card>
                </Fragment>
              ))
            )}
          </div>
        </DragDropProvider>

        <div {...stylex.props(layoutStyles.columnEnd)}>
          <p
            id="time-summary"
            tabIndex={-1}
            {...stylex.props(
              plannerStyles.timeSummary,
              total > draft.duration ? feedbackStyles.error : typographyStyles.muted,
            )}
            aria-live="polite"
          >
            Class time: {draft.duration} minutes · Planned: {total} minutes{' '}
            {total > draft.duration
              ? `— ${total - draft.duration} minutes over`
              : `— ${draft.duration - total} minutes remaining`}
            &nbsp;
            {total > draft.duration && <ClockAlert size={20} aria-hidden="true" />}
          </p>

          {total > draft.duration && (
            <div {...stylex.props(pageStyles.actions)}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setField('duration', total)}
              >
                <PenLine size={16} aria-hidden="true" />
                Or adjust class time to {total} minutes
              </Button>
            </div>
          )}
          <span {...stylex.props(plannerStyles.classStatus)}>
            Class status:
            <Badge variant={initialStatus}>{statusLabel[initialStatus]}</Badge>
          </span>
        </div>

        <div
          {...stylex.props(
            pageStyles.actions,
            draft.sections.length > 0 ? layoutStyles.rowBetween : layoutStyles.rowEnd,
          )}
        >
          {draft.sections.length > 0 && (
            <div {...stylex.props(plannerStyles.actionStatusGroup)}>
              <Button type="button" variant="ghost" noPadding onClick={addSection}>
                ＋ Add more section
              </Button>
            </div>
          )}

          <div {...stylex.props(plannerStyles.saveActionGroup)}>
            {!planId && !setupGoalsComplete && requiredFieldsComplete ? (
              <ConfirmDialog
                trigger={
                  <Button
                    id="save-plan"
                    type="button"
                    disabled={saveState === 'saving'}
                    aria-label="Save draft"
                  >
                    <PencilSparkles size={20} />
                    {saveState === 'saving' ? 'Saving…' : 'Save draft'}
                  </Button>
                }
                title="Save this class as a draft?"
                description="Some setup goals are not complete yet. You can save this class as a draft and continue editing it later."
                confirmLabel="Save draft"
                onConfirm={save}
              />
            ) : (
              <Button id="save-plan" type="button" onClick={save} disabled={saveState === 'saving'}>
                <PencilSparkles size={20} />
                {saveState === 'saving'
                  ? 'Saving…'
                  : !planId && !setupGoalsComplete
                    ? 'Save draft'
                    : 'Save plan'}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <p
            {...stylex.props(
              error.includes('saved') ? feedbackStyles.success : feedbackStyles.error,
            )}
            role="status"
          >
            {error}
          </p>
        )}
      </Card>
    </>
  );
}
