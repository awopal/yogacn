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
  email?: string;
  phoneNumber?: string;
  gender?: 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';
  preferredClassLevel?: Level;
  preferredYogaType?: string;
  preferredClassTiming?: string[];
  specificTimingNotes?: string;
  primaryGoals?: string[];
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
};

export type StudentObservation = {
  id: string;
  studentId: string;
  observation: string;
  createdAt: string;
  createdBy: string;
};

export type SessionAttendance = {
  id: string;
  studentId: string;
  studentName: string;
  classTitle: string;
  attendedAt: string;
};
