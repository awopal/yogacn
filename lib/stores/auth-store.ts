'use client';

import { create } from 'zustand';

export type UserRole = 'teacher' | 'student' | 'admin';
type AuthState = {
  userId: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  setSession: (session: { userId: string; role: UserRole; onboardingComplete?: boolean }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  isAuthenticated: false,
  onboardingComplete: false,
  setSession: ({ userId, role, onboardingComplete = false }) =>
    set({ userId, role, isAuthenticated: true, onboardingComplete }),
  clearSession: () =>
    set({ userId: null, role: null, isAuthenticated: false, onboardingComplete: false }),
}));
