'use client';

import Link from 'next/link';
import { useClassLibrary } from '@/lib/use-class-library';
import * as stylex from '@stylexjs/stylex';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger, TabStyles } from '@/components/ui/tabs';
import type { ClassPlan } from '@/lib/types';
import type { ClassPlanCounts, ClassPlanFilter } from '@/lib/class-plan-api';
import { levelLabel, statusLabel } from '@/lib/utils';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { LibraryBig, Loader, X } from 'lucide-react';
import { ArrowRightIcon } from '@/components/icons';
import { layoutStyles } from '@/styles/layout.stylex';

const filters: ClassPlanFilter[] = ['all', 'ready', 'draft', 'taught'];

export default function ClassLibrary({
  initialPlans,
  initialTotal,
  initialCounts,
}: {
  initialPlans: ClassPlan[];
  initialTotal: number;
  initialCounts: ClassPlanCounts;
}) {
  const library = useClassLibrary({ initialPlans, initialTotal, initialCounts });
  const {
    activeFilter,
    setActiveFilter,
    plans,
    counts,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    loading,
    error,
  } = library;

  return (
    <section
      aria-label="Class plans"
      aria-busy={loading}
      {...stylex.props(dashboardStyles.classLibrarySection)}
    >
      <div {...stylex.props(dashboardStyles.classLibraryToolbar)}>
        <Tabs
          defaultValue="all"
          onValueChange={(value) => {
            setActiveFilter(value as ClassPlanFilter);
          }}
          aria-label="Class status"
        >
          <TabsList>
            {filters.map((filter) => {
              const label = filter === 'all' ? 'All' : statusLabel[filter];

              return (
                <TabsTrigger
                  key={filter}
                  value={filter}
                  className={
                    stylex.props(activeFilter === filter ? TabStyles.active : null).className
                  }
                >
                  {label}{' '}
                  {loading && activeFilter === filter ? (
                    <span {...stylex.props(TabStyles.badge)} aria-label="Loading count">
                      <Loader className="tab-loading-icon" size={14} aria-hidden="true" />
                    </span>
                  ) : (
                    <span {...stylex.props(TabStyles.badge)}>{counts[filter]}</span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div {...stylex.props(dashboardStyles.classSearch)}>
          <Input
            type="text"
            role="searchbox"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search classes…"
            aria-label="Search classes"
            className={stylex.props(dashboardStyles.classSearchInput).className}
          />

          {search && (
            <button
              type="button"
              aria-label="Clear class search"
              onClick={() => setSearch('')}
              {...stylex.props(dashboardStyles.classSearchClear)}
            >
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {error ? (
        <p {...stylex.props(dashboardStyles.classStatusEmpty)} role="alert">
          {error}
        </p>
      ) : loading ? (
        <ul
          {...stylex.props(dashboardStyles.fullPlanList, dashboardStyles.classPlanList)}
          aria-label="Loading class plans"
        >
          <li {...stylex.props(dashboardStyles.fullPlanRow)}>
            <div className="class-skeleton-copy">
              <Skeleton className="class-skeleton-title" />
              <Skeleton className="class-skeleton-meta" />
            </div>
            <Skeleton className="class-skeleton-badge" />
            <Skeleton className="class-skeleton-action" />
          </li>
        </ul>
      ) : plans.length > 0 ? (
        <ul {...stylex.props(dashboardStyles.fullPlanList, dashboardStyles.classPlanList)}>
          {plans.map((plan) => (
            <li key={plan.id}>
              <Link
                href={`/classes/${plan.id}/edit`}
                {...stylex.props(dashboardStyles.fullPlanRow)}
              >
                <div {...stylex.props(dashboardStyles.previewCopy)}>
                  <strong>{plan.title}</strong>
                  <span {...stylex.props(layoutStyles.row)}>
                    <span>{plan.plannedDurationMinutes} min ·</span>
                    <span>{levelLabel[plan.level]}</span>
                    {plan.taughtCount > 0 && <span> · taught {plan.taughtCount} times</span>}
                  </span>
                </div>

                <Badge variant={plan.status}>{statusLabel[plan.status]}</Badge>

                <span
                  aria-hidden="true"
                  {...stylex.props(dashboardStyles.viewAllLink, dashboardStyles.openPlanLink)}
                >
                  <ArrowRightIcon size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <section
          aria-label="Empty class plans"
          {...stylex.props(dashboardStyles.classEmptySection)}
        >
          <LibraryBig
            {...stylex.props(dashboardStyles.classEmptyIcon)}
            size={84}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <div>
            <p {...stylex.props(dashboardStyles.classEmptyTitle)}>No class plans in this status.</p>
            <p {...stylex.props(dashboardStyles.classEmptyDescription)}>
              Try another status or create a new class plan to get started.
            </p>
          </div>
        </section>
      )}

      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={loading || page === 1}
                onClick={() => setPage((value) => value - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  disabled={loading}
                  isActive={pageNumber === page}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                disabled={loading || page === totalPages}
                onClick={() => setPage((value) => value + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </section>
  );
}
