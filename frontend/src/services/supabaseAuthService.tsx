// Serviciu pentru autentificare cu Supabase
// OWNER: echipa API & FE
// Orice modificare trebuie documentată în DEV_LOG.md

import { supabase } from "./supabase";
import { MESAJE } from "@budget-app/shared-constants/messages";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

// Tip user autenticat
export interface AuthUser {
  id: string;
  email: string;
  // Adaugă alte câmpuri relevante dacă e nevoie
}

// Enum categorii erori autentificare
export enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  NETWORK = "NETWORK",
  RLS_DENIED = "RLS_DENIED",
  PASSWORD_WEAK = "PASSWORD_WEAK",
  UNKNOWN = "UNKNOWN",
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    let errorType: AuthErrorType | undefined = undefined;
    let user: AuthUser | null = null;
    if (data?.user) {
      user = {
        id: data.user.id,
        email: data.user.email || "",
      };
    }
    if (error) {
      if (error.message?.toLowerCase().includes("invalid login credentials")) {
        errorType = AuthErrorType.INVALID_CREDENTIALS;
      } else if (error.message?.toLowerCase().includes("row-level security")) {
        errorType = AuthErrorType.RLS_DENIED;
      } else if (error.message?.toLowerCase().includes("network")) {
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
    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return {
        user: null,
        error: MESAJE.PAROLA_PREA_SLABA,
        errorType: AuthErrorType.PASSWORD_WEAK,
      };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    let errorType: AuthErrorType | undefined = undefined;
    let user: AuthUser | null = null;
    if (data?.user) {
      user = {
        id: data.user.id,
        email: data.user.email || "",
      };
    }
    if (error) {
      if (error.message?.toLowerCase().includes("password")) {
        errorType = AuthErrorType.PASSWORD_WEAK;
      } else if (error.message?.toLowerCase().includes("network")) {
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
          email: data.user.email || "",
        } as AuthUser;
      }
      return null;
    });
  },

  /**
   * Îndică Supabase să asculte schimbările de autentificare
   * Returnează un cleanup pentru a opri ascultarea când nu mai e nevoie
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    // Supabase.auth.onAuthStateChange ascultă schimbările de sesiune
    const { data } = supabase.auth.onAuthStateChange(callback);

    // Verificăm imediat sesiunea curentă pentru a actualiza starea la refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        callback("SIGNED_IN", session);
      }
    });

    // Funcția de unsibscribe
    return data.subscription.unsubscribe;
  },
};
