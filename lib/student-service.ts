import type { Student } from './types';

const STORAGE_KEY = 'yogacn:students';

export const studentService = {
  load(fallback: Student[]): Student[] {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Student[]) : fallback;
    } catch {
      return fallback;
    }
  },
  save(students: Student[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  },
};
