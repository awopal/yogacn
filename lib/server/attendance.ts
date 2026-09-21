import type { SessionAttendance, Yogi } from '../types';

export type AttendanceSummary = {
  activeYogis: number;
  uniqueYogis: number;
  totalVisits: number;
};

export const getRecentAttendance = (attendance: SessionAttendance[]) =>
  [...attendance].sort((a, b) => b.attendedAt.localeCompare(a.attendedAt));

export const getAttendanceSummary = (yogis: Yogi[], attendance: SessionAttendance[]) => ({
  activeYogis: yogis.filter((yogi) => yogi.status === 'active').length,
  uniqueYogis: new Set(attendance.map((entry) => entry.yogiId)).size,
  totalVisits: attendance.length,
});
