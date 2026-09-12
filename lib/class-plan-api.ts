import type { ClassBuilderDraft } from '@/lib/stores/class-builder-store';
import type { ClassPlan, PlanStatus } from '@/lib/types';

export type ClassPlanFilter = 'all' | PlanStatus;
export type ClassPlanCounts = Record<ClassPlanFilter, number>;

export type ClassPlanQuery = {
  page: number;
  pageSize: number;
  status?: Exclude<ClassPlanFilter, 'all'>;
  search?: string;
};

export type ClassPlanPage = {
  items: ClassPlan[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  counts: ClassPlanCounts;
};

export interface ClassPlanReader {
  list(query: ClassPlanQuery, signal?: AbortSignal): Promise<ClassPlanPage>;
}

export interface ClassPlanWriter {
  save(draft: ClassBuilderDraft, planId?: string): Promise<void>;
}

export type ClassPlanApi = ClassPlanReader & ClassPlanWriter;

const queryString = (query: ClassPlanQuery) => {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.status) params.set('status', query.status);
  if (query.search) params.set('search', query.search);
  return params.toString();
};

const assertOk = (response: Response, message: string) => {
  if (!response.ok) throw new Error(message);
};

export const classPlanApi: ClassPlanApi = {
  async list(query, signal) {
    const response = await fetch(`/api/classes?${queryString(query)}`, { signal });
    assertOk(response, 'Unable to load class plans');
    return response.json() as Promise<ClassPlanPage>;
  },

  async save(draft, planId) {
    const response = await fetch(planId ? `/api/classes/${planId}` : '/api/classes', {
      method: planId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    assertOk(response, 'Unable to save class plan');
  },
};
