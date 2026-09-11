import type { SessionAttendance, Student } from '../types';

export type AttendanceSummary = {
  activeStudents: number;
  uniqueStudents: number;
  totalVisits: number;
};

export const getRecentAttendance = (attendance: SessionAttendance[]) =>
  [...attendance].sort((a, b) => b.attendedAt.localeCompare(a.attendedAt));

export const getAttendanceSummary = (students: Student[], attendance: SessionAttendance[]) => ({
  activeStudents: students.filter((student) => student.status === 'active').length,
  uniqueStudents: new Set(attendance.map((entry) => entry.studentId)).size,
  totalVisits: attendance.length,
});
