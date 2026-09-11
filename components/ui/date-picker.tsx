'use client';

import * as React from 'react';
import { addMonths, format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Popover } from 'radix-ui';
import * as stylex from '@stylexjs/stylex';
import { cn } from '@/lib/utils';
import { colors, fontSize, radius, spacing } from '../../styles/tokens.stylex';

const styles = stylex.create({
  trigger: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.text,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: fontSize.sm,
    fontFamily: 'CommitMono, ui-monospace, monospace',
    fontWeight: 400,
    gap: spacing.sm,
    justifyContent: 'space-between',
    minHeight: 38,
    paddingBlock: spacing.sm,
    paddingInline: spacing.sm,
    textAlign: 'left',
    width: '100%',
    ':hover': { backgroundColor: colors.primarySoft },
    ':focus-visible': {
      borderColor: colors.primary,
      outline: `2px solid ${colors.primarySoft}`,
      outlineOffset: 1,
    },
  },
  triggerIcon: { color: colors.primary, flex: '0 0 auto' },
  content: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 8px 20px rgb(31 18 53 / 0.14)',
    padding: spacing.sm,
    zIndex: 30,
  },
  time: {
    alignItems: 'center',
    borderTopColor: colors.secondaryMuted,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
  },
  timeLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: 700 },
  timeSeparator: { color: colors.text, fontWeight: 700 },
  timeControl: { position: 'relative' },
  timeToggle: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.secondary,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.text,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'CommitMono, ui-monospace, monospace',
    fontSize: fontSize.sm,
    fontWeight: 400,
    gap: spacing.xs,
    minHeight: 34,
    paddingBlock: spacing.xs,
    paddingInline: spacing.sm,
    ':hover': { backgroundColor: colors.primarySoft },
    ':focus-visible': {
      borderColor: colors.primary,
      outline: `2px solid ${colors.primarySoft}`,
      outlineOffset: 1,
    },
  },
  timePanel: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    boxShadow: '0 8px 20px rgb(31 18 53 / 0.14)',
    display: 'flex',
    gap: spacing.xs,
    padding: spacing.xs,
    position: 'absolute',
    right: 0,
    bottom: 'calc(100% + 6px)',
    zIndex: 2,
  },
  timeColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: 168,
    minWidth: 48,
    overflowY: 'auto',
    padding: 2,
  },
  timeOption: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: radius.sm,
    color: colors.text,
    cursor: 'pointer',
    fontFamily: 'CommitMono, ui-monospace, monospace',
    fontSize: fontSize.sm,
    fontWeight: 400,
    minHeight: 32,
    paddingInline: spacing.sm,
    ':hover': { backgroundColor: colors.primarySoft },
  },
  timeOptionSelected: {
    backgroundColor: colors.primary,
    color: colors.background,
    fontWeight: 700,
    ':hover': { backgroundColor: colors.primary },
  },
});

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

function parseLocalValue(value: string | undefined) {
  if (!value) return undefined;
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  if (![year, month, day, hours, minutes].every(Number.isFinite)) return undefined;
  return new Date(year, month - 1, day, hours, minutes);
}

function toLocalValue(date: Date, includeTime: boolean, time: string) {
  const datePart = format(date, 'yyyy-MM-dd');
  return includeTime ? `${datePart}T${time || format(date, 'HH:mm')}` : datePart;
}

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  includeTime?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  includeTime = false,
  placeholder = 'Pick a date',
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [timePanelOpen, setTimePanelOpen] = React.useState(false);
  const timeControlRef = React.useRef<HTMLDivElement>(null);
  const selectedDate = parseLocalValue(value);
  const [month, setMonth] = React.useState(() => selectedDate ?? new Date());
  const [time, setTime] = React.useState(() =>
    selectedDate ? format(selectedDate, 'HH:mm') : '09:00',
  );

  React.useEffect(() => {
    if (selectedDate) {
      setTime(format(selectedDate, 'HH:mm'));
      setMonth(selectedDate);
    }
  }, [value]);

  const displayValue = selectedDate
    ? format(selectedDate, includeTime ? 'dd/MM/yyyy, HH:mm' : 'dd/MM/yyyy')
    : placeholder;
  const [hoursValue = '00', minutesValue = '00'] = time.split(':');

  const updateTime = (nextHours: string, nextMinutes: string) => {
    const nextTime = `${nextHours}:${nextMinutes}`;
    setTime(nextTime);
    if (selectedDate) onChange?.(toLocalValue(selectedDate, true, nextTime));
  };

  React.useEffect(() => {
    if (!timePanelOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!timeControlRef.current?.contains(event.target as Node)) {
        setTimePanelOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [timePanelOpen]);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setTimePanelOpen(false);
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          data-slot="date-picker-trigger"
          disabled={disabled}
          data-empty={!value || undefined}
          {...stylex.props(styles.trigger)}
          className={cn(stylex.props(styles.trigger).className, className)}
        >
          <span>{displayValue}</span>
          <CalendarIcon size={17} {...stylex.props(styles.triggerIcon)} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(event) => event.preventDefault()}
          {...stylex.props(styles.content)}
        >
          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            components={{
              Nav: () => (
                <nav aria-label="Month navigation" className="date-picker-nav">
                  <button
                    type="button"
                    aria-label="Previous month"
                    className="date-picker-nav-button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setMonth((current) => addMonths(current, -1));
                    }}
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    className="date-picker-nav-button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setMonth((current) => addMonths(current, 1));
                    }}
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </nav>
              ),
            }}
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              setMonth(date);
              onChange?.(toLocalValue(date, includeTime, time));
              if (!includeTime) setOpen(false);
            }}
            showOutsideDays
            classNames={{
              root: 'date-picker-calendar',
              months: 'date-picker-months',
              month: 'date-picker-month',
              month_caption: 'date-picker-caption',
              caption_label: 'date-picker-caption-label',
              nav: 'date-picker-nav',
              button_previous: 'date-picker-nav-button',
              button_next: 'date-picker-nav-button',
              month_grid: 'date-picker-grid',
              weekdays: 'date-picker-weekdays',
              weekday: 'date-picker-weekday',
              week: 'date-picker-week',
              day: 'date-picker-day',
              day_button: 'date-picker-day-button',
              selected: 'date-picker-selected',
              today: 'date-picker-today',
              outside: 'date-picker-outside',
            }}
          />
          {includeTime && (
            <div {...stylex.props(styles.time)}>
              <Clock3 size={15} color={colors.primary} />
              <span {...stylex.props(styles.timeLabel)}>Time</span>
              <div
                ref={timeControlRef}
                data-time-control
                onBlur={() => {
                  window.setTimeout(() => {
                    if (!timeControlRef.current?.contains(document.activeElement)) {
                      setTimePanelOpen(false);
                    }
                  });
                }}
                {...stylex.props(styles.timeControl)}
              >
                <button
                  type="button"
                  aria-label="Select time"
                  aria-expanded={timePanelOpen}
                  onClick={() => setTimePanelOpen((current) => !current)}
                  {...stylex.props(styles.timeToggle)}
                >
                  {hoursValue}:{minutesValue}
                </button>
                {timePanelOpen && (
                  <div role="group" aria-label="Select time" {...stylex.props(styles.timePanel)}>
                    <div role="listbox" aria-label="Hour" {...stylex.props(styles.timeColumn)}>
                      {hours.map((hour) => (
                        <button
                          type="button"
                          key={hour}
                          role="option"
                          aria-selected={hour === hoursValue}
                          onClick={() => updateTime(hour, minutesValue)}
                          {...stylex.props(
                            styles.timeOption,
                            hour === hoursValue && styles.timeOptionSelected,
                          )}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                    <span aria-hidden="true" {...stylex.props(styles.timeSeparator)}>
                      :
                    </span>
                    <div role="listbox" aria-label="Minute" {...stylex.props(styles.timeColumn)}>
                      {minutes.map((minute) => (
                        <button
                          type="button"
                          key={minute}
                          role="option"
                          aria-selected={minute === minutesValue}
                          onClick={() => updateTime(hoursValue, minute)}
                          {...stylex.props(
                            styles.timeOption,
                            minute === minutesValue && styles.timeOptionSelected,
                          )}
                        >
                          {minute}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
