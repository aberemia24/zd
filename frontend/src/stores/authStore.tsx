// Zustand store pentru autentificare cu Supabase
// OWNER: echipa API & FE
// Orice modificare trebuie documentată în DEV_LOG.md
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { supabaseAuthService } from "../services/supabaseAuthService";
import type { AuthUser, AuthErrorType } from "../services/supabaseAuthService";
import {
  BaseStoreState,
  BaseStoreActions,
  storeLogger,
  createDevtoolsOptions,
  createAsyncAction,
  createPersistConfig,
} from "./storeUtils";

/**
 * Interface pentru Auth Store cu pattern-uri standardizate
 */
export interface AuthState extends BaseStoreState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  errorType?: AuthErrorType;

  // Acțiuni async standardizate
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;

  // Acțiuni sync
  clearAuthError: () => void;
  setUser: (user: AuthUser | null) => void;
}

const STORE_NAME = "AuthStore";

/**
 * Store pentru autentificare cu pattern-uri moderne Zustand
 * Integrare cu Supabase Auth și persistență optimizată
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => {
        // Helper pentru setări standardizate
        const setLoading = (loading: boolean) => {
          set({ loading, lastUpdated: new Date() }, false, "setLoading");
        };

        const setError = (error: string | null, errorType?: AuthErrorType) => {
          set({ error, errorType, lastUpdated: new Date() }, false, "setError");
          if (error) {
            storeLogger.error(STORE_NAME, "Auth Error", { error, errorType });
          }
        };

        // Creăm acțiuni async standardizate
        const createAuthAction = <T extends any[]>(
          actionName: string,
          action: (...args: T) => Promise<any>,
        ) =>
          createAsyncAction(
            STORE_NAME,
            actionName,
            action,
            setLoading,
            setError,
          );

        return {
          // State inițial
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          errorType: undefined,
          lastUpdated: new Date(),

          // Acțiuni async cu error handling standardizat
          login: createAuthAction(
            "login",
            async (email: string, password: string) => {
              const result = await supabaseAuthService.login(email, password);

              if (result.error) {
                setError(result.error, result.errorType);
                throw new Error(result.error);
              }

              set(
                {
                  user: result.user,
                  isAuthenticated: !!result.user,
                  error: null,
                  errorType: undefined,
                  lastUpdated: new Date(),
                },
                false,
                "login_success",
              );

              storeLogger.info(STORE_NAME, "Login successful", {
                userId: result.user?.id,
              });
            },
          ),

          register: createAuthAction(
            "register",
            async (email: string, password: string) => {
              const result = await supabaseAuthService.register(
                email,
                password,
              );

              if (result.error) {
                setError(result.error, result.errorType);
                throw new Error(result.error);
              }

              set(
                {
                  user: result.user,
                  isAuthenticated: !!result.user,
                  error: null,
                  errorType: undefined,
                  lastUpdated: new Date(),
                },
                false,
                "register_success",
              );

              storeLogger.info(STORE_NAME, "Registration successful", {
                userId: result.user?.id,
              });
            },
          ),

          logout: createAuthAction("logout", async () => {
            await supabaseAuthService.logout();

            set(
              {
                user: null,
                isAuthenticated: false,
                error: null,
                errorType: undefined,
                lastUpdated: new Date(),
              },
              false,
              "logout_success",
            );

            storeLogger.info(STORE_NAME, "Logout successful");
          }),

          checkUser: createAuthAction("checkUser", async () => {
            const user = await supabaseAuthService.getCurrentUser();

            set(
              {
                user,
                isAuthenticated: !!user,
                error: null,
                lastUpdated: new Date(),
              },
              false,
              "checkUser_success",
            );

            storeLogger.info(STORE_NAME, "User check completed", {
              isAuthenticated: !!user,
              userId: user?.id,
            });
          }),

          // Acțiuni sync standardizate
          clearAuthError: () => {
            set({ error: null, errorType: undefined }, false, "clearAuthError");
            storeLogger.info(STORE_NAME, "Auth error cleared");
          },

          setUser: (user: AuthUser | null) => {
            set(
              {
                user,
                isAuthenticated: !!user,
                lastUpdated: new Date(),
              },
              false,
              "setUser",
            );
            storeLogger.info(STORE_NAME, "User set manually", {
              userId: user?.id,
            });
          },

          // Implementăm base actions
          setLoading,
          setError: (error: string | null) => setError(error),
          clearError: () => setError(null),
          reset: () => {
            set(
              {
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
                errorType: undefined,
                lastUpdated: new Date(),
              },
              false,
              "reset",
            );
            storeLogger.info(STORE_NAME, "Store reset");
          },
        };
      },
      createPersistConfig("auth", (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      })),
    ),
    createDevtoolsOptions(STORE_NAME),
  ),
);

// Configurare listener pentru schimbări de autentificare
supabaseAuthService.onAuthStateChange((event, session) => {
  const currentState = useAuthStore.getState();

  storeLogger.info(STORE_NAME, "Auth state change", {
    event,
    sessionExists: !!session,
  });

  if (event === "SIGNED_IN" && session?.user) {
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email || "",
      },
      isAuthenticated: true,
      loading: false,
      error: null,
      errorType: undefined,
      lastUpdated: new Date(),
    });
  } else if (event === "SIGNED_OUT") {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      errorType: undefined,
      lastUpdated: new Date(),
    });
  }
});

// Selectori optimizați pentru performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () =>
  useAuthStore((state) => ({
    error: state.error,
    errorType: state.errorType,
  }));
