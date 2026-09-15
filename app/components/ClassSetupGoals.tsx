'use client';

import { BookOpen, Check, ListTree, Save, Timer } from 'lucide-react';
import type { ClassBuilderDraft } from '@/lib/stores/class-builder-store';
import {
  getClassBasicsProgress,
  getFlowProgress,
  getSaveProgress,
  getTimeProgress,
  type SaveGoalState,
  type SetupGoalProgress,
} from '@/lib/class-setup-goals';
import * as stylex from '@stylexjs/stylex';
import { plannerStyles } from '@/styles/planner.stylex';

type Goal = {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  progress: SetupGoalProgress;
  targetId: string;
};

export function ClassSetupGoals({
  draft,
  planned,
  saveState,
}: {
  draft: ClassBuilderDraft;
  planned: number;
  saveState: SaveGoalState;
}) {
  const basicsProgress = getClassBasicsProgress(draft);
  const flowProgress = getFlowProgress(draft.sections);
  const timeProgress = getTimeProgress(draft.duration, planned);
  const setupReady = [basicsProgress, flowProgress, timeProgress].every(
    (goal) => goal.status === 'completed',
  );
  const goals: Goal[] = [
    {
      id: 'basics',
      title: 'Class basics',
      description: 'Give your class a name and direction.',
      icon: BookOpen,
      progress: basicsProgress,
      targetId: 'class-basics',
    },
    {
      id: 'flow',
      title: 'Build your flow',
      description: 'Add sections and poses for your class.',
      icon: ListTree,
      progress: flowProgress,
      targetId: 'flow-editor',
    },
    {
      id: 'time',
      title: 'Balance your time',
      description: 'Match your flow to the class duration.',
      icon: Timer,
      progress: timeProgress,
      targetId: 'time-summary',
    },
    {
      id: 'save',
      title: 'Save your plan',
      description: setupReady
        ? 'Save your class plan for later.'
        : 'Not ready yet, but you can save a draft.',
      icon: Save,
      progress: getSaveProgress(saveState, setupReady),
      targetId: 'save-plan',
    },
  ];
  const completedCount = goals.filter((goal) => goal.progress.status === 'completed').length;

  function focusGoal(targetId: string) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 0 : 250);
  }

  return (
    <section
      aria-labelledby="class-setup-goals-title"
      {...stylex.props(plannerStyles.goalsSection)}
    >
      <div {...stylex.props(plannerStyles.goalsHeader)}>
        <div>
          <h2 id="class-setup-goals-title" {...stylex.props(plannerStyles.goalsTitle)}>
            Class setup goals
          </h2>
          <p {...stylex.props(plannerStyles.goalsSummary)} aria-live="polite">
            {completedCount} of 4 goals completed
          </p>
        </div>
      </div>
      <div {...stylex.props(plannerStyles.goalsGrid)}>
        {goals.map((goal) => {
          const Icon = goal.icon;
          const completed = goal.progress.status === 'completed';
          const ready = goal.id === 'save' && goal.progress.detail === 'Ready';
          const statusLabel =
            goal.progress.detail === 'Not ready'
              ? 'Not ready'
              : ready
                ? 'Ready'
                : completed
                  ? 'Completed'
                  : goal.progress.status === 'in-progress'
                    ? 'In progress'
                    : 'Not started';

          return (
            <button
              key={goal.id}
              type="button"
              {...stylex.props(
                plannerStyles.goalCard,
                completed && plannerStyles.goalCardCompleted,
                ready && plannerStyles.goalCardReady,
              )}
              onClick={() => focusGoal(goal.targetId)}
              aria-label={`${goal.title}. ${statusLabel}. ${goal.progress.accessibleValue}. Jump to related section.`}
            >
              <span
                {...stylex.props(
                  plannerStyles.goalIcon,
                  completed && plannerStyles.goalIconCompleted,
                  ready && plannerStyles.goalIconReady,
                )}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <span {...stylex.props(plannerStyles.goalCopy)}>
                <span {...stylex.props(plannerStyles.goalTitleRow)}>
                  <span {...stylex.props(plannerStyles.goalTitle)}>{goal.title}</span>
                  {(completed || ready) && (
                    <span
                      {...stylex.props(plannerStyles.goalCheck)}
                      aria-label={completed ? 'Completed' : 'Ready to save'}
                    >
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span {...stylex.props(plannerStyles.goalDescription)}>{goal.description}</span>
                <span {...stylex.props(plannerStyles.goalProgressText)}>
                  {goal.progress.detail}
                </span>
                <span
                  role="progressbar"
                  aria-label={`${goal.title} progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={goal.progress.percent}
                  {...stylex.props(plannerStyles.goalProgressTrack)}
                >
                  <span
                    {...stylex.props(
                      plannerStyles.goalProgressBar,
                      completed && plannerStyles.goalProgressBarCompleted,
                      ready && plannerStyles.goalProgressBarReady,
                    )}
                    style={{ width: `${goal.progress.percent}%` }}
                  />
                </span>
                <span
                  {...stylex.props(
                    plannerStyles.goalStatus,
                    completed && plannerStyles.goalStatusCompleted,
                    ready && plannerStyles.goalStatusReady,
                  )}
                >
                  {saveState === 'saving' && goal.id === 'save' ? 'Saving' : statusLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
