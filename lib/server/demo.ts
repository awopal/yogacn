import type { ClassPlan, SessionAttendance, Student } from '../types';

export const demoPlans: ClassPlan[] = [
  {
    id: 'core-control',
    title: 'Core & Control',
    intention: 'Steady from the center',
    level: 'intermediate',
    plannedDurationMinutes: 60,
    peakPose: 'Navasana',
    status: 'ready',
    taughtCount: 3,
    latestAdjustment: 'Add a Forearm Plank option and reduce Chaturanga rounds',
    lastTaughtAt: new Date('2026-08-28T10:00:00Z'),
  },
  {
    id: 'hanumanasana-flow',
    title: 'Hanumanasana Flow',
    intention: 'Progress gradually',
    level: 'intermediate',
    plannedDurationMinutes: 75,
    peakPose: 'Hanumanasana',
    status: 'draft',
    taughtCount: 1,
    latestAdjustment: 'Introduce blocks during peak-pose preparation',
    lastTaughtAt: new Date('2026-08-28T10:00:00Z'),
  },
  {
    id: 'gentle-balance',
    title: 'Gentle Balance',
    intention: 'Balance with ease',
    level: 'all_levels',
    plannedDurationMinutes: 45,
    peakPose: 'Tree Pose',
    status: 'taught',
    taughtCount: 5,
    latestAdjustment: 'Keep the balance work spacious and unhurried',
    lastTaughtAt: new Date('2026-08-28T10:00:00Z'),
  },
];

export const demoStudents: Student[] = [
  {
    id: 'ann',
    displayName: 'Ann',
    note: 'Prefers clear, progressive instructions',
    status: 'active',
  },
  {
    id: 'mali',
    displayName: 'Mali',
    note: 'Practices consistently twice a week',
    status: 'active',
  },
];

export const demoAttendance: SessionAttendance[] = [
  {
    id: 'visit-ann',
    studentId: 'ann',
    studentName: 'Ann',
    classTitle: 'Core & Control',
    attendedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'visit-mali',
    studentId: 'mali',
    studentName: 'Mali',
    classTitle: 'Core & Control',
    attendedAt: '2026-08-28T10:00:00Z',
  },
];
