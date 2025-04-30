// Serviciu pentru autentificare cu Supabase
// OWNER: echipa API & FE
// Orice modificare trebuie documentată în DEV_LOG.md

import { supabase } from './supabase';

export interface AuthResult {
  user: any | null;
  error: string | null;
}

export const supabaseAuthService = {
  /**
   * Login cu email și parolă
   */
  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return {
      user: data?.user || null,
      error: error?.message || null,
    };
  },

  /**
   * Înregistrare cont nou
   */
  async register(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return {
      user: data?.user || null,
      error: error?.message || null,
    };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Returnează user-ul curent (sau null)
   */
  getCurrentUser() {
    return supabase.auth.getUser().then(({ data }) => data?.user || null);
  },
};
