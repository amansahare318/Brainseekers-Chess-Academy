import { create } from 'zustand';
import { apiRequest } from '@/lib/api';
import { clearSession, getStoredToken, persistSession, getMustChangePassword } from '@/lib/session';
import type { SessionRole } from '@/types/academy';

export interface AuthUser {
  id: string;
  email?: string;
  mobile?: string;
  role: SessionRole;
  name?: string;
  mustChangePassword: boolean;
  profileRef?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  login: (input: {
    email?: string;
    mobile?: string;
    password: string;
    role: SessionRole;
  }) => Promise<AuthUser>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ isHydrated: true, token: null, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const data = await apiRequest<{ user: AuthUser }>('/api/auth/me', { token });
      set({
        user: data.user,
        token,
        isHydrated: true,
        isLoading: false,
      });
    } catch {
      clearSession();
      set({ user: null, token: null, isHydrated: true, isLoading: false });
    }
  },

  login: async ({ email, mobile, password, role }) => {
    set({ isLoading: true });
    try {
      const data = await apiRequest<{ token: string; user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, mobile, password, role },
      });

      persistSession({
        token: data.token,
        role: data.user.role,
        userId: data.user.id,
        mustChangePassword: data.user.mustChangePassword,
      });

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
        isHydrated: true,
      });

      return data.user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null });
  },

  changePassword: async (currentPassword, newPassword) => {
    const token = get().token || getStoredToken();
    if (!token) throw new Error('Not authenticated');

    const data = await apiRequest<{ token: string; user: AuthUser }>('/api/auth/change-password', {
      method: 'POST',
      token,
      body: { currentPassword, newPassword },
    });

    persistSession({
      token: data.token,
      role: data.user.role,
      userId: data.user.id,
      mustChangePassword: false,
    });

    set({ user: data.user, token: data.token });
  },
}));

export const authMustChangePassword = () => getMustChangePassword();
