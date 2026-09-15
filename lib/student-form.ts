import type { Student } from './types';

export type StudentFormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  notes: string;
  preferredClassLevel: string;
  preferredYogaType: string;
  preferredClassTiming: string[];
  specificTimingNotes: string;
  primaryGoals: string[];
  fitnessLevel: string;
};

export type StudentFormErrors = Partial<Record<'name' | 'email' | 'phoneNumber', string>>;

export const timings = ['Morning', 'Evening', 'Weekdays', 'Weekends'];
export const goals = ['Build strength', 'Improve flexibility', 'Reduce stress', 'Better balance'];

export const emptyStudentForm: StudentFormValues = {
  name: '',
  email: '',
  phoneNumber: '',
  gender: '',
  notes: '',
  preferredClassLevel: '',
  preferredYogaType: '',
  preferredClassTiming: [],
  specificTimingNotes: '',
  primaryGoals: [],
  fitnessLevel: '',
};

export function studentToForm(student: Student): StudentFormValues {
  return {
    name: student.displayName,
    email: student.email ?? '',
    phoneNumber: student.phoneNumber ?? '',
    gender: student.gender ?? '',
    notes: student.note ?? '',
    preferredClassLevel: student.preferredClassLevel ?? '',
    preferredYogaType: student.preferredYogaType ?? '',
    preferredClassTiming: student.preferredClassTiming ?? [],
    specificTimingNotes: student.specificTimingNotes ?? '',
    primaryGoals: student.primaryGoals ?? [],
    fitnessLevel: student.fitnessLevel ?? '',
  };
}

export function validateStudentForm(form: StudentFormValues): StudentFormErrors {
  const errors: StudentFormErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อ-นามสกุล';
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
  }
  if (form.phoneNumber.trim() && !/^\+?[\d\s().-]{7,20}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง';
  }
  return errors;
}

export function formToStudent(form: StudentFormValues, existing?: Student): Student {
  return {
    id: existing?.id ?? `student-${Date.now()}`,
    displayName: form.name.trim(),
    note: form.notes.trim(),
    status: existing?.status ?? 'active',
    email: form.email.trim() || undefined,
    phoneNumber: form.phoneNumber.trim() || undefined,
    gender: (form.gender || undefined) as Student['gender'],
    preferredClassLevel: (form.preferredClassLevel || undefined) as Student['preferredClassLevel'],
    preferredYogaType: form.preferredYogaType.trim() || undefined,
    preferredClassTiming: form.preferredClassTiming.length ? form.preferredClassTiming : undefined,
    specificTimingNotes: form.specificTimingNotes.trim() || undefined,
    primaryGoals: form.primaryGoals.length ? form.primaryGoals : undefined,
    fitnessLevel: (form.fitnessLevel || undefined) as Student['fitnessLevel'],
  };
}
