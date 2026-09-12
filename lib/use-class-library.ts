'use client';

import { useEffect, useState } from 'react';
import {
  classPlanApi,
  type ClassPlanCounts,
  type ClassPlanFilter,
  type ClassPlanReader,
} from '@/lib/class-plan-api';
import type { ClassPlan } from '@/lib/types';

export const CLASS_LIBRARY_PAGE_SIZE = 7;
const SEARCH_DEBOUNCE_MS = 500;

type UseClassLibraryOptions = {
  initialPlans: ClassPlan[];
  initialTotal: number;
  initialCounts: ClassPlanCounts;
  api?: ClassPlanReader;
};

export function useClassLibrary({
  initialPlans,
  initialTotal,
  initialCounts,
  api = classPlanApi,
}: UseClassLibraryOptions) {
  const [activeFilter, setActiveFilter] = useState<ClassPlanFilter>('all');
  const [plans, setPlans] = useState(initialPlans);
  const [counts, setCounts] = useState(initialCounts);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(initialTotal / CLASS_LIBRARY_PAGE_SIZE)),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    api
      .list(
        {
          page,
          pageSize: CLASS_LIBRARY_PAGE_SIZE,
          ...(activeFilter !== 'all' ? { status: activeFilter } : {}),
          ...(searchQuery ? { search: searchQuery } : {}),
        },
        controller.signal,
      )
      .then((result) => {
        setPlans(result.items);
        setCounts(result.counts);
        setTotalPages(result.totalPages);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError('Unable to load class plans. Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeFilter, api, page, searchQuery]);

  return {
    activeFilter,
    setActiveFilter: (filter: ClassPlanFilter) => {
      setActiveFilter(filter);
      setPage(1);
    },
    plans,
    counts,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    loading,
    error,
  };
}
