'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import type {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import { CalendarPlus, Check, Clock3, Plus, X } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@/components/ui/button';
import { SummaryCard as DashboardSummaryCard } from './dashboard/SummaryCard';
import { demoPlans, demoStudents } from '@/lib/server/demo';
import type { Student } from '@/lib/types';
import { studentService } from '@/lib/student-service';
import {
  classTypeColors,
  type ClassStatus,
  type ClassType,
  type ScheduleClass,
  scheduleService,
} from '@/lib/schedule';
import { scheduleStyles } from '@/styles/schedule.stylex';
import { dashboardStyles } from '@/styles/dashboard.stylex';
import { pageStyles } from '@/styles/page.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import {
  emptyScheduleForm,
  type ScheduleForm,
  useScheduleStore,
} from '@/lib/stores/schedule-store';

const statusLabels: Record<ClassStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No-show',
};
const types: ClassType[] = ['Vinyasa', 'Gentle', 'Private', 'Workshop'];
const localInput = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [classes, setClasses] = useState<ScheduleClass[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const typeFilter = useScheduleStore((state) => state.typeFilter);
  const statusFilter = useScheduleStore((state) => state.statusFilter);
  const studentFilter = useScheduleStore((state) => state.studentFilter);
  const dateFilter = useScheduleStore((state) => state.dateFilter);
  const form = useScheduleStore((state) => state.draft);
  const editingId = useScheduleStore((state) => state.editingId);
  const attendanceId = useScheduleStore((state) => state.attendanceId);
  const setFilter = useScheduleStore((state) => state.setFilter);
  const openNewDraft = useScheduleStore((state) => state.openNew);
  const openEditDraft = useScheduleStore((state) => state.openEdit);
  const setDraft = useScheduleStore((state) => state.setDraft);
  const closeDraft = useScheduleStore((state) => state.closeDraft);
  const resetFilters = useScheduleStore((state) => state.resetFilters);
  const setAttendanceId = useScheduleStore((state) => state.setAttendanceId);

  useEffect(() => {
    try {
      setClasses(scheduleService.load());
      setStudentOptions(studentService.load(demoStudents));
    } catch {
      setError('Unable to load your class schedule.');
    }
    setLoading(false);
  }, []);

  const filtered = useMemo(
    () =>
      classes.filter(
        (item) =>
          (typeFilter === 'all' || item.type === typeFilter) &&
          (statusFilter === 'all' || item.status === statusFilter) &&
          (studentFilter === 'all' || item.students.includes(studentFilter)) &&
          (!dateFilter || item.start.slice(0, 10) === dateFilter),
      ),
    [classes, dateFilter, statusFilter, studentFilter, typeFilter],
  );

  const summary = useMemo(() => {
    const upcoming = classes.filter(
      (item) => item.status === 'scheduled' && new Date(item.start) >= new Date(),
    ).length;
    const completed = classes.filter((item) => item.status === 'completed').length;
    const studentCount = new Set(classes.flatMap((item) => item.students)).size;
    const hours = classes
      .filter((item) => item.status !== 'cancelled')
      .reduce(
        (total, item) =>
          total + (new Date(item.end).getTime() - new Date(item.start).getTime()) / 3_600_000,
        0,
      );
    return { upcoming, completed, studentCount, hours: hours.toFixed(1) };
  }, [classes]);

  const openNew = (start?: Date, end?: Date) => {
    const base = start ?? new Date();
    const finish = end ?? new Date(base.getTime() + 60 * 60_000);
    openNewDraft({ ...emptyScheduleForm, start: localInput(base), end: localInput(finish) });
  };

  const openEdit = (item: ScheduleClass) =>
    openEditDraft(item.id, {
      title: item.title,
      classPlanId:
        item.classPlanId ?? demoPlans.find((plan) => plan.title === item.title)?.id ?? '',
      type: item.type,
      status: item.status,
      start: localInput(new Date(item.start)),
      end: localInput(new Date(item.end)),
      studentIds: item.students,
      note: item.note,
      recurring: Boolean(item.recurring),
    });

  const persist = (next: ScheduleClass[]) => {
    setClasses(next);
    scheduleService.save(next);
  };
  const persistStudents = (next: Student[]) => {
    setStudentOptions(next);
    studentService.save(next);
  };

  const saveForm = () => {
    if (!form?.title.trim() || !form.classPlanId || !form.start || !form.end) return;
    const existing = editingId ? classes.find((item) => item.id === editingId) : undefined;
    const nextItem: ScheduleClass = {
      id: editingId ?? `class-${Date.now()}`,
      classPlanId: form.classPlanId,
      title: form.title.trim(),
      type: form.type,
      status: form.status,
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      students: form.studentIds,
      note: form.note,
      attendance: existing?.attendance ?? {},
      color: classTypeColors[form.type],
      recurring: form.recurring,
    };
    if (editingId) {
      persist(classes.map((item) => (item.id === editingId ? nextItem : item)));
    } else if (form.recurring) {
      const recurringClasses = Array.from({ length: 12 }, (_, index) => {
        const start = new Date(nextItem.start);
        const end = new Date(nextItem.end);
        start.setDate(start.getDate() + index * 7);
        end.setDate(end.getDate() + index * 7);
        return {
          ...nextItem,
          id: `${nextItem.id}-${index + 1}`,
          start: start.toISOString(),
          end: end.toISOString(),
        };
      });
      persist([...classes, ...recurringClasses]);
    } else {
      persist([...classes, nextItem]);
    }
    closeDraft();
  };

  const removeClass = () => {
    if (editingId) persist(classes.filter((item) => item.id !== editingId));
    closeDraft();
  };
  const updateCalendarEvent = (arg: EventChangeArg) => {
    const event = arg.event;
    if (!event.start || !event.end) return;
    persist(
      classes.map((item) =>
        item.id === event.id
          ? { ...item, start: event.start!.toISOString(), end: event.end!.toISOString() }
          : item,
      ),
    );
  };

  const renderEvent = (arg: EventContentArg) => (
    <div className="schedule-event-content">
      <strong>{arg.event.title}</strong>
      <span>{arg.timeText}</span>
      <span>{arg.event.extendedProps.studentCount} students</span>
    </div>
  );

  return (
    <div {...stylex.props(scheduleStyles.page)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <h1 {...stylex.props(typographyStyles.h3)}>Hello, Opal!</h1>
          <p {...stylex.props(typographyStyles.muted, dashboardStyles.dashboardIntro)}>
            Plan your teaching week, keep track of attendance, and make space for what matters.
          </p>
        </div>
        <Button onClick={() => openNew()}>
          <Plus size={18} aria-hidden="true" /> Add class
        </Button>
      </header>

      <section aria-label="Schedule summary" {...stylex.props(scheduleStyles.summaryGrid)}>
        <DashboardSummaryCard
          label="Upcoming classes"
          value={summary.upcoming}
          detail="Scheduled ahead"
          tone="yellow"
        />
        <DashboardSummaryCard
          label="Completed classes"
          value={summary.completed}
          detail="Finished sessions"
          tone="green"
        />
        <DashboardSummaryCard
          label="Total students"
          value={summary.studentCount}
          detail="Across your classes"
          tone="purple"
        />
        <DashboardSummaryCard
          label="Teaching hours"
          value={summary.hours}
          detail="Scheduled + completed"
          tone="pink"
        />
      </section>

      <div {...stylex.props(scheduleStyles.filters)}>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Date</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => {
              const value = event.target.value;
              setFilter('dateFilter', value);
              if (value) calendarRef.current?.getApi().gotoDate(`${value}T12:00:00`);
            }}
            {...stylex.props(scheduleStyles.input)}
          />
        </label>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Class type</span>
          <select
            value={typeFilter}
            onChange={(event) => setFilter('typeFilter', event.target.value as ClassType | 'all')}
            {...stylex.props(scheduleStyles.input)}
          >
            <option value="all">All types</option>
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setFilter('statusFilter', event.target.value as ClassStatus | 'all')
            }
            {...stylex.props(scheduleStyles.input)}
          >
            <option value="all">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Student</span>
          <select
            value={studentFilter}
            onChange={(event) => setFilter('studentFilter', event.target.value)}
            {...stylex.props(scheduleStyles.input)}
          >
            <option value="all">All students</option>
            {demoStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.displayName}
              </option>
            ))}
          </select>
        </label>
        {(dateFilter ||
          typeFilter !== 'all' ||
          statusFilter !== 'all' ||
          studentFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetFilters();
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {error && (
        <div role="alert" {...stylex.props(scheduleStyles.error)}>
          {error}
        </div>
      )}
      <section {...stylex.props(scheduleStyles.calendarCard)} aria-label="Class calendar">
        {loading ? (
          <div {...stylex.props(scheduleStyles.empty)}>
            <Clock3 size={28} />
            <p>Loading your schedule…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div {...stylex.props(scheduleStyles.empty)}>
            <CalendarRangeIcon />
            <strong>No classes match these filters</strong>
            <span>Add a class or adjust your filters to get started.</span>
            <Button variant="outline" onClick={() => openNew()}>
              Add your first class
            </Button>
          </div>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,dayGridMonth,timeGridDay,listWeek',
            }}
            buttonText={{ today: 'Today', week: 'Week', month: 'Month', day: 'Day', list: 'List' }}
            selectable
            editable
            eventResizableFromStart
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            nowIndicator
            select={(selection: DateSelectArg) => {
              openNew(selection.start, selection.end);
            }}
            eventClick={(click: EventClickArg) => {
              openEdit(classes.find((item) => item.id === click.event.id)!);
            }}
            eventChange={updateCalendarEvent}
            eventContent={renderEvent}
            events={filtered.map((item) => ({
              id: item.id,
              title: item.title,
              start: item.start,
              end: item.end,
              backgroundColor: item.color,
              borderColor: item.color,
              classNames: [`status-${item.status}`],
              extendedProps: { studentCount: item.students.length },
            }))}
          />
        )}
      </section>

      {form && (
        <ClassForm
          form={form}
          setForm={setDraft}
          students={studentOptions}
          onAddStudent={(student) => {
            persistStudents([...studentOptions, student]);
            setDraft({ ...form, studentIds: [...form.studentIds, student.id] });
          }}
          onClose={closeDraft}
          onSave={saveForm}
          onDelete={removeClass}
          isEditing={Boolean(editingId)}
          onAttendance={() => setAttendanceId(editingId)}
        />
      )}
      {attendanceId && (
        <AttendanceModal
          item={classes.find((item) => item.id === attendanceId)!}
          students={studentOptions}
          onClose={() => setAttendanceId(null)}
          onSave={(attendance, note) => {
            persist(
              classes.map((item) =>
                item.id === attendanceId
                  ? { ...item, status: 'completed', attendance, note }
                  : item,
              ),
            );
            setAttendanceId(null);
            closeDraft();
          }}
        />
      )}
    </div>
  );
}

function CalendarRangeIcon() {
  return <CalendarPlus size={34} color="#463366" />;
}

function ClassForm({
  form,
  setForm,
  students,
  onAddStudent,
  onClose,
  onSave,
  onDelete,
  isEditing,
  onAttendance,
}: {
  form: ScheduleForm;
  setForm: (value: ScheduleForm) => void;
  students: Student[];
  onAddStudent: (student: Student) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onAttendance: () => void;
}) {
  const [studentQuery, setStudentQuery] = useState('');
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const [newStudentOpen, setNewStudentOpen] = useState(false);
  const update = <K extends keyof ScheduleForm>(key: K, value: ScheduleForm[K]) =>
    setForm({ ...form, [key]: value });
  const availableStudents = students.filter(
    (student) =>
      !form.studentIds.includes(student.id) &&
      student.displayName.toLowerCase().includes(studentQuery.toLowerCase()),
  );
  const toggleStudent = (studentId: string) => {
    update(
      'studentIds',
      form.studentIds.includes(studentId)
        ? form.studentIds.filter((id) => id !== studentId)
        : [...form.studentIds, studentId],
    );
    setStudentQuery('');
  };
  return (
    <div
      role="presentation"
      {...stylex.props(scheduleStyles.modalBackdrop)}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="class-form-title"
        {...stylex.props(scheduleStyles.modal)}
      >
        <div {...stylex.props(scheduleStyles.modalHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>{isEditing ? 'Edit class' : 'New class'}</p>
            <h2 id="class-form-title" {...stylex.props(typographyStyles.h2)}>
              {isEditing ? 'Update class details' : 'Schedule a class'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        <div {...stylex.props(scheduleStyles.formGrid)}>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Class name</span>
            <input
              autoFocus
              list="class-plan-options"
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                const selectedPlan = demoPlans.find(
                  (plan) => plan.title.toLowerCase() === title.toLowerCase(),
                );
                setForm({
                  ...form,
                  title,
                  classPlanId: selectedPlan?.id ?? '',
                });
              }}
              placeholder="Search your class plans…"
              {...stylex.props(scheduleStyles.input)}
            />
            <datalist id="class-plan-options">
              {demoPlans.map((plan) => (
                <option key={plan.id} value={plan.title}>
                  {plan.plannedDurationMinutes} min · {plan.level.replace('_', ' ')}
                </option>
              ))}
            </datalist>
            {form.classPlanId && (
              <Link
                href={`/classes/${form.classPlanId}/edit`}
                target="_blank"
                rel="noreferrer"
                {...stylex.props(dashboardStyles.viewAllLink)}
              >
                Open class details ↗
              </Link>
            )}
          </label>
          <label {...stylex.props(scheduleStyles.field)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Starts</span>
            <input
              type="datetime-local"
              value={form.start}
              onChange={(event) => update('start', event.target.value)}
              {...stylex.props(scheduleStyles.input)}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Ends</span>
            <input
              type="datetime-local"
              value={form.end}
              onChange={(event) => update('end', event.target.value)}
              {...stylex.props(scheduleStyles.input)}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Students</span>
            <div {...stylex.props(scheduleStyles.input, scheduleStyles.combo)}>
              <div {...stylex.props(scheduleStyles.selectedStudents)}>
                {form.studentIds.map((studentId) => {
                  const student = students.find((item) => item.id === studentId);
                  return (
                    <span key={studentId} {...stylex.props(scheduleStyles.studentChip)}>
                      {student?.displayName ?? studentId}
                      <button
                        type="button"
                        aria-label={`Remove ${student?.displayName ?? studentId}`}
                        onClick={() => toggleStudent(studentId)}
                        {...stylex.props(scheduleStyles.chipRemove)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
              <input
                value={studentQuery}
                onFocus={() => setStudentMenuOpen(true)}
                onChange={(event) => {
                  setStudentQuery(event.target.value);
                  setStudentMenuOpen(true);
                }}
                onBlur={() => setTimeout(() => setStudentMenuOpen(false), 150)}
                placeholder={form.studentIds.length ? 'Add another student…' : 'Search students…'}
                aria-label="Search students"
                className={stylex.props(scheduleStyles.comboInput).className}
              />
              {studentMenuOpen && (
                <div role="listbox" {...stylex.props(scheduleStyles.comboMenu)}>
                  {availableStudents.map((student) => (
                    <button
                      type="button"
                      role="option"
                      key={student.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => toggleStudent(student.id)}
                      {...stylex.props(scheduleStyles.comboOption)}
                    >
                      {student.displayName}
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setStudentMenuOpen(false);
                      setNewStudentOpen(true);
                    }}
                    {...stylex.props(scheduleStyles.comboOption, scheduleStyles.comboNewOption)}
                  >
                    ＋ New student
                  </button>
                  {!availableStudents.length && (
                    <span {...stylex.props(scheduleStyles.comboOption)}>No matching students</span>
                  )}
                </div>
              )}
            </div>
          </label>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Teaching note</span>
            <textarea
              value={form.note}
              onChange={(event) => update('note', event.target.value)}
              placeholder="Add a note for this class…"
              rows={3}
              {...stylex.props(scheduleStyles.input)}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span>
              <input
                type="checkbox"
                checked={form.recurring}
                onChange={(event) => update('recurring', event.target.checked)}
              />{' '}
              Repeat weekly
            </span>
          </label>
        </div>
        <div {...stylex.props(scheduleStyles.modalActions)}>
          <div>
            {isEditing && (
              <>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" size="sm" onClick={onAttendance}>
                  <Check size={15} /> Attendance
                </Button>
              </>
            )}
          </div>
          <div {...stylex.props(scheduleStyles.actions)}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave} disabled={!form.title.trim() || !form.classPlanId}>
              Save class
            </Button>
          </div>
        </div>
        {newStudentOpen && (
          <NewStudentDialog
            onClose={() => setNewStudentOpen(false)}
            onSave={(student) => {
              onAddStudent(student);
              setNewStudentOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function NewStudentDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (student: Student) => void;
}) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const save = () => {
    if (!name.trim()) return;
    onSave({
      id: `student-${Date.now()}`,
      displayName: name.trim(),
      note: note.trim(),
      status: 'active',
    });
  };

  return (
    <div
      role="presentation"
      {...stylex.props(scheduleStyles.modalBackdrop)}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-student-title"
        {...stylex.props(scheduleStyles.modal)}
      >
        <div {...stylex.props(scheduleStyles.modalHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>Students</p>
            <h2 id="new-student-title" {...stylex.props(typographyStyles.h2)}>
              Add new student
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        <div {...stylex.props(scheduleStyles.formGrid)}>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Display name</span>
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Mina"
              {...stylex.props(scheduleStyles.input)}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>General note (optional)</span>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="A note to support safe and appropriate teaching…"
              {...stylex.props(scheduleStyles.input)}
            />
          </label>
        </div>
        <div {...stylex.props(scheduleStyles.modalActions)}>
          <span />
          <div {...stylex.props(scheduleStyles.actions)}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={save} disabled={!name.trim()}>
              Add student
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceModal({
  item,
  students,
  onClose,
  onSave,
}: {
  item: ScheduleClass;
  students: Student[];
  onClose: () => void;
  onSave: (attendance: Record<string, 'present' | 'absent'>, note: string) => void;
}) {
  const [attendance, setAttendance] = useState(item.attendance);
  const [note, setNote] = useState(item.note);
  return (
    <div role="presentation" {...stylex.props(scheduleStyles.modalBackdrop)}>
      <div role="dialog" aria-modal="true" {...stylex.props(scheduleStyles.modal)}>
        <div {...stylex.props(scheduleStyles.modalHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>After class</p>
            <h2 {...stylex.props(typographyStyles.h2)}>Attendance & notes</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        <p {...stylex.props(typographyStyles.muted)}>{item.title}</p>
        <div>
          {item.students.map((id) => {
            const student = students.find((candidate) => candidate.id === id);
            return (
              <label key={id} {...stylex.props(scheduleStyles.field)}>
                <span>
                  <input
                    type="checkbox"
                    checked={attendance[id] !== 'absent'}
                    onChange={(event) =>
                      setAttendance({
                        ...attendance,
                        [id]: event.target.checked ? 'present' : 'absent',
                      })
                    }
                  />{' '}
                  {student?.displayName ?? id}
                </span>
              </label>
            );
          })}
        </div>
        <label {...stylex.props(scheduleStyles.field)}>
          <span {...stylex.props(scheduleStyles.fieldLabel)}>Class note</span>
          <textarea
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            {...stylex.props(scheduleStyles.input)}
          />
        </label>
        <div {...stylex.props(scheduleStyles.modalActions)}>
          <span />
          <Button onClick={() => onSave(attendance, note)}>
            <Check size={16} /> Mark completed
          </Button>
        </div>
      </div>
    </div>
  );
}
