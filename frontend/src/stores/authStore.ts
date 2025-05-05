// Zustand store pentru autentificare cu Supabase
// OWNER: echipa API & FE
// Orice modificare trebuie documentată în DEV_LOG.md
import { create } from 'zustand';
import { supabaseAuthService } from '../services/supabaseAuthService';

import type { AuthUser, AuthErrorType } from '../services/supabaseAuthService';

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  errorType?: AuthErrorType;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  errorType: undefined,

  login: async (email, password) => {
    set({ loading: true, error: null, errorType: undefined });
    const result = await supabaseAuthService.login(email, password);
    set({ user: result.user, error: result.error, errorType: result.errorType, loading: false });
  },

  register: async (email, password) => {
    set({ loading: true, error: null, errorType: undefined });
    const result = await supabaseAuthService.register(email, password);
    set({ user: result.user, error: result.error, errorType: result.errorType, loading: false });
  },

  logout: async () => {
    set({ loading: true, error: null });
    await supabaseAuthService.logout();
    set({ user: null, loading: false });
  },

  checkUser: async () => {
    set({ loading: true });
    const user = await supabaseAuthService.getCurrentUser();
    set({ user, loading: false });
  },
}));
