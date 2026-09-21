import type { Yogi } from './types';

export type YogiFormValues = {
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

export type YogiFormErrors = Partial<Record<'name' | 'email' | 'phoneNumber', string>>;

export const timings = ['Morning', 'Evening', 'Weekdays', 'Weekends'];
export const goals = ['Build strength', 'Improve flexibility', 'Reduce stress', 'Better balance'];

export const emptyYogiForm: YogiFormValues = {
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

export function yogiToForm(yogi: Yogi): YogiFormValues {
  return {
    name: yogi.displayName,
    email: yogi.email ?? '',
    phoneNumber: yogi.phoneNumber ?? '',
    gender: yogi.gender ?? '',
    notes: yogi.note ?? '',
    preferredClassLevel: yogi.preferredClassLevel ?? '',
    preferredYogaType: yogi.preferredYogaType ?? '',
    preferredClassTiming: yogi.preferredClassTiming ?? [],
    specificTimingNotes: yogi.specificTimingNotes ?? '',
    primaryGoals: yogi.primaryGoals ?? [],
    fitnessLevel: yogi.fitnessLevel ?? '',
  };
}

export function validateYogiForm(form: YogiFormValues): YogiFormErrors {
  const errors: YogiFormErrors = {};
  if (!form.name.trim()) errors.name = 'กรุณากรอกชื่อ-นามสกุล';
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
  }
  if (form.phoneNumber.trim() && !/^\+?[\d\s().-]{7,20}$/.test(form.phoneNumber.trim())) {
    errors.phoneNumber = 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง';
  }
  return errors;
}

export function formToYogi(form: YogiFormValues, existing?: Yogi): Yogi {
  return {
    id: existing?.id ?? `yogi-${Date.now()}`,
    displayName: form.name.trim(),
    note: form.notes.trim(),
    status: existing?.status ?? 'active',
    email: form.email.trim() || undefined,
    phoneNumber: form.phoneNumber.trim() || undefined,
    gender: (form.gender || undefined) as Yogi['gender'],
    preferredClassLevel: (form.preferredClassLevel || undefined) as Yogi['preferredClassLevel'],
    preferredYogaType: form.preferredYogaType.trim() || undefined,
    preferredClassTiming: form.preferredClassTiming.length ? form.preferredClassTiming : undefined,
    specificTimingNotes: form.specificTimingNotes.trim() || undefined,
    primaryGoals: form.primaryGoals.length ? form.primaryGoals : undefined,
    fitnessLevel: (form.fitnessLevel || undefined) as Yogi['fitnessLevel'],
  };
}
