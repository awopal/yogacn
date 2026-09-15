'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Student } from '../../lib/types';
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
import { studentStyles } from '../../styles/student.stylex';
import { studentsStyles } from '../../styles/students.stylex';
import { studentService, type StudentRepository } from '../../lib/student-service';
import { ArrowRightIcon, UserCircleCheckIcon } from '@/components/icons';
import { UserShield, X } from 'lucide-react';
import { colors } from '@/styles/tokens.stylex';
import {
  emptyStudentForm,
  formToStudent,
  goals,
  studentToForm,
  timings,
  validateStudentForm,
  type StudentFormErrors,
  type StudentFormValues,
} from '../../lib/student-form';

function StudentCombobox({
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
    <label {...stylex.props(formStyles.field, full && studentsStyles.fullField)}>
      <span {...stylex.props(formStyles.label)}>
        {label}
        {required && <span {...stylex.props(formStyles.requiredMark)}> *</span>}
      </span>
      {children}
      {error && <span {...stylex.props(studentsStyles.error)}>{error}</span>}
    </label>
  );
}

export default function StudentManager({
  initialStudents,
  open,
  onOpenChange,
  profileStudent,
  onProfileSaved,
  onProfileCancel,
  repository = studentService,
}: {
  initialStudents: Student[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileStudent?: Student;
  onProfileSaved?: (student: Student) => void;
  onProfileCancel?: () => void;
  repository?: StudentRepository;
}) {
  const [students, setStudents] = useState(initialStudents);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<StudentFormValues>(emptyStudentForm);
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const toastManager = useToast();

  useEffect(() => {
    setIsLoading(true);
    setStudents(repository.load(initialStudents));
    setIsLoading(false);
  }, [initialStudents, repository]);

  useEffect(() => {
    if (profileStudent) {
      setForm(studentToForm(profileStudent));
    }
  }, [profileStudent]);

  function update<K extends keyof StudentFormValues>(key: K, value: StudentFormValues[K]) {
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

  async function addStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    const nextErrors = validateStudentForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 350));

    const student = formToStudent(form, profileStudent);

    const nextStudents = profileStudent
      ? students.map((item) => (item.id === profileStudent.id ? student : item))
      : [...students, student];
    setStudents(nextStudents);

    repository.save(nextStudents);
    if (profileStudent) {
      onProfileSaved?.(student);
      toastManager.add({
        title: 'Profile saved',
        description: 'The student profile has been updated.',
        type: 'success',
      });
    }

    setForm(profileStudent ? studentToForm(student) : emptyStudentForm);
    setErrors({});
    setIsSaving(false);
    onOpenChange(false);
  }

  const filteredStudents = students.filter((student) =>
    student.displayName.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const profileOnly = Boolean(profileStudent);

  return (
    <>
      {open && (
        <div
          role="presentation"
          {...stylex.props(
            profileOnly ? studentsStyles.profileFormShell : studentsStyles.modalBackdrop,
          )}
        >
          <div
            role={profileOnly ? 'region' : 'dialog'}
            aria-modal={profileOnly ? undefined : true}
            aria-label={profileOnly ? 'Edit student profile' : undefined}
            aria-labelledby={profileOnly ? undefined : 'add-student-title'}
            {...stylex.props(profileOnly ? studentsStyles.profileForm : studentsStyles.modal)}
          >
            {!profileOnly && (
              <div {...stylex.props(studentsStyles.modalHead)}>
                <div>
                  <p {...stylex.props(pageStyles.eyebrow)}>Students</p>
                  <h2 id="add-student-title" {...stylex.props(studentsStyles.sectionTitle)}>
                    Add student
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
              <aside {...stylex.props(studentsStyles.privacy, studentsStyles.modalPrivacy)}>
                <strong>Privacy-minded note taking</strong>
                <ul {...stylex.props(studentsStyles.privacyList)}>
                  <li>Record only information necessary for safe teaching</li>
                  <li>Avoid medical diagnoses</li>
                  <li>Obtain student consent when appropriate</li>
                  <li>Delete information when it is no longer needed</li>
                </ul>

                <UserShield
                  {...stylex.props(studentsStyles.privacyWatermark)}
                  size={72}
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </aside>
            )}

            <form
              {...stylex.props(
                studentsStyles.form,
                studentsStyles.modalForm,
                profileOnly && studentsStyles.profileFormFields,
              )}
              onSubmit={addStudent}
              noValidate
            >
              <div {...stylex.props(studentsStyles.section, studentsStyles.sectionFirst)}>
                <SectionHeader
                  title="Student Information"
                  description="Information needed to create a profile and contact the student."
                />

                <div {...stylex.props(studentsStyles.fieldGrid)}>
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
                    <StudentCombobox
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

              <div {...stylex.props(studentsStyles.section)}>
                <SectionHeader
                  title="Class Preferences"
                  description="Help tailor classes to this student."
                />

                <div {...stylex.props(studentsStyles.fieldGrid)}>
                  <Field label="Preferred Class Level">
                    <StudentCombobox
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
                    <div {...stylex.props(studentsStyles.optionGrid)}>
                      {timings.map((timing, index) => (
                        <label
                          key={`timing-${timing}-${index}`}
                          {...stylex.props(studentsStyles.option)}
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

              <div {...stylex.props(studentsStyles.section)}>
                <SectionHeader
                  title="Goals & Practice Background"
                  description="Brief information to help plan teaching."
                />

                <div {...stylex.props(studentsStyles.fieldGrid)}>
                  <Field label="Primary Goals" full>
                    <div {...stylex.props(studentsStyles.optionGrid)}>
                      {goals.map((goal, index) => (
                        <label
                          key={`goal-${goal}-${index}`}
                          {...stylex.props(studentsStyles.option)}
                        >
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
                    <StudentCombobox
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

              <div {...stylex.props(studentsStyles.formActions)}>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    if (profileStudent) {
                      setForm(studentToForm(profileStudent));
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
                  {isSaving ? 'Saving…' : profileOnly ? 'Save changes' : 'Add student'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!profileOnly && (
        <>
          <div {...stylex.props(studentStyles.search)}>
            <Input
              type="search"
              role="searchbox"
              aria-label="Search students"
              placeholder="Search students…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              {...stylex.props(studentStyles.searchInput)}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear student search"
                onClick={() => setSearch('')}
                {...stylex.props(studentStyles.searchClear)}
              >
                <X size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div
              {...stylex.props(studentStyles.list)}
              aria-busy="true"
              aria-label="Loading students"
              role="status"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`student-skeleton-${index}`}
                  {...stylex.props(studentStyles.skeletonItem)}
                >
                  <Skeleton {...stylex.props(studentStyles.skeletonAvatar)} />
                  <div {...stylex.props(studentStyles.skeletonCopy)}>
                    <Skeleton {...stylex.props(studentStyles.skeletonTitle)} />
                    <Skeleton {...stylex.props(studentStyles.skeletonDescription)} />
                  </div>
                  <Skeleton {...stylex.props(studentStyles.skeletonBadge)} />
                  <Skeleton {...stylex.props(studentStyles.skeletonAction)} />
                </div>
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div {...stylex.props(studentStyles.list)}>
              {filteredStudents.map((student, index) => (
                <Link
                  key={`${student.id || student.displayName}-${index}`}
                  {...stylex.props(cardStyles.card)}
                  className={stylex.props(studentStyles.item).className}
                  href={`/students/${student.id}`}
                >
                  <div {...stylex.props(studentStyles.avatar)}>{student.displayName[0]}</div>
                  <div {...stylex.props(studentStyles.content)}>
                    <h3 {...stylex.props(studentStyles.title)}>{student.displayName}</h3>
                    <p {...stylex.props(studentStyles.description)}>
                      {student.note || 'No general note yet'}
                    </p>
                  </div>
                  <Badge>{student.status === 'active' ? 'Active' : 'Archived'}</Badge>
                  <span {...stylex.props(studentStyles.action)} aria-hidden="true">
                    <ArrowRightIcon size={18} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <section
              aria-label="Empty students"
              {...stylex.props(dashboardStyles.classEmptySection)}
            >
              <UserCircleCheckIcon
                {...stylex.props(dashboardStyles.classEmptyIcon)}
                size={84}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <p {...stylex.props(dashboardStyles.classEmptyTitle)} role="status">
                  No students found.
                </p>
                <p {...stylex.props(dashboardStyles.classEmptyDescription)}>
                  Try another search or add a new student to get started.
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
