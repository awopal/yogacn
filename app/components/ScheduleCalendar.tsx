'use client';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import type {
  DateSelectArg,
  DatesSetArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import { CalendarPlus, Check, Clock3, FunnelX, Pencil, Plus, UsersRound, X } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
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
import { TrashIcon } from '@/components/icons';
import {
  emptyScheduleForm,
  type ScheduleForm,
  useScheduleStore,
} from '@/lib/stores/schedule-store';
import { colors } from '@/styles/tokens.stylex';
import {
  MoonDayIcon,
  type MoonDay,
  type MoonDayType,
} from '@/components/MoonDayIndicator';

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

const oneHourAfter = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  date.setHours(date.getHours() + 1);
  return localInput(date);
};

export default function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [classes, setClasses] = useState<ScheduleClass[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moonDays, setMoonDays] = useState<Record<string, MoonDayType>>({});
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

  const loadMoonDays = async (arg: DatesSetArg) => {
    const firstYear = arg.start.getFullYear();
    const lastYear = new Date(arg.end.getTime() - 1).getFullYear();
    const years = Array.from(
      { length: lastYear - firstYear + 1 },
      (_, index) => firstYear + index,
    );
    const responses = await Promise.all(
      years.map((year) =>
        fetch(`/api/moon-days?year=${year}&timezone=Asia%2FBangkok`).then((response) =>
          response.ok ? (response.json() as Promise<{ moonDays?: MoonDay[] }>) : null,
        ),
      ),
    );
    const nextMoonDays: Record<string, MoonDayType> = {};
    responses.forEach((data) => {
      data?.moonDays?.forEach((moonDay) => {
        nextMoonDays[moonDay.localDate] = moonDay.type;
      });
    });
    setMoonDays((current) => ({ ...current, ...nextMoonDays }));
  };

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
      const firstStart = new Date(nextItem.start);
      const recurringClasses: ScheduleClass[] = [];
      for (let index = 0; ; index += 1) {
        const start = new Date(nextItem.start);
        const end = new Date(nextItem.end);
        start.setDate(start.getDate() + index * 7);
        end.setDate(end.getDate() + index * 7);
        if (
          start.getMonth() !== firstStart.getMonth() ||
          start.getFullYear() !== firstStart.getFullYear()
        )
          break;
        recurringClasses.push({
          ...nextItem,
          id: `${nextItem.id}-${index + 1}`,
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
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
      <div className="schedule-event-meta">
        <span>{arg.timeText}</span>
        <span
          className="schedule-event-student-count"
          aria-label={`${arg.event.extendedProps.studentCount} students`}
        >
          <UsersRound size={12} aria-hidden="true" />
          {arg.event.extendedProps.studentCount}
        </span>
      </div>
    </div>
  );

  return (
    <div {...stylex.props(scheduleStyles.page)}>
      <header {...stylex.props(dashboardStyles.dashboardWelcome)}>
        <div>
          <h1 {...stylex.props(typographyStyles.h3)}>Class Schedule</h1>
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
          <DatePicker
            value={dateFilter}
            onChange={(value) => {
              setFilter('dateFilter', value);
              if (value) calendarRef.current?.getApi().gotoDate(`${value}T12:00:00`);
            }}
            placeholder="Pick a date"
            className={stylex.props(scheduleStyles.input).className}
          />
        </label>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Class type</span>
          <Combobox
            items={['all', ...types]}
            value={typeFilter}
            itemToStringLabel={(item) => (item === 'all' ? 'All types' : item)}
            onValueChange={(value) =>
              setFilter('typeFilter', (value ?? 'all') as ClassType | 'all')
            }
          >
            <ComboboxInput className={stylex.props(scheduleStyles.input).className} />
            <ComboboxContent>
              <ComboboxEmpty>No class types found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item === 'all' ? 'All types' : item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </label>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Status</span>
          <Combobox
            items={['all', ...Object.keys(statusLabels)]}
            value={statusFilter}
            itemToStringLabel={(item) =>
              item === 'all' ? 'All statuses' : statusLabels[item as ClassStatus]
            }
            onValueChange={(value) =>
              setFilter('statusFilter', (value ?? 'all') as ClassStatus | 'all')
            }
          >
            <ComboboxInput className={stylex.props(scheduleStyles.input).className} />
            <ComboboxContent>
              <ComboboxEmpty>No statuses found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item === 'all' ? 'All statuses' : statusLabels[item as ClassStatus]}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </label>
        <label {...stylex.props(scheduleStyles.filter)}>
          <span {...stylex.props(scheduleStyles.filterLabel)}>Student</span>
          <Combobox
            items={['all', ...demoStudents.map((student) => student.id)]}
            value={studentFilter}
            itemToStringLabel={(item) =>
              item === 'all'
                ? 'All students'
                : (demoStudents.find((student) => student.id === item)?.displayName ?? item)
            }
            onValueChange={(value) => setFilter('studentFilter', value ?? 'all')}
          >
            <ComboboxInput className={stylex.props(scheduleStyles.input).className} />
            <ComboboxContent>
              <ComboboxEmpty>No students found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item === 'all'
                      ? 'All students'
                      : (demoStudents.find((student) => student.id === item)?.displayName ?? item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </label>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            resetFilters();
          }}
        >
          <FunnelX size={22} color={colors.primary} aria-hidden="true" />
        </Button>
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
            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
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
            datesSet={loadMoonDays}
            dayCellContent={(arg) => {
              if (arg.view.type !== 'dayGridMonth') return arg.dayNumberText;
              const dateKey = arg.date.toLocaleDateString('en-CA');
              const moonDayType = arg.isOther ? undefined : moonDays[dateKey];
              return (
                <span className="schedule-month-day-number">
                  {moonDayType && <MoonDayIcon type={moonDayType} />}
                  <span>{arg.dayNumberText}</span>
                </span>
              );
            }}
            dayHeaderContent={(arg) => {
              const isListView = arg.view.type.startsWith('list');
              const dateKey = arg.date.toLocaleDateString('en-CA');
              const moonDayType = moonDays[dateKey];
              const showMoonDayIcon =
                Boolean(moonDayType) &&
                (isListView || arg.view.type === 'timeGridDay' || arg.view.type === 'timeGridWeek');

              if (isListView) {
                return (
                  <span className="schedule-list-day-header">
                    <span className="schedule-list-day-title">
                      {showMoonDayIcon && <MoonDayIcon type={moonDayType} />}
                      <span>{arg.text}</span>
                    </span>
                    <span>{arg.sideText}</span>
                  </span>
                );
              }

              return (
                <span className="schedule-list-day-title">
                  {showMoonDayIcon && <MoonDayIcon type={moonDayType} />}
                  <span>{arg.text}</span>
                </span>
              );
            }}
            events={filtered.map((item) => ({
              id: item.id,
              title: item.title,
              start: item.start,
              end: item.end,
              backgroundColor: colors.secondaryMuted,
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
  const [newStudentOpen, setNewStudentOpen] = useState(false);
  const studentAnchor = useComboboxAnchor();
  const update = <K extends keyof ScheduleForm>(key: K, value: ScheduleForm[K]) => {
    if (key === 'start' && typeof value === 'string') {
      setForm({ ...form, start: value, end: oneHourAfter(value) });
      return;
    }
    setForm({ ...form, [key]: value });
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
        <div {...stylex.props(scheduleStyles.formGrid, scheduleStyles.formGridSpaced)}>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Class</span>
            <Combobox
              items={demoPlans.map((plan) => plan.title)}
              value={form.title}
              onValueChange={(value) => {
                const title = value ?? '';
                const selectedPlan = demoPlans.find((plan) => plan.title === title);
                setForm({
                  ...form,
                  title,
                  classPlanId: selectedPlan?.id ?? '',
                });
              }}
            >
              <ComboboxInput
                autoFocus
                placeholder="Search your class plans…"
                className={stylex.props(scheduleStyles.input).className}
              />
              <ComboboxContent>
                <ComboboxEmpty>No class plans found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
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
            <DatePicker
              includeTime
              value={form.start}
              onChange={(value) => update('start', value)}
              placeholder="Select start"
              className={stylex.props(scheduleStyles.input).className}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Ends</span>
            <DatePicker
              includeTime
              value={form.end}
              onChange={(value) => update('end', value)}
              placeholder="Select end"
              className={stylex.props(scheduleStyles.input).className}
            />
          </label>
          <div {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Students</span>
            <Combobox
              multiple
              autoHighlight
              items={students.map((student) => student.id)}
              value={form.studentIds}
              onValueChange={(value, details) => {
                // Keep blur/outside-press state changes internal to Base UI. Only
                // persist changes caused by selecting or explicitly removing a student.
                if (details.reason === 'item-press' || details.reason === 'chip-remove-press') {
                  update('studentIds', value);
                }
              }}
              itemToStringLabel={(studentId) =>
                students.find((student) => student.id === studentId)?.displayName ?? studentId
              }
            >
              <ComboboxChips ref={studentAnchor}>
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((studentId: string) => (
                        <ComboboxChip key={studentId}>
                          {students.find((student) => student.id === studentId)?.displayName ??
                            studentId}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        placeholder={values.length ? undefined : 'Search students…'}
                        aria-label="Students"
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={studentAnchor}>
                <ComboboxEmpty>No matching students</ComboboxEmpty>
                <ComboboxList>
                  {(studentId) => (
                    <ComboboxItem key={studentId} value={studentId}>
                      {students.find((student) => student.id === studentId)?.displayName ??
                        studentId}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>Teaching note</span>
            <Textarea
              value={form.note}
              onChange={(event) => update('note', event.target.value)}
              placeholder="Add a note for this class…"
              rows={3}
              {...stylex.props(scheduleStyles.input)}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span>
              <Checkbox
                checked={form.recurring}
                onCheckedChange={(checked) => update('recurring', checked === true)}
              />{' '}
              Repeat weekly · this month
            </span>
          </label>
        </div>
        <div {...stylex.props(scheduleStyles.modalActions)}>
          <div>
            {isEditing && (
              <div {...stylex.props(scheduleStyles.actions)}>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <TrashIcon size={16} aria-hidden="true" />
                </Button>
                <Button variant="secondary" size="sm" onClick={onAttendance}>
                  <Check size={16} /> Attendance
                </Button>
              </div>
            )}
          </div>
          <div {...stylex.props(scheduleStyles.actions)}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave} disabled={!form.title.trim() || !form.classPlanId}>
              <Pencil size={16} aria-hidden="true" />
              Save
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
            <Input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Mina"
              className={stylex.props(scheduleStyles.input).className}
            />
          </label>
          <label {...stylex.props(scheduleStyles.field, scheduleStyles.full)}>
            <span {...stylex.props(scheduleStyles.fieldLabel)}>General note (optional)</span>
            <Textarea
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
  const studentAnchor = useComboboxAnchor();
  const presentStudentIds = item.students.filter((id) => attendance[id] !== 'absent');
  return (
    <div role="presentation" {...stylex.props(scheduleStyles.modalBackdrop)}>
      <div role="dialog" aria-modal="true" {...stylex.props(scheduleStyles.modal)}>
        <div {...stylex.props(scheduleStyles.modalHead)}>
          <div>
            <p {...stylex.props(pageStyles.eyebrow)}>After class</p>
            <h2 {...stylex.props(typographyStyles.h2)}>{item.title}</h2>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>

        <label {...stylex.props(scheduleStyles.field)}>
          <span {...stylex.props(scheduleStyles.fieldLabel)}>Class note:</span>
          <Textarea
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
