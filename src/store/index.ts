import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'trustwrite-auth' }
  )
);

// ─── Theme Store ──────────────────────────────────────────────────────────────

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
          }
          return { theme: next };
        }),
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        set({ theme });
      },
    }),
    { name: 'trustwrite-theme' }
  )
);

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

// ─── Essay Store ──────────────────────────────────────────────────────────────

interface EssayStore {
  uploadedFile: File | null;
  pastedText: string;
  setUploadedFile: (file: File | null) => void;
  setPastedText: (text: string) => void;
  clearEssay: () => void;
}

export const useEssayStore = create<EssayStore>()((set) => ({
  uploadedFile: null,
  pastedText: '',
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setPastedText: (text) => set({ pastedText: text }),
  clearEssay: () => set({ uploadedFile: null, pastedText: '' }),
}));

// Helper to get role-based redirect
export function getRoleDefaultPath(role: UserRole): string {
  switch (role) {
    case 'student': return '/student';
    case 'faculty': return '/faculty';
    case 'admin': return '/admin';
  }
}
