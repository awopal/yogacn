'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CalendarPlus, ImagePlus, Plus, Save } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';
import {
  workshopStatusLabel,
  workshopStatusVariant,
  type Workshop,
  type WorkshopStatus,
} from '@/lib/workshops';
import type { Level } from '@/lib/types';
import { levelLabel } from '@/lib/utils';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { formStyles } from '@/styles/form.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { workshopStyles } from '@/styles/workshop.stylex';

const levels: Level[] = ['beginner', 'all_levels', 'intermediate', 'advanced'];
const statuses: WorkshopStatus[] = ['draft', 'published', 'sold_out', 'closed'];

type WorkshopFormState = Omit<Workshop, 'id' | 'sessions'> & {
  start: string;
  end: string;
};

const fromWorkshop = (workshop?: Workshop): WorkshopFormState => ({
  title: workshop?.title ?? '',
  description: workshop?.description ?? '',
  category: workshop?.category ?? '',
  level: workshop?.level ?? 'all_levels',
  instructor: workshop?.instructor ?? '',
  facility: workshop?.facility ?? '',
  language: workshop?.language ?? '',
  coverImageUrl: workshop?.coverImageUrl ?? '',
  price: workshop?.price ?? 0,
  currency: workshop?.currency ?? 'THB',
  capacity: workshop?.capacity ?? 20,
  booked: workshop?.booked ?? 0,
  status: workshop?.status ?? 'draft',
  equipment: workshop?.equipment ?? '',
  cancellationPolicy: workshop?.cancellationPolicy ?? '',
  start: workshop?.sessions[0]?.start ?? '',
  end: workshop?.sessions[0]?.end ?? '',
});

export function WorkshopForm({ workshop }: { workshop?: Workshop }) {
  const [form, setForm] = useState(() => fromWorkshop(workshop));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof WorkshopFormState>(key: K, value: WorkshopFormState[K]) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  };
  const isEditing = Boolean(workshop);

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.instructor.trim() ||
      !form.facility.trim()
    ) {
      setError('Please complete the workshop title, category, instructor, and facility.');
      return;
    }
    if (!form.start || !form.end || new Date(form.end) <= new Date(form.start)) {
      setError('Please provide a valid session start and end time.');
      return;
    }
    if (form.capacity < 1 || form.price < 0) {
      setError('Capacity must be at least 1 and price cannot be negative.');
      return;
    }
    setError('');
    setSaved(true);
  }

  return (
    <form onSubmit={save} {...stylex.props(pageStyles.fullHeight)}>
      {error && (
        <p role="alert" {...stylex.props(workshopStyles.error)}>
          {error}
        </p>
      )}
      {saved && (
        <p role="status" {...stylex.props(dashboardStyles.classStatusEmpty)}>
          Workshop saved as a mock draft. Connect the workshop API when the backend is ready.
        </p>
      )}
      <div {...stylex.props(workshopStyles.formLayout)}>
        <div {...stylex.props(workshopStyles.formCard)}>
          <section {...stylex.props(workshopStyles.formSection)}>
            <h2 {...stylex.props(workshopStyles.formSectionTitle)}>Workshop details</h2>
            <div {...stylex.props(workshopStyles.fieldGrid)}>
              <label {...stylex.props(workshopStyles.field, workshopStyles.full)}>
                <span {...stylex.props(workshopStyles.label)}>Workshop title *</span>
                <Input
                  value={form.title}
                  onChange={(event) => update('title', event.target.value)}
                  placeholder="e.g. KYOTO - Sound Bath"
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Category *</span>
                <Input
                  value={form.category}
                  onChange={(event) => update('category', event.target.value)}
                  placeholder="Sound Bath"
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Level</span>
                <select
                  value={form.level}
                  onChange={(event) => update('level', event.target.value as Level)}
                  className={stylex.props(formStyles.control).className}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {levelLabel[level]}
                    </option>
                  ))}
                </select>
              </label>
              <label {...stylex.props(workshopStyles.field, workshopStyles.full)}>
                <span {...stylex.props(workshopStyles.label)}>Short description *</span>
                <Textarea
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  placeholder="Describe the experience and what participants can expect."
                  rows={5}
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field, workshopStyles.full)}>
                <span {...stylex.props(workshopStyles.label)}>Cover image URL</span>
                <Input
                  value={form.coverImageUrl}
                  onChange={(event) => update('coverImageUrl', event.target.value)}
                  placeholder="Image uploader is not available yet — paste an image URL"
                />
                <p {...stylex.props(workshopStyles.helper)}>
                  <ImagePlus size={14} aria-hidden="true" /> Image uploader component is a future
                  addition.
                </p>
              </label>
            </div>
          </section>

          <section {...stylex.props(workshopStyles.formSection)}>
            <h2 {...stylex.props(workshopStyles.formSectionTitle)}>Schedule & place</h2>
            <div {...stylex.props(workshopStyles.fieldGrid)}>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Instructor *</span>
                <Input
                  value={form.instructor}
                  onChange={(event) => update('instructor', event.target.value)}
                  placeholder="Miri Ogawa"
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Language</span>
                <Input
                  value={form.language}
                  onChange={(event) => update('language', event.target.value)}
                  placeholder="English / Japanese"
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Facility *</span>
                <Input
                  value={form.facility}
                  onChange={(event) => update('facility', event.target.value)}
                  placeholder="Kyoto Studio"
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Start *</span>
                <Input
                  type="datetime-local"
                  value={form.start}
                  onChange={(event) => update('start', event.target.value)}
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>End *</span>
                <Input
                  type="datetime-local"
                  value={form.end}
                  onChange={(event) => update('end', event.target.value)}
                  required
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Schedule repeats</span>
                <Input placeholder="Weekly schedule component not connected yet" disabled />
              </label>
            </div>
            <Button type="button" variant="secondary" size="sm">
              <CalendarPlus size={16} aria-hidden="true" /> Add another session
            </Button>
          </section>

          <section {...stylex.props(workshopStyles.formSection, workshopStyles.formSectionLast)}>
            <h2 {...stylex.props(workshopStyles.formSectionTitle)}>Booking details</h2>
            <div {...stylex.props(workshopStyles.fieldGrid)}>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Price</span>
                <Input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => update('price', Number(event.target.value))}
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Currency</span>
                <Input
                  value={form.currency}
                  onChange={(event) => update('currency', event.target.value.toUpperCase())}
                  placeholder="THB"
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Capacity</span>
                <Input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) => update('capacity', Number(event.target.value))}
                />
              </label>
              <label {...stylex.props(workshopStyles.field)}>
                <span {...stylex.props(workshopStyles.label)}>Status</span>
                <select
                  value={form.status}
                  onChange={(event) => update('status', event.target.value as WorkshopStatus)}
                  className={stylex.props(formStyles.control).className}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {workshopStatusLabel[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label {...stylex.props(workshopStyles.field, workshopStyles.full)}>
                <span {...stylex.props(workshopStyles.label)}>Equipment / preparation</span>
                <Textarea
                  value={form.equipment}
                  onChange={(event) => update('equipment', event.target.value)}
                  rows={3}
                  placeholder="What should participants bring?"
                />
              </label>
              <label {...stylex.props(workshopStyles.field, workshopStyles.full)}>
                <span {...stylex.props(workshopStyles.label)}>Cancellation policy</span>
                <Textarea
                  value={form.cancellationPolicy}
                  onChange={(event) => update('cancellationPolicy', event.target.value)}
                  rows={3}
                />
              </label>
            </div>
          </section>
        </div>

        <aside {...stylex.props(workshopStyles.formCard)}>
          <p {...stylex.props(pageStyles.eyebrow)}>Preview status</p>
          <div {...stylex.props(workshopStyles.summary)}>
            <div {...stylex.props(workshopStyles.summaryRow)}>
              <span {...stylex.props(workshopStyles.summaryLabel)}>Mode</span>
              <Badge variant={workshopStatusVariant[form.status]}>
                {workshopStatusLabel[form.status]}
              </Badge>
            </div>
            <div {...stylex.props(workshopStyles.summaryRow)}>
              <span {...stylex.props(workshopStyles.summaryLabel)}>Booked</span>
              <span {...stylex.props(workshopStyles.summaryValue)}>
                {form.booked} / {form.capacity}
              </span>
            </div>
            <div {...stylex.props(workshopStyles.summaryRow)}>
              <span {...stylex.props(workshopStyles.summaryLabel)}>Price</span>
              <span {...stylex.props(workshopStyles.summaryValue)}>
                {form.currency} {form.price.toLocaleString()}
              </span>
            </div>
            <div {...stylex.props(workshopStyles.summaryRow)}>
              <span {...stylex.props(workshopStyles.summaryLabel)}>Session</span>
              <span {...stylex.props(workshopStyles.summaryValue)}>
                {form.start ? new Date(form.start).toLocaleString() : 'Not set'}
              </span>
            </div>
          </div>
          <div {...stylex.props(workshopStyles.actions)}>
            <Button asChild type="button" variant="ghost">
              <Link href={INSTRUCTOR_ROUTES.WORKSHOPS.ROOT}>
                <ArrowLeft size={16} /> Cancel
              </Link>
            </Button>
            <Button type="submit">
              <Save size={16} /> {isEditing ? 'Save changes' : 'Create workshop'}
            </Button>
          </div>
          <p {...stylex.props(workshopStyles.helper)}>
            <Plus size={14} aria-hidden="true" /> Sessions, image upload, and registration rules are
            currently mock UI components.
          </p>
        </aside>
      </div>
    </form>
  );
}
