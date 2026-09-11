import { SearchMoonPhase } from 'astronomy-engine';

export type MoonDayType = 'new_moon' | 'full_moon';

export type MoonDay = {
  type: MoonDayType;
  eventTimeUtc: string;
  eventTimeLocal: string;
  localDate: string;
  timezone: string;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const PHASES: ReadonlyArray<{ type: MoonDayType; longitude: number }> = [
  { type: 'new_moon', longitude: 0 },
  { type: 'full_moon', longitude: 180 },
];

export function isValidYear(year: number) {
  return Number.isInteger(year) && year >= 1 && year <= 9999;
}

export function isValidTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

function utcStartOfYear(year: number) {
  const date = new Date(0);
  date.setUTCFullYear(year, 0, 1);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getDateTimeParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    calendar: 'iso8601',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    numberingSystem: 'latn',
    second: '2-digit',
    timeZone: timezone,
    year: 'numeric',
  }).formatToParts(date);

  return Object.fromEntries(parts.map(({ type, value }) => [type, value])) as Record<
    string,
    string
  >;
}

function getTimezoneOffset(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    timeZone: timezone,
    timeZoneName: 'longOffset',
  }).formatToParts(date);
  const offset = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';
  return offset === 'GMT' ? '+00:00' : offset.replace('GMT', '');
}

function formatLocalDateTime(date: Date, timezone: string) {
  const parts = getDateTimeParts(date, timezone);
  const localDate = `${parts.year}-${parts.month}-${parts.day}`;
  const localTime = `${parts.hour}:${parts.minute}:${parts.second}`;
  return {
    eventTimeLocal: `${localDate}T${localTime}${getTimezoneOffset(date, timezone)}`,
    localDate,
  };
}

function findPhaseEvents(year: number, timezone: string, longitude: number, type: MoonDayType) {
  const scanStart = new Date(utcStartOfYear(year).getTime() - 2 * DAY_IN_MS);
  const scanEnd = new Date(utcStartOfYear(year + 1).getTime() + 2 * DAY_IN_MS);
  const events: MoonDay[] = [];
  let cursor = scanStart;

  while (cursor < scanEnd) {
    const event = SearchMoonPhase(longitude, cursor, 40);
    if (!event || event.date > scanEnd) break;

    const local = formatLocalDateTime(event.date, timezone);
    if (local.localDate.startsWith(`${year}-`)) {
      events.push({
        type,
        eventTimeUtc: event.date.toISOString(),
        eventTimeLocal: local.eventTimeLocal,
        localDate: local.localDate,
        timezone,
      });
    }

    cursor = new Date(event.date.getTime() + 1000);
  }

  return events;
}

export function getMoonDays(year: number, timezone: string): MoonDay[] {
  if (!isValidYear(year)) throw new Error('Invalid year');
  if (!isValidTimezone(timezone)) throw new Error('Invalid timezone');

  return PHASES.flatMap(({ longitude, type }) =>
    findPhaseEvents(year, timezone, longitude, type),
  ).sort((a, b) => Date.parse(a.eventTimeUtc) - Date.parse(b.eventTimeUtc));
}
