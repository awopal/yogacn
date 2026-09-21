'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { SessionAttendance } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import * as stylex from '@stylexjs/stylex';
import { yogiStyles } from '@/styles/yogi.stylex';
import { typographyStyles } from '@/styles/typography.stylex';
import { layoutStyles } from '@/styles/layout.stylex';
import { colors } from '@/styles/tokens.stylex';
import { useToast } from '@/components/ui/toast';

const storageKey = (yogiId: string) => `yogi-class-notes:${yogiId}`;
type ClassHistoryVisit = SessionAttendance & {
  level?: string;
};
const dayStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return dayStart(next);
};
const startOfWeek = (date: Date) => {
  const next = dayStart(date);
  const day = next.getDay();
  next.setDate(next.getDate() - (day === 0 ? 6 : day - 1));
  return next;
};
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const visitDate = (visit: ClassHistoryVisit) => dayStart(new Date(visit.attendedAt));
const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', options).format(date);
const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
const rangeLabel = (start: Date, end: Date) =>
  `${formatDate(start, { month: 'short', day: 'numeric' })}–${formatDate(end, { month: 'short', day: 'numeric', year: 'numeric' })}`;

export default function YogiClassHistory({
  yogiId,
  attendance,
}: {
  yogiId: string;
  attendance: ClassHistoryVisit[];
}) {
  const initialWeek = startOfWeek(new Date());
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewFromUrl = searchParams.get('view');
  const [weekStart, setWeekStart] = useState(initialWeek);
  const [selectedDate, setSelectedDate] = useState(initialWeek);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(initialWeek));
  const [view, setView] = useState<'week' | 'all'>(viewFromUrl === 'all' ? 'all' : 'week');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [allHistoryPage, setAllHistoryPage] = useState(1);
  const toastManager = useToast();

  useEffect(() => {
    setView(viewFromUrl === 'all' ? 'all' : 'week');
  }, [viewFromUrl]);

  function changeView(nextView: 'week' | 'all') {
    setView(nextView);
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === 'all') {
      params.set('view', 'all');
    } else {
      params.delete('view');
    }
    const query = params.toString();
    router.replace(pathname + (query ? '?' + query : ''), { scroll: false });
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey(yogiId));
    if (!stored) return;
    try {
      setNotes(JSON.parse(stored) as Record<string, string>);
    } catch {
      window.localStorage.removeItem(storageKey(yogiId));
    }
  }, [yogiId]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );
  const calendarDays = useMemo(() => {
    const first = startOfMonth(calendarMonth);
    const offset = (first.getDay() + 6) % 7;
    const totalDays = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    ).getDate();
    const cellCount = Math.ceil((offset + totalDays) / 7) * 7;
    return Array.from({ length: cellCount }, (_, index) => addDays(first, index - offset));
  }, [calendarMonth]);
  const todayKey = dateKey(dayStart(new Date()));
  const selectedKey = dateKey(selectedDate);
  const sortedAttendance = useMemo(
    () =>
      [...attendance].sort(
        (a, b) => new Date(a.attendedAt).getTime() - new Date(b.attendedAt).getTime(),
      ),
    [attendance],
  );
  const selectedVisits = sortedAttendance.filter(
    (visit) => dateKey(visitDate(visit)) === selectedKey,
  );
  const allHistory = sortedAttendance;
  const allHistorySorted = useMemo(
    () =>
      [...allHistory].sort(
        (a, b) => new Date(b.attendedAt).getTime() - new Date(a.attendedAt).getTime(),
      ),
    [allHistory],
  );
  const allHistoryPageSize = 5;
  const allHistoryPageCount = Math.max(1, Math.ceil(allHistorySorted.length / allHistoryPageSize));
  const visibleHistory = allHistorySorted.slice(
    (allHistoryPage - 1) * allHistoryPageSize,
    allHistoryPage * allHistoryPageSize,
  );

  function chooseWeek(nextWeek: Date) {
    const next = startOfWeek(nextWeek);
    setWeekStart(next);
    setSelectedDate(next);
    setCalendarMonth(startOfMonth(next));
  }

  function updateNote(id: string, value: string) {
    setNotes((current) => ({ ...current, [id]: value }));
  }

  function saveNote() {
    window.localStorage.setItem(storageKey(yogiId), JSON.stringify(notes));
    setSelectedId(null);
    toastManager.add({
      title: 'Teaching note saved',
      description: 'The note was added to this class visit.',
      type: 'success',
    });
  }

  function openNote(id: string) {
    setSelectedId((current) => (current === id ? null : id));
  }

  function renderNoteEditor(visit: ClassHistoryVisit) {
    if (selectedId !== visit.id) return null;
    return (
      <div {...stylex.props(yogiStyles.historyEditor)}>
        <label {...stylex.props(yogiStyles.historyNote)}>
          <span {...stylex.props(yogiStyles.historyNoteLabel)}>Teaching note</span>
          <Textarea
            value={notes[visit.id] ?? ''}
            onChange={(event) => updateNote(visit.id, event.target.value)}
            placeholder="What should you remember for this yogi?"
            rows={3}
          />
        </label>

        <div {...stylex.props(yogiStyles.historyEditorActions)}>
          <Button type="button" size="sm" onClick={saveNote}>
            <ArrowDownToLine size={18} color={colors.primary} />
            Save note
          </Button>
        </div>
      </div>
    );
  }

  function renderVisitCard(visit: ClassHistoryVisit, compact = false, showDate = false) {
    return (
      <li
        key={visit.id}
        {...stylex.props(compact ? yogiStyles.historyRow : yogiStyles.visitListItem)}
      >
        <div
          {...stylex.props(compact ? yogiStyles.historyRowCard : yogiStyles.visitCard)}
          onClick={
            compact
              ? undefined
              : (event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest('button, textarea, input, select, label')) return;
                  openNote(visit.id);
                }
          }
        >
          {!compact && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className={
                stylex.props(
                  yogiStyles.noteToggle,
                  selectedId === visit.id && yogiStyles.noteToggleOpen,
                ).className
              }
              aria-expanded={selectedId === visit.id}
              aria-label={notes[visit.id] ? 'Edit teaching note' : 'Add teaching note'}
              title={notes[visit.id] ? 'Edit teaching note' : 'Add teaching note'}
              style={{
                transform: selectedId === visit.id ? 'rotate(180deg)' : undefined,
              }}
              onClick={() => openNote(visit.id)}
            >
              <ChevronDown size={22} aria-hidden="true" />
            </Button>
          )}

          <div {...stylex.props(yogiStyles.visitTopline)}>
            <div {...stylex.props(yogiStyles.visitSummary)}>
              {showDate ? (
                <time {...stylex.props(yogiStyles.visitDate)} dateTime={visit.attendedAt}>
                  {formatDate(visitDate(visit), {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' · '}
                  {formatTime(visit.attendedAt)}
                </time>
              ) : (
                <time {...stylex.props(yogiStyles.visitTime)} dateTime={visit.attendedAt}>
                  {formatTime(visit.attendedAt)}
                </time>
              )}
              <div {...stylex.props(layoutStyles.row)}>
                <p {...stylex.props(yogiStyles.visitTitle)}>{visit.classTitle}</p>
                {visit.level && (
                  <span {...stylex.props(yogiStyles.historyLevel)}>{visit.level}</span>
                )}
              </div>
            </div>
          </div>

          {!compact && (
            <>
              {notes[visit.id] && selectedId !== visit.id && (
                <p {...stylex.props(yogiStyles.visitNote)}>Teaching note: {notes[visit.id]}</p>
              )}
              {renderNoteEditor(visit)}
            </>
          )}
        </div>
      </li>
    );
  }

  return (
    <section {...stylex.props(yogiStyles.history)} aria-labelledby="class-attendance-title">
      <SectionHeader
        titleId="class-attendance-title"
        title="Class attendance"
        description="Classes this yogi has joined"
        action={
          <div {...stylex.props(yogiStyles.historyHeading)}>
            {view === 'week' ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setAllHistoryPage(1);
                  changeView('all');
                }}
              >
                View all history <ArrowRight size={16} aria-hidden="true" />
              </Button>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => changeView('week')}>
                <ArrowLeft size={16} aria-hidden="true" /> Back to weekly view
              </Button>
            )}
          </div>
        }
      />

      <div
        {...stylex.props(
          yogiStyles.historyDashboard,
          view === 'all' && yogiStyles.historyDashboardAll,
        )}
      >
        {view === 'week' && (
          <aside {...stylex.props(yogiStyles.calendarPanel)} aria-label="Class attendance calendar">
            <div {...stylex.props(layoutStyles.rowBetween)}>
              <h3 {...stylex.props(typographyStyles.h3)}>
                {formatDate(calendarMonth, { month: 'long', year: 'numeric' })}
              </h3>

              <div {...stylex.props(yogiStyles.calendarNav)}>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  {...stylex.props(yogiStyles.today)}
                  onClick={() => {
                    const today = dayStart(new Date());
                    setWeekStart(startOfWeek(today));
                    setSelectedDate(today);
                    setCalendarMonth(startOfMonth(today));
                    changeView('week');
                  }}
                >
                  Today
                </Button>

                <Button
                  type="button"
                  aria-label="Previous month"
                  variant="ghost"
                  size="calendar"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                    )
                  }
                >
                  <ChevronLeft size={20} aria-hidden="true" color={colors.primary} />
                </Button>

                <Button
                  type="button"
                  aria-label="Next month"
                  variant="ghost"
                  size="calendar"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                    )
                  }
                >
                  <ChevronRight size={20} aria-hidden="true" color={colors.primary} />
                </Button>
              </div>
            </div>

            <div {...stylex.props(yogiStyles.calendarWeekdays)} aria-hidden="true">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            <div {...stylex.props(yogiStyles.calendarGrid)}>
              {calendarDays.map((date) => {
                const key = dateKey(date);
                const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
                const hasClasses = attendance.some((visit) => dateKey(visitDate(visit)) === key);

                return (
                  <Button
                    type="button"
                    key={key}
                    variant="calendarCell"
                    size="calendar"
                    className={
                      stylex.props(
                        yogiStyles.calendarDay,
                        !isCurrentMonth && yogiStyles.calendarDayOutside,
                        key === selectedKey && yogiStyles.calendarDayActive,
                        key === todayKey && key !== selectedKey && yogiStyles.calendarDayToday,
                      ).className
                    }
                    style={{
                      color:
                        key === selectedKey
                          ? colors.background
                          : key === todayKey
                            ? colors.primary
                            : undefined,
                    }}
                    aria-label={`${formatDate(date, { month: 'long', day: 'numeric', year: 'numeric' })}${hasClasses ? ', has classes' : ''}`}
                    aria-current={key === todayKey ? 'date' : undefined}
                    onClick={() => {
                      setSelectedDate(date);
                      setWeekStart(startOfWeek(date));
                      setCalendarMonth(startOfMonth(date));
                      changeView('week');
                    }}
                  >
                    <span {...stylex.props(yogiStyles.calendarDateNumber)}>{date.getDate()}</span>

                    {hasClasses && (
                      <i {...stylex.props(yogiStyles.calendarDayIndicator)} aria-hidden="true" />
                    )}
                  </Button>
                );
              })}
            </div>

            <div {...stylex.props(layoutStyles.rowStart)}>
              <div {...stylex.props(yogiStyles.calendarDayIndicator)} aria-hidden="true" />
              <span {...stylex.props(typographyStyles.caption)}>
                is mark days this yogi joined a class.
              </span>
            </div>
          </aside>
        )}

        <div {...stylex.props(yogiStyles.historyMain)}>
          {view === 'week' ? (
            <>
              <div {...stylex.props(yogiStyles.weekToolbar)}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => chooseWeek(addDays(weekStart, -7))}
                >
                  <ChevronLeft size={28} aria-hidden="true" color={colors.primary} />
                </Button>

                <strong {...stylex.props(yogiStyles.weekLabel)}>
                  {rangeLabel(weekStart, addDays(weekStart, 6))}
                </strong>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => chooseWeek(addDays(weekStart, 7))}
                >
                  <ChevronRight size={28} aria-hidden="true" />
                </Button>
              </div>

              <div {...stylex.props(yogiStyles.dayScroller)}>
                <div {...stylex.props(yogiStyles.daySelector)} aria-label="Select a day">
                  {weekDays.map((date) => {
                    const key = dateKey(date);
                    const hasClasses = attendance.some(
                      (visit) => dateKey(visitDate(visit)) === key,
                    );

                    return (
                      <Button
                        type="button"
                        key={key}
                        variant="calendarCell"
                        size="calendar"
                        className={
                          stylex.props(
                            yogiStyles.dayButton,
                            key === selectedKey && yogiStyles.dayButtonActive,
                            key === todayKey && key !== selectedKey && yogiStyles.dayButtonToday,
                          ).className
                        }
                        style={{
                          color:
                            key === selectedKey
                              ? colors.background
                              : key === todayKey
                                ? colors.primary
                                : undefined,
                        }}
                        aria-current={key === todayKey ? 'date' : undefined}
                        onClick={() => {
                          setSelectedDate(date);
                          setCalendarMonth(startOfMonth(date));
                        }}
                      >
                        <span>{formatDate(date, { weekday: 'short' })}</span>
                        <strong>{date.getDate()}</strong>
                        {hasClasses && (
                          <i {...stylex.props(yogiStyles.dayIndicator)} aria-label="Has classes" />
                        )}
                        {key === todayKey && <small>Today</small>}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div {...stylex.props(yogiStyles.selectedDayHeading)}>
                <h3 {...stylex.props(typographyStyles.h3)}>
                  {formatDate(selectedDate, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
                {selectedVisits.length < 0 && (
                  <span {...stylex.props(yogiStyles.countPill)}>
                    {selectedVisits.length} {selectedVisits.length === 1 ? 'class' : 'classes'}
                  </span>
                )}
              </div>
              {selectedVisits.length === 0 ? (
                <div {...stylex.props(yogiStyles.emptyState)}>
                  <div {...stylex.props(layoutStyles.columnCenter)}>
                    <strong>No class history for this day</strong>
                    <span>Choose another day or view all history.</span>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAllHistoryPage(1);
                      changeView('all');
                    }}
                  >
                    View all history <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                </div>
              ) : (
                <ul {...stylex.props(yogiStyles.visitList)}>
                  {selectedVisits.map((visit) => renderVisitCard(visit))}
                </ul>
              )}
            </>
          ) : (
            <div {...stylex.props(yogiStyles.allHistory)}>
              <div {...stylex.props(yogiStyles.allHistoryMeta)}>
                <strong>All classes joined</strong>
                {allHistory.length < 0 && (
                  <span {...stylex.props(yogiStyles.countPill)}>
                    {allHistory.length} {allHistory.length === 1 ? 'class' : 'classes'}
                  </span>
                )}
              </div>
              {allHistorySorted.length === 0 ? (
                <div {...stylex.props(yogiStyles.emptyState)}>
                  <strong>No classes found in this date range</strong>
                  <span>Try another date range or class filter.</span>
                  <Button
                    size="sm"
                    className={stylex.props(yogiStyles.emptyStateButton).className}
                    type="button"
                    onClick={() => setAllHistoryPage(1)}
                  >
                    Show all history
                  </Button>
                </div>
              ) : (
                <>
                  <ul {...stylex.props(yogiStyles.visitList)}>
                    {visibleHistory.map((visit) => renderVisitCard(visit, false, true))}
                  </ul>
                  {allHistoryPageCount > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            disabled={allHistoryPage === 1}
                            onClick={() => setAllHistoryPage((page) => page - 1)}
                          />
                        </PaginationItem>

                        {Array.from({ length: allHistoryPageCount }, (_, index) => index + 1).map(
                          (pageNumber) => (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={pageNumber === allHistoryPage}
                                onClick={() => setAllHistoryPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}

                        <PaginationItem>
                          <PaginationNext
                            disabled={allHistoryPage === allHistoryPageCount}
                            onClick={() => setAllHistoryPage((page) => page + 1)}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
