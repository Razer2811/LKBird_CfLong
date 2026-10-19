import { create } from 'zustand';
import { getStoredAuth } from '@/lib/storage';

type AuthState = {
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setSession: (payload: { username: string; accessToken: string; refreshToken: string; role?: string | null }) => void;
  clearSession: () => void;
  hydrateSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  role: null,
  isAuthenticated: false,
  setSession: ({ username, accessToken, refreshToken, role = null }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    if (role) {
      localStorage.setItem('role', role);
    }
    set({ username, role, isAuthenticated: true });
  },
  clearSession: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    set({ username: null, role: null, isAuthenticated: false });
  },
  hydrateSession: () => {
    const { username, role, accessToken, refreshToken } = getStoredAuth();

    if (username && accessToken && refreshToken) {
      set({ username, role, isAuthenticated: true });
      return;
    }

    set({ username: null, role: null, isAuthenticated: false });
  },
}));