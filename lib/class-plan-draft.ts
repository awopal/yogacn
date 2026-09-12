import type { ClassBuilderDraft } from '@/lib/stores/class-builder-store';

export interface DraftStorage {
  load(key: string): Partial<ClassBuilderDraft> | undefined;
  save(key: string, draft: ClassBuilderDraft): void;
  remove(key: string): void;
}

export const browserDraftStorage: DraftStorage = {
  load(key) {
    if (typeof window === 'undefined') return undefined;
    const value = window.localStorage.getItem(key);
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value) as Partial<ClassBuilderDraft>;
      return {
        ...parsed,
        sections: Array.isArray(parsed.sections)
          ? parsed.sections.map((section) => ({
              ...section,
              duration:
                typeof section.duration === 'number' ? section.duration : section.items.length * 5,
            }))
          : undefined,
      };
    } catch {
      window.localStorage.removeItem(key);
      return undefined;
    }
  },

  save(key, draft) {
    window.localStorage.setItem(key, JSON.stringify(draft));
  },

  remove(key) {
    window.localStorage.removeItem(key);
  },
};
