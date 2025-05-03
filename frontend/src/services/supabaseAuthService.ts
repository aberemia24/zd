// Serviciu pentru autentificare cu Supabase
// OWNER: echipa API & FE
// Orice modificare trebuie documentată în DEV_LOG.md

import { supabase } from './supabase';

// Tip user autenticat
export interface AuthUser {
  id: string;
  email: string;
  // Adaugă alte câmpuri relevante dacă e nevoie
}

// Enum categorii erori autentificare
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NETWORK = 'NETWORK',
  RLS_DENIED = 'RLS_DENIED',
  PASSWORD_WEAK = 'PASSWORD_WEAK',
  UNKNOWN = 'UNKNOWN',
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  errorType?: AuthErrorType;
}

export const supabaseAuthService = {
  /**
   * Login cu email și parolă
   */
  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    let errorType: AuthErrorType | undefined = undefined;
    let user: AuthUser | null = null;
    if (data?.user) {
      user = {
        id: data.user.id,
        email: data.user.email || '',
      };
    }
    if (error) {
      if (error.message?.toLowerCase().includes('invalid login credentials')) {
        errorType = AuthErrorType.INVALID_CREDENTIALS;
      } else if (error.message?.toLowerCase().includes('row-level security')) {
        errorType = AuthErrorType.RLS_DENIED;
      } else if (error.message?.toLowerCase().includes('network')) {
        errorType = AuthErrorType.NETWORK;
      } else {
        errorType = AuthErrorType.UNKNOWN;
      }
    }
    return {
      user,
      error: error?.message || null,
      errorType,
    };
  },

  /**
   * Înregistrare cont nou
   */
  async register(email: string, password: string): Promise<AuthResult> {
    // Validare parolă minimă
    if (!password || password.length < 8 ||
      !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)
    ) {
      return {
        user: null,
        error: 'Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.',
        errorType: AuthErrorType.PASSWORD_WEAK,
      };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    let errorType: AuthErrorType | undefined = undefined;
    let user: AuthUser | null = null;
    if (data?.user) {
      user = {
        id: data.user.id,
        email: data.user.email || '',
      };
    }
    if (error) {
      if (error.message?.toLowerCase().includes('password')) {
        errorType = AuthErrorType.PASSWORD_WEAK;
      } else if (error.message?.toLowerCase().includes('network')) {
        errorType = AuthErrorType.NETWORK;
      } else {
        errorType = AuthErrorType.UNKNOWN;
      }
    }
    return {
      user,
      error: error?.message || null,
      errorType,
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
    return supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        return {
          id: data.user.id,
          email: data.user.email || '',
        } as AuthUser;
      }
      return null;
    });
  },
};
