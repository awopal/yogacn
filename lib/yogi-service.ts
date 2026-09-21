import type { Yogi } from './types';

const STORAGE_KEY = 'yogacn:yogis';
const LEGACY_STORAGE_KEY = 'yogacn:students';

export type YogiRepository = {
  load(fallback: Yogi[]): Yogi[];
  save(yogis: Yogi[]): void;
};

export function createLocalStorageYogiRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined = typeof window === 'undefined'
    ? undefined
    : window.localStorage,
): YogiRepository {
  return {
    load(fallback: Yogi[]): Yogi[] {
      if (!storage) return fallback;
      try {
        const stored = storage.getItem(STORAGE_KEY) ?? storage.getItem(LEGACY_STORAGE_KEY);
        return stored ? (JSON.parse(stored) as Yogi[]) : fallback;
      } catch {
        return fallback;
      }
    },
    save(yogis: Yogi[]) {
      storage?.setItem(STORAGE_KEY, JSON.stringify(yogis));
    },
  };
}

export const yogiService = createLocalStorageYogiRepository();
