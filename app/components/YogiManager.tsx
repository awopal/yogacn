'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Yogi } from '../../lib/types';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { SectionHeader } from '@/components/ui/section-header';
import { useToast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cardStyles } from '@/components/ui/card';
import { pageStyles } from '../../styles/page.stylex';
import { dashboardStyles } from '../../styles/dashboard.stylex';
import { formStyles } from '../../styles/form.stylex';
import { yogiStyles } from '../../styles/yogi.stylex';
import { yogisStyles } from '../../styles/yogis.stylex';
import { yogiService, type YogiRepository } from '../../lib/yogi-service';
import { ArrowRightIcon, UserCircleCheckIcon } from '@/components/icons';
import { UserShield, X } from 'lucide-react';
import { colors } from '@/styles/tokens.stylex';
import { INSTRUCTOR_ROUTES } from '@/lib/routes';
import {
  emptyYogiForm,
  formToYogi,
  goals,
  yogiToForm,
  timings,
  validateYogiForm,
  type YogiFormErrors,
  type YogiFormValues,
} from '../../lib/yogi-form';

function YogiCombobox({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      value={value || null}
      onValueChange={(nextValue) => onChange(typeof nextValue === 'string' ? nextValue : '')}
    >
      <div ref={anchor}>
        <ComboboxInput placeholder={placeholder} />
      </div>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {options.map((option) => (
            <ComboboxItem key={option.value} value={option.value}>
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function Field({
  label,
  required,
  error,
  children,
  full = false,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label {...stylex.props(formStyles.field, full && yogisStyles.fullField)}>
      <span {...stylex.props(formStyles.label)}>
        {label}
        {required && <span {...stylex.props(formStyles.requiredMark)}> *</span>}
      </span>
      {children}
      {error && <span {...stylex.props(yogisStyles.error)}>{error}</span>}
    </label>
  );
}

export default function YogiManager({
  initialYogis,
  open,
  onOpenChange,
  profileYogi,
  onProfileSaved,
  onProfileCancel,
  repository = yogiService,
}: {
  initialYogis: Yogi[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileYogi?: Yogi;
  onProfileSaved?: (yogi: Yogi) => void;
  onProfileCancel?: () => void;
  repository?: YogiRepository;
}) {
  const [yogis, setYogis] = useState(initialYogis);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<YogiFormValues>(emptyYogiForm);
  const [errors, setErrors] = useState<YogiFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const toastManager = useToast();

  useEffect(() => {
    setIsLoading(true);
    setYogis(repository.load(initialYogis));
    setIsLoading(false);
  }, [initialYogis, repository]);

  useEffect(() => {
    if (profileYogi) {
      setForm(yogiToForm(profileYogi));
    }
  }, [profileYogi]);

  function update<K extends keyof YogiFormValues>(key: K, value: YogiFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  function toggle(key: 'preferredClassTiming' | 'primaryGoals', value: string) {
    const current = form[key];
    update(
      key,
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function addYogi(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    const nextErrors = validateYogiForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 350));

    const yogi = formToYogi(form, profileYogi);

    const nextYogis = profileYogi
      ? yogis.map((item) => (item.id === profileYogi.id ? yogi : item))
      : [...yogis, yogi];
    setYogis(nextYogis);

    repository.save(nextYogis);
    if (profileYogi) {
      onProfileSaved?.(yogi);
      toastManager.add({
        title: 'Profile saved',
        description: 'The yogi profile has been updated.',
        type: 'success',
      });
    }

    setForm(profileYogi ? yogiToForm(yogi) : emptyYogiForm);
    setErrors({});
    setIsSaving(false);
    onOpenChange(false);
  }

  const filteredYogis = yogis.filter((yogi) =>
    yogi.displayName.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const profileOnly = Boolean(profileYogi);

  return (
    <>
      {open && (
        <div
          role="presentation"
          {...stylex.props(profileOnly ? yogisStyles.profileFormShell : yogisStyles.modalBackdrop)}
        >
          <div
            role={profileOnly ? 'region' : 'dialog'}
            aria-modal={profileOnly ? undefined : true}
            aria-label={profileOnly ? 'Edit yogi profile' : undefined}
            aria-labelledby={profileOnly ? undefined : 'add-yogi-title'}
            {...stylex.props(profileOnly ? yogisStyles.profileForm : yogisStyles.modal)}
          >
            {!profileOnly && (
              <div {...stylex.props(yogisStyles.modalHead)}>
                <div>
                  <p {...stylex.props(pageStyles.eyebrow)}>Yogis</p>
                  <h2 id="add-yogi-title" {...stylex.props(yogisStyles.sectionTitle)}>
                    Add yogi
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSaving}
                  aria-label="Close"
                >
                  <X size={20} color={colors.primary} />
                </Button>
              </div>
            )}

            {!profileOnly && (
              <aside {...stylex.props(yogisStyles.privacy, yogisStyles.modalPrivacy)}>
                <strong>Privacy-minded note taking</strong>
                <ul {...stylex.props(yogisStyles.privacyList)}>
                  <li>Record only information necessary for safe teaching</li>
                  <li>Avoid medical diagnoses</li>
                  <li>Obtain yogi consent when appropriate</li>
                  <li>Delete information when it is no longer needed</li>
                </ul>

                <UserShield
                  {...stylex.props(yogisStyles.privacyWatermark)}
                  size={72}
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </aside>
            )}

            <form
              {...stylex.props(
                yogisStyles.form,
                yogisStyles.modalForm,
                profileOnly && yogisStyles.profileFormFields,
              )}
              onSubmit={addYogi}
              noValidate
            >
              <div {...stylex.props(yogisStyles.section, yogisStyles.sectionFirst)}>
                <SectionHeader
                  title="Yogi Information"
                  description="Information needed to create a profile and contact the yogi."
                />

                <div {...stylex.props(yogisStyles.fieldGrid)}>
                  <Field label="Name" required error={errors.name} full>
                    <Input
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={!!errors.name}
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      aria-invalid={!!errors.email}
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone Number" error={errors.phoneNumber}>
                    <Input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => update('phoneNumber', e.target.value)}
                      aria-invalid={!!errors.phoneNumber}
                      autoComplete="tel"
                    />
                  </Field>
                  <Field label="Gender">
                    <YogiCombobox
                      value={form.gender}
                      onChange={(value) => update('gender', value)}
                      placeholder="Select gender"
                      options={[
                        { value: 'female', label: 'Female' },
                        { value: 'male', label: 'Male' },
                        { value: 'non_binary', label: 'Non-binary' },
                        {
                          value: 'prefer_not_to_say',
                          label: 'Prefer not to say',
                        },
                      ]}
                    />
                  </Field>
                  <Field label="Notes" full>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      placeholder="Additional information or physical limitations"
                    />
                  </Field>
                </div>
              </div>

              <div {...stylex.props(yogisStyles.section)}>
                <SectionHeader
                  title="Class Preferences"
                  description="Help tailor classes to this yogi."
                />

                <div {...stylex.props(yogisStyles.fieldGrid)}>
                  <Field label="Preferred Class Level">
                    <YogiCombobox
                      value={form.preferredClassLevel}
                      onChange={(value) => update('preferredClassLevel', value)}
                      placeholder="Select level"
                      options={[
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'all_levels', label: 'All levels' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' },
                      ]}
                    />
                  </Field>
                  <Field label="Preferred Yoga Type">
                    <Input
                      value={form.preferredYogaType}
                      onChange={(e) => update('preferredYogaType', e.target.value)}
                      placeholder="e.g. Hatha, Vinyasa"
                    />
                  </Field>
                  <Field label="Preferred Class Timing" full>
                    <div {...stylex.props(yogisStyles.optionGrid)}>
                      {timings.map((timing, index) => (
                        <label
                          key={`timing-${timing}-${index}`}
                          {...stylex.props(yogisStyles.option)}
                        >
                          <Checkbox
                            id={`timing-${timing}-${index}`}
                            checked={form.preferredClassTiming.includes(timing)}
                            onCheckedChange={() => toggle('preferredClassTiming', timing)}
                          />
                          {timing}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Specific Timing Notes" full>
                    <Input
                      value={form.specificTimingNotes}
                      onChange={(e) => update('specificTimingNotes', e.target.value)}
                      placeholder="e.g. after 6 pm on weekdays"
                    />
                  </Field>
                </div>
              </div>

              <div {...stylex.props(yogisStyles.section)}>
                <SectionHeader
                  title="Goals & Practice Background"
                  description="Brief information to help plan teaching."
                />

                <div {...stylex.props(yogisStyles.fieldGrid)}>
                  <Field label="Primary Goals" full>
                    <div {...stylex.props(yogisStyles.optionGrid)}>
                      {goals.map((goal, index) => (
                        <label key={`goal-${goal}-${index}`} {...stylex.props(yogisStyles.option)}>
                          <Checkbox
                            id={`goal-${goal}-${index}`}
                            checked={form.primaryGoals.includes(goal)}
                            onCheckedChange={() => toggle('primaryGoals', goal)}
                          />
                          {goal}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Fitness Level">
                    <YogiCombobox
                      value={form.fitnessLevel}
                      onChange={(value) => update('fitnessLevel', value)}
                      placeholder="Select fitness level"
                      options={[
                        { value: 'beginner', label: 'Beginner' },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced', label: 'Advanced' },
                      ]}
                    />
                  </Field>
                </div>
              </div>

              <div {...stylex.props(yogisStyles.formActions)}>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (profileYogi) {
                      setForm(yogiToForm(profileYogi));
                      onProfileCancel?.();
                    } else {
                      onOpenChange(false);
                    }
                    setErrors({});
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving…' : profileOnly ? 'Save changes' : 'Add yogi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!profileOnly && (
        <>
          <div {...stylex.props(yogiStyles.search)}>
            <Input
              type="search"
              role="searchbox"
              aria-label="Search yogis"
              placeholder="Search yogis…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              {...stylex.props(yogiStyles.searchInput)}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear yogi search"
                onClick={() => setSearch('')}
                {...stylex.props(yogiStyles.searchClear)}
              >
                <X size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div
              {...stylex.props(yogiStyles.list)}
              aria-busy="true"
              aria-label="Loading yogis"
              role="status"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <div key={`yogi-skeleton-${index}`} {...stylex.props(yogiStyles.skeletonItem)}>
                  <Skeleton {...stylex.props(yogiStyles.skeletonAvatar)} />
                  <div {...stylex.props(yogiStyles.skeletonCopy)}>
                    <Skeleton {...stylex.props(yogiStyles.skeletonTitle)} />
                    <Skeleton {...stylex.props(yogiStyles.skeletonDescription)} />
                  </div>
                  <Skeleton {...stylex.props(yogiStyles.skeletonBadge)} />
                  <Skeleton {...stylex.props(yogiStyles.skeletonAction)} />
                </div>
              ))}
            </div>
          ) : filteredYogis.length > 0 ? (
            <div {...stylex.props(yogiStyles.list)}>
              {filteredYogis.map((yogi, index) => (
                <Link
                  key={`${yogi.id || yogi.displayName}-${index}`}
                  {...stylex.props(cardStyles.card)}
                  className={stylex.props(yogiStyles.item).className}
                  href={INSTRUCTOR_ROUTES.YOGIS.BY_ID(yogi.id)}
                >
                  <div {...stylex.props(yogiStyles.avatar)}>{yogi.displayName[0]}</div>
                  <div {...stylex.props(yogiStyles.content)}>
                    <h3 {...stylex.props(yogiStyles.title)}>{yogi.displayName}</h3>
                    <p {...stylex.props(yogiStyles.description)}>
                      {yogi.note || 'No general note yet'}
                    </p>
                  </div>
                  <Badge>{yogi.status === 'active' ? 'Active' : 'Archived'}</Badge>
                  <span {...stylex.props(yogiStyles.action)} aria-hidden="true">
                    <ArrowRightIcon size={18} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <section aria-label="Empty yogis" {...stylex.props(dashboardStyles.classEmptySection)}>
              <UserCircleCheckIcon
                {...stylex.props(dashboardStyles.classEmptyIcon)}
                size={84}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <p {...stylex.props(dashboardStyles.classEmptyTitle)} role="status">
                  No yogis found.
                </p>
                <p {...stylex.props(dashboardStyles.classEmptyDescription)}>
                  Try another search or add a new yogi to get started.
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
