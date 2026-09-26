'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';
import {
  workshopStatusLabel,
  workshopStatusVariant,
  type Workshop,
  type WorkshopStatus,
} from '@/lib/workshops';
import { levelLabel } from '@/lib/utils';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { workshopStyles } from '@/styles/workshop.stylex';

const statusFilters: Array<WorkshopStatus | 'all'> = [
  'all',
  'published',
  'draft',
  'sold_out',
  'closed',
];

export default function WorkshopLibrary({ workshops }: { workshops: Workshop[] }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<WorkshopStatus | 'all'>('all');
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return workshops.filter((workshop) => {
      const matchesSearch =
        !query ||
        [workshop.title, workshop.category, workshop.instructor, workshop.facility].some((value) =>
          value.toLowerCase().includes(query),
        );
      return matchesSearch && (status === 'all' || workshop.status === status);
    });
  }, [search, status, workshops]);

  return (
    <section aria-label="Workshops" {...stylex.props(dashboardStyles.classLibrarySection)}>
      <div {...stylex.props(workshopStyles.toolbar)}>
        <div {...stylex.props(workshopStyles.search)}>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search workshops…"
            aria-label="Search workshops"
          />
        </div>
        <div {...stylex.props(workshopStyles.filters)}>
          <SlidersHorizontal size={17} color="currentColor" aria-hidden="true" />
          <span {...stylex.props(workshopStyles.filterLabel)}>Status</span>
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              type="button"
              size="sm"
              variant={status === filter ? 'default' : 'secondary'}
              onClick={() => setStatus(filter)}
            >
              {filter === 'all' ? 'All' : workshopStatusLabel[filter]}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <ul {...stylex.props(workshopStyles.list)}>
          {filtered.map((workshop) => {
            const nextSession = workshop.sessions[0];
            const slots = workshop.capacity - workshop.booked;
            return (
              <li key={workshop.id}>
                <Link
                  href={INSTRUCTOR_ROUTES.WORKSHOPS.EDIT(workshop.id)}
                  {...stylex.props(workshopStyles.row)}
                >
                  <div {...stylex.props(workshopStyles.rowCopy)}>
                    <span {...stylex.props(workshopStyles.title)}>{workshop.title}</span>
                    <span {...stylex.props(workshopStyles.description)}>
                      {workshop.description}
                    </span>
                    <span {...stylex.props(workshopStyles.meta)}>
                      <span {...stylex.props(workshopStyles.metaStrong)}>{workshop.category}</span>
                      <span>{workshop.instructor}</span>
                      <span>{workshop.facility}</span>
                      <span>{levelLabel[workshop.level]}</span>
                      {nextSession && (
                        <span>
                          {new Date(nextSession.start).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <span>{slots > 0 ? `${slots} slots left` : 'No slots left'}</span>
                    </span>
                  </div>
                  <Badge variant={workshopStatusVariant[workshop.status]}>
                    {workshopStatusLabel[workshop.status]}
                  </Badge>
                  <span {...stylex.props(workshopStyles.action)} aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p {...stylex.props(dashboardStyles.classStatusEmpty)}>No workshops match your filters.</p>
      )}
    </section>
  );
}
