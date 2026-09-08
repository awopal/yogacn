import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Level, PlanStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const levelLabel: Record<Level, string> = {
  beginner: 'Beginner',
  all_levels: 'All levels',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const statusLabel: Record<PlanStatus, string> = {
  draft: 'Draft',
  ready: 'Ready',
  taught: 'Taught',
};
