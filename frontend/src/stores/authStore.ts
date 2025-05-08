// Zustand store pentru autentificare cu Supabase
// OWNER: echipa API & FE
// Orice modificare trebuie documentată în DEV_LOG.md
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

// Inițializare store cu middleware de persistență conform recomandărilor din BEST_PRACTICES.md
export const useAuthStore = create(
  persist(
    (set) => ({
  user: null,
  loading: false,
  error: null,
  errorType: undefined,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null, errorType: undefined });
    const result = await supabaseAuthService.login(email, password);
    set({ user: result.user, error: result.error, errorType: result.errorType, loading: false });
  },

  register: async (email: string, password: string) => {
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
}),
    {
      name: 'auth-storage', // Numele cheii în localStorage
      partialize: (state: AuthState) => ({ user: state.user }),
    }
  )
);

// Verificăm automat sesiunea la pornirea aplicației
supabaseAuthService.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    // Actualizăm starea cu user-ul nou autentificat
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email || '',
      },
      loading: false,
      error: null,
    });
  } else if (event === 'SIGNED_OUT') {
    // Resetăm starea la delogare
    useAuthStore.setState({
      user: null,
      loading: false,
      error: null,
    });
  }
});
