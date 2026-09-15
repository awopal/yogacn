import type { Student } from './types';

const STORAGE_KEY = 'yogacn:students';

export type StudentRepository = {
  load(fallback: Student[]): Student[];
  save(students: Student[]): void;
};

export function createLocalStorageStudentRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined = typeof window === 'undefined'
    ? undefined
    : window.localStorage,
): StudentRepository {
  return {
    load(fallback: Student[]): Student[] {
      if (!storage) return fallback;
      try {
        const stored = storage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as Student[]) : fallback;
      } catch {
        return fallback;
      }
    },
    save(students: Student[]) {
      storage?.setItem(STORAGE_KEY, JSON.stringify(students));
    },
  };
}

export const studentService = createLocalStorageStudentRepository();
