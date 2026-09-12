export type PlanStatus = 'draft' | 'ready' | 'taught';
export type Level = 'beginner' | 'all_levels' | 'intermediate' | 'advanced';

export type ClassPlan = {
  id: string;
  title: string;
  intention: string;
  level: Level;
  plannedDurationMinutes: number;
  peakPose: string;
  status: PlanStatus;
  isPublished: boolean;
  taughtCount: number;
  latestAdjustment?: string;
  lastTaughtAt: Date;
  description?: string;
  sections?: import('@/lib/stores/class-builder-store').ClassBuilderSection[];
};

export type Student = {
  id: string;
  displayName: string;
  note: string;
  status: 'active' | 'archived';
};

export type SessionAttendance = {
  id: string;
  studentId: string;
  studentName: string;
  classTitle: string;
  attendedAt: string;
};
