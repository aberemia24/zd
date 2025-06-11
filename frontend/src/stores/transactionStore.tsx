// Store minimal pentru UI-state tranzacții
// Majoritatea funcționalităților au fost mutate la hooks/useTransactions utilizand React Query
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { TransactionQueryParamsWithRecurring } from "../types/Transaction";
import { PAGINATION } from "@budget-app/shared-constants";
import {
  BaseStoreState,
  storeLogger,
  createDevtoolsOptions,
} from "./storeUtils";

/**
 * Interface pentru state management tranzacții UI cu pattern-uri moderne
 * Majoritatea funcționalităților de date au fost mutate în React Query (useTransactions hook)
 */
export interface TransactionStateUI extends BaseStoreState {
  /** Parametrii pentru filtrare UI (limit, offset, sort, month, year etc.) */
  currentQueryParams: TransactionQueryParamsWithRecurring;

  /** Setează noii parametri pentru filtrare UI */
  setQueryParams: (
    params: Partial<TransactionQueryParamsWithRecurring>,
  ) => void;

  /** Resetează parametrii de filtrare UI la valorile default */
  resetQueryParams: () => void;

  /** Actualizează un singur parametru */
  updateSingleParam: <K extends keyof TransactionQueryParamsWithRecurring>(
    key: K,
    value: TransactionQueryParamsWithRecurring[K],
  ) => void;
}

const STORE_NAME = "TransactionStore";

const defaultQueryParams: TransactionQueryParamsWithRecurring = {
  limit: PAGINATION.DEFAULT_LIMIT,
  offset: PAGINATION.DEFAULT_OFFSET,
  sort: PAGINATION.DEFAULT_SORT,
  // month și year vor fi setate de componenta care folosește store-ul
  // Asigură-te că tipul permite ca month și year să fie undefined inițial dacă așa e logica
  // month: undefined, // Exemplu explicit, dacă e necesar
  // year: undefined,  // Exemplu explicit, dacă e necesar
};

/**
 * Store minimal pentru state management tranzacții UI cu pattern-uri moderne
 * Majoritatea funcționalităților au fost migrate la React Query prin hook-ul useTransactions
 */
export const useTransactionStore = create<TransactionStateUI>()(
  devtools((set, get) => {
    // Helper pentru logging standardizat
    const logAction = (action: string, data?: Record<string, unknown>) => {
      storeLogger.info(STORE_NAME, action, data);
    };

    return {
      // State inițial cu BaseStoreState
      loading: false,
      error: null,
      lastUpdated: new Date(),

      // State UI pentru filtrare și parametri de interogare
      currentQueryParams: defaultQueryParams,

      // Metode UI pentru manipularea parametrilor
      setQueryParams: (
        params: Partial<TransactionQueryParamsWithRecurring>,
      ) => {
        const newParams = { ...get().currentQueryParams, ...params };
        set(
          {
            currentQueryParams: newParams,
            lastUpdated: new Date(),
          },
          false,
          "setQueryParams",
        );

        logAction("Query params updated", {
          updatedFields: Object.keys(params),
          newParams,
        });
      },

      resetQueryParams: () => {
        set(
          {
            currentQueryParams: defaultQueryParams,
            lastUpdated: new Date(),
          },
          false,
          "resetQueryParams",
        );

        logAction("Query params reset to defaults", { defaultQueryParams });
      },

      updateSingleParam: <K extends keyof TransactionQueryParamsWithRecurring>(
        key: K,
        value: TransactionQueryParamsWithRecurring[K],
      ) => {
        const newParams = { ...get().currentQueryParams, [key]: value };
        set(
          {
            currentQueryParams: newParams,
            lastUpdated: new Date(),
          },
          false,
          "updateSingleParam",
        );

        logAction("Single param updated", { key, value, newParams });
      },

      // Base store actions
      setLoading: (loading: boolean) => {
        set({ loading, lastUpdated: new Date() }, false, "setLoading");
        logAction("Loading state changed", { loading });
      },

      setError: (error: string | null) => {
        set({ error, lastUpdated: new Date() }, false, "setError");
        if (error) {
          storeLogger.error(STORE_NAME, "Error set", error);
        } else {
          logAction("Error cleared");
        }
      },

      clearError: () => {
        set({ error: null, lastUpdated: new Date() }, false, "clearError");
        logAction("Error cleared");
      },

      reset: () => {
        set(
          {
            loading: false,
            error: null,
            currentQueryParams: defaultQueryParams,
            lastUpdated: new Date(),
          },
          false,
          "reset",
        );
        logAction("Store reset");
      },
    };
  }, createDevtoolsOptions(STORE_NAME)),
);

// Selectori optimizați pentru performance
export const useTransactionQueryParams = () =>
  useTransactionStore((state) => state.currentQueryParams);
export const useTransactionUIState = () =>
  useTransactionStore((state) => ({
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
  }));
export const useTransactionActions = () =>
  useTransactionStore((state) => ({
    setQueryParams: state.setQueryParams,
    resetQueryParams: state.resetQueryParams,
    updateSingleParam: state.updateSingleParam,
  }));
