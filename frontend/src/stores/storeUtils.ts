import { StateCreator } from "zustand";
import { DevtoolsOptions } from "zustand/middleware";

/**
 * Interfață standard pentru toate store-urile cu pattern-uri comune
 */
export interface BaseStoreState {
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

/**
 * Acțiuni standard pentru toate store-urile
 */
export interface BaseStoreActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Pattern standard pentru logging în stores
 */
export const storeLogger = {
  info: (storeName: string, action: string, data?: unknown) => {
    if (import.meta.env.NODE_ENV === "development") {
      console.log(`[${storeName}] ${action}`, data);
    }
  },

  error: (storeName: string, action: string, error: unknown) => {
    console.error(`[${storeName}] Error in ${action}:`, error);
  },

  warn: (storeName: string, message: string, data?: unknown) => {
    console.warn(`[${storeName}] ${message}`, data);
  },
};

/**
 * Configurare standard pentru devtools
 */
export const createDevtoolsOptions = (storeName: string): DevtoolsOptions => ({
  name: storeName,
  enabled: import.meta.env.NODE_ENV === "development",
  serialize: true,
  anonymousActionType: `${storeName}_action`,
});

/**
 * Creează acțiuni de bază standardizate pentru orice store
 */
export const createBaseActions = <T extends BaseStoreState>(
  storeName: string,
  initialState: Omit<T, keyof BaseStoreActions>,
): Pick<
  BaseStoreActions,
  "setLoading" | "setError" | "clearError" | "reset"
> => ({
  setLoading: (loading: boolean) => {
    storeLogger.info(storeName, "setLoading", { loading });
  },

  setError: (error: string | null) => {
    if (error) {
      storeLogger.error(storeName, "setError", error);
    } else {
      storeLogger.info(storeName, "clearError");
    }
  },

  clearError: () => {
    storeLogger.info(storeName, "clearError");
  },

  reset: () => {
    storeLogger.info(storeName, "reset");
  },
});

/**
 * Selector optimizat cu shallow comparison pentru performanță
 */
export const createShallowSelector = <T, U>(selector: (state: T) => U) => {
  let lastState: U;
  let lastTime = 0;

  return (state: T): U => {
    const newState = selector(state);
    const now = Date.now();

    // Cache result for 16ms (one frame) pentru performanță
    if (now - lastTime < 16 && shallowEqual(lastState, newState)) {
      return lastState;
    }

    lastState = newState;
    lastTime = now;
    return newState;
  };
};

/**
 * Comparație shallow pentru optimizare selectori
 */
export const shallowEqual = <T>(a: T, b: T): boolean => {
  if (Object.is(a, b)) {
    return true;
  }

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Wrapper pentru async actions cu error handling standard
 */
export const createAsyncAction = <T extends unknown[], R>(
  storeName: string,
  actionName: string,
  action: (...args: T) => Promise<R>,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      storeLogger.info(storeName, `${actionName} started`, args);
      setLoading(true);
      setError(null);

      const result = await action(...args);

      storeLogger.info(storeName, `${actionName} completed`, result);
      setLoading(false);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      storeLogger.error(storeName, actionName, error);
      setError(errorMessage);
      setLoading(false);

      return null;
    }
  };
};

/**
 * Utilitară pentru persistence config standard
 */
export const createPersistConfig = <T>(
  storeName: string,
  partialize?: (state: T) => Partial<T>,
) => ({
  name: `${storeName}-storage`,
  version: 1,
  migrate: (persistedState: unknown, version: number) => {
    storeLogger.info(storeName, "migrate storage", { version, persistedState });
    return persistedState;
  },
  partialize,
});

/**
 * Validation helper pentru store state
 */
export const validateStoreState = <T>(
  storeName: string,
  state: T,
  requiredKeys: (keyof T)[],
): boolean => {
  for (const key of requiredKeys) {
    if (state[key] === undefined || state[key] === null) {
      storeLogger.warn(storeName, `Missing required state key: ${String(key)}`);
      return false;
    }
  }
  return true;
};

/**
 * Debounced action pentru performanță
 */
export const createDebouncedAction = <T extends unknown[]>(
  action: (...args: T) => void,
  delay: number = 300,
) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => action(...args), delay);
  };
};
