import type { ClassBuilderDraft } from '@/lib/stores/class-builder-store';
import type { ClassPlan, PlanStatus } from '@/lib/types';
import { httpClientWithToast } from '@/lib/http/client';

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

export const classPlanApi: ClassPlanApi = {
  async list(query, signal) {
    return httpClientWithToast.request<ClassPlanPage>(`/api/classes?${queryString(query)}`, {
      signal,
      errorToast: { title: 'Failed to load class plans' },
    });
  },

  async save(draft, planId) {
    await httpClientWithToast.request(planId ? `/api/classes/${planId}` : '/api/classes', {
      method: planId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
      successToast: {
        title: planId ? 'Plan updated successfully' : 'Plan saved successfully',
        description: planId
          ? 'The class plan was updated successfully'
          : 'The class plan was created successfully',
      },
      errorToast: { title: 'Failed to save the class plan' },
    });
  },
};
