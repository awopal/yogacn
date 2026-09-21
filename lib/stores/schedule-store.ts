'use client';

import { create } from 'zustand';
import type { ClassStatus, ClassType } from '@/lib/schedule';

export type ScheduleForm = {
  title: string;
  classPlanId: string;
  type: ClassType;
  status: ClassStatus;
  start: string;
  end: string;
  yogiIds: string[];
  note: string;
  recurring: boolean;
};

export const emptyScheduleForm: ScheduleForm = {
  title: '',
  classPlanId: '',
  type: 'Vinyasa',
  status: 'scheduled',
  start: '',
  end: '',
  yogiIds: [],
  note: '',
  recurring: false,
};

type ScheduleState = {
  selectedDate: string;
  calendarView: 'timeGridWeek' | 'dayGridMonth' | 'timeGridDay' | 'listWeek';
  selectedTimeSlot: string | null;
  typeFilter: ClassType | 'all';
  statusFilter: ClassStatus | 'all';
  yogiFilter: string;
  dateFilter: string;
  draft: ScheduleForm | null;
  editingId: string | null;
  attendanceId: string | null;
  conflictIds: string[];
  openNew: (form: ScheduleForm) => void;
  openEdit: (id: string, form: ScheduleForm) => void;
  setDraft: (draft: ScheduleForm) => void;
  setFilter: <K extends 'typeFilter' | 'statusFilter' | 'yogiFilter' | 'dateFilter'>(
    key: K,
    value: ScheduleState[K],
  ) => void;
  setCalendarView: (view: ScheduleState['calendarView']) => void;
  setSelectedDate: (date: string) => void;
  setAttendanceId: (id: string | null) => void;
  setConflictIds: (ids: string[]) => void;
  closeDraft: () => void;
  resetFilters: () => void;
  reset: () => void;
};

const initialState = {
  selectedDate: '',
  calendarView: 'timeGridWeek' as const,
  selectedTimeSlot: null,
  typeFilter: 'all' as const,
  statusFilter: 'all' as const,
  yogiFilter: 'all',
  dateFilter: '',
  draft: null,
  editingId: null,
  attendanceId: null,
  conflictIds: [] as string[],
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  ...initialState,
  openNew: (draft) => set({ draft, editingId: null }),
  openEdit: (editingId, draft) => set({ draft, editingId }),
  setDraft: (draft) => set({ draft }),
  setFilter: (key, value) => set({ [key]: value }),
  setCalendarView: (calendarView) => set({ calendarView }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setAttendanceId: (attendanceId) => set({ attendanceId }),
  setConflictIds: (conflictIds) => set({ conflictIds }),
  closeDraft: () => set({ draft: null, editingId: null }),
  resetFilters: () =>
    set({ typeFilter: 'all', statusFilter: 'all', yogiFilter: 'all', dateFilter: '' }),
  reset: () => set(initialState),
}));
