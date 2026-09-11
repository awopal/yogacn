'use client';

import { create } from 'zustand';
import type { Level } from '@/lib/types';

export type ClassBuilderItem = {
  id: string;
  name: string;
};

export type ClassBuilderSection = {
  id: string;
  name: string;
  items: ClassBuilderItem[];
};

export type ClassBuilderDraft = {
  title: string;
  intention: string;
  level: Level;
  duration: number;
  peakPose: string;
  mode: 'live' | 'recorded' | 'hybrid';
  sections: ClassBuilderSection[];
};

type ClassBuilderState = {
  draft: ClassBuilderDraft;
  error: string;
  setField: <K extends keyof Omit<ClassBuilderDraft, 'sections'>>(
    key: K,
    value: ClassBuilderDraft[K],
  ) => void;
  setSections: (sections: ClassBuilderSection[]) => void;
  addSection: () => void;
  updateSection: (sectionId: string, name: string) => void;
  addItem: (sectionId: string) => void;
  updateItem: (sectionId: string, itemId: string, name: string) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  reorderItem: (sectionId: string, fromIndex: number, toIndex: number) => void;
  setError: (error: string) => void;
  reset: (draft?: Partial<ClassBuilderDraft>) => void;
};

const initialSections: ClassBuilderSection[] = [
  {
    id: 'arrival',
    name: 'Arrival & Warm-up',
    items: ['Seated breathing', 'Cat–Cow', 'Bird Dog'].map((name, index) => ({
      id: `arrival-${index}`,
      name,
    })),
  },
  {
    id: 'sun',
    name: 'Sun A — Core Progression',
    items: ['Round 1: Hold Plank', 'Round 2: Add 2 Low Planks', 'Round 3: Add Side Plank'].map(
      (name, index) => ({ id: `sun-${index}`, name }),
    ),
  },
  {
    id: 'peak',
    name: 'Balance & Peak Focus',
    items: ['High Lunge to Warrior III', 'Navasana', 'Core Compression'].map((name, index) => ({
      id: `peak-${index}`,
      name,
    })),
  },
  {
    id: 'cool-down',
    name: 'Cool Down',
    items: ['Supine Twist', 'Savasana'].map((name, index) => ({ id: `cool-down-${index}`, name })),
  },
];

const defaultDraft: ClassBuilderDraft = {
  title: 'Core & Control',
  intention: 'Steady from the center',
  level: 'intermediate',
  duration: 60,
  peakPose: 'Navasana',
  mode: 'live',
  sections: initialSections,
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useClassBuilderStore = create<ClassBuilderState>((set) => ({
  draft: defaultDraft,
  error: '',
  setField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value }, error: '' })),
  setSections: (sections) => set((state) => ({ draft: { ...state.draft, sections }, error: '' })),
  addSection: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        sections: [
          ...state.draft.sections,
          { id: makeId('section'), name: 'New section', items: [] },
        ],
      },
    })),
  updateSection: (sectionId, name) =>
    set((state) => ({
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) =>
          section.id === sectionId ? { ...section, name } : section,
        ),
      },
    })),
  addItem: (sectionId) =>
    set((state) => ({
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) =>
          section.id === sectionId
            ? { ...section, items: [...section.items, { id: makeId('item'), name: 'New pose' }] }
            : section,
        ),
      },
    })),
  updateItem: (sectionId, itemId, name) =>
    set((state) => ({
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item) => (item.id === itemId ? { ...item, name } : item)),
              }
            : section,
        ),
      },
    })),
  removeItem: (sectionId, itemId) =>
    set((state) => ({
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) =>
          section.id === sectionId
            ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
            : section,
        ),
      },
    })),
  reorderItem: (sectionId, fromIndex, toIndex) =>
    set((state) => ({
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) => {
          if (section.id !== sectionId || fromIndex === toIndex) return section;
          const items = [...section.items];
          const [moved] = items.splice(fromIndex, 1);
          if (!moved) return section;
          items.splice(toIndex, 0, moved);
          return { ...section, items };
        }),
      },
    })),
  setError: (error) => set({ error }),
  reset: (draft) =>
    set({
      draft: { ...defaultDraft, ...draft, sections: draft?.sections ?? initialSections },
      error: '',
    }),
}));
