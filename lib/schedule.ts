export type ClassStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';
export type ClassType = 'Vinyasa' | 'Gentle' | 'Private' | 'Workshop';

export type ScheduleClass = {
  id: string;
  classPlanId?: string;
  title: string;
  type: ClassType;
  status: ClassStatus;
  start: string;
  end: string;
  yogis: string[];
  note: string;
  attendance: Record<string, 'present' | 'absent'>;
  color: string;
  recurring?: boolean;
};

const colors: Record<ClassType, string> = {
  Vinyasa: '#ff6e6c',
  Gentle: '#57bc68',
  Private: '#8b6fb6',
  Workshop: '#e7b83e',
};

const isoAt = (date: Date, hour: number, minute = 0) => {
  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result.toISOString();
};

const nextWeekday = (weekday: number, hour: number, duration: number) => {
  const date = new Date();
  const distance = (weekday - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + distance);
  return {
    start: isoAt(date, hour),
    end: isoAt(
      new Date(date.getTime() + duration * 60_000),
      hour + Math.floor(duration / 60),
      duration % 60,
    ),
  };
};

const monday = nextWeekday(1, 18, 60);
const wednesday = nextWeekday(3, 7, 45);
const saturday = nextWeekday(6, 10, 90);

export const demoScheduleClasses: ScheduleClass[] = [
  {
    id: 'schedule-monday',
    title: 'Strong & Steady',
    type: 'Vinyasa',
    status: 'scheduled',
    ...monday,
    yogis: ['ann', 'mali'],
    note: '',
    attendance: {},
    color: colors.Vinyasa,
    recurring: true,
  },
  {
    id: 'schedule-wednesday',
    title: 'Morning Reset',
    type: 'Gentle',
    status: 'scheduled',
    ...wednesday,
    yogis: ['mali'],
    note: '',
    attendance: {},
    color: colors.Gentle,
  },
  {
    id: 'schedule-saturday',
    title: 'Weekend Flow Workshop',
    type: 'Workshop',
    status: 'scheduled',
    ...saturday,
    yogis: ['ann', 'mali'],
    note: '',
    attendance: {},
    color: colors.Workshop,
  },
];

export const classTypeColors = colors;

const STORAGE_KEY = 'yogacn:class-schedule';

export const scheduleService = {
  load(): ScheduleClass[] {
    if (typeof window === 'undefined') return demoScheduleClasses;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as ScheduleClass[]) : demoScheduleClasses;
    } catch {
      return demoScheduleClasses;
    }
  },
  save(classes: ScheduleClass[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  },
};
