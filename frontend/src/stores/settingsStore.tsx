import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccountBalance } from "../hooks/balanceCalculator/useBalanceCalculator.types";
import { MESAJE, ACCOUNT_MANAGEMENT } from "@budget-app/shared-constants";

/**
 * Configurație generală pentru aplicație
 */
export interface AppSettings {
  defaultCurrency: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  enableMultiAccount: boolean;
  enableNotifications: boolean;
  darkMode: boolean;
  autoSaveInterval: number; // milliseconds
}

/**
 * Starea store-ului pentru setări
 */
interface SettingsState {
  // Account management
  accounts: AccountBalance[];
  defaultAccountId: string | null;
  
  // App settings
  appSettings: AppSettings;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions pentru accounts
  addAccount: (account: Omit<AccountBalance, 'accountId'>) => void;
  updateAccount: (accountId: string, updates: Partial<AccountBalance>) => void;
  removeAccount: (accountId: string) => void;
  setDefaultAccount: (accountId: string) => void;
  getAccountById: (accountId: string) => AccountBalance | null;
  
  // Actions pentru app settings
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  
  // Utility actions
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed getters
  getActiveAccounts: () => AccountBalance[];
  getTotalInitialBalance: () => number;
  hasMultipleAccounts: () => boolean;
}

/**
 * Setări default pentru aplicație
 */
const defaultAppSettings: AppSettings = {
  defaultCurrency: 'RON',
  dateFormat: 'DD/MM/YYYY',
  enableMultiAccount: false,
  enableNotifications: true,
  darkMode: false,
  autoSaveInterval: 30000, // 30 secunde
};

/**
 * Cont default pentru utilizatori noi
 */
const defaultAccount: AccountBalance = {
  accountId: 'default-account',
  accountName: 'Cont Principal',
  initialBalance: 1000,
  accountType: 'checking',
  isActive: true,
  displayOrder: 1,
};

/**
 * Store pentru gestionarea setărilor și conturilor
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      accounts: [defaultAccount],
      defaultAccountId: 'default-account',
      appSettings: defaultAppSettings,
      isLoading: false,
      error: null,

      // Account management actions
      addAccount: (accountData) => {
        const accountId = `account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newAccount: AccountBalance = {
          ...accountData,
          accountId,
          displayOrder: get().accounts.length + 1,
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
          error: null,
        }));
      },

      updateAccount: (accountId, updates) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.accountId === accountId
              ? { ...account, ...updates }
              : account
          ),
          error: null,
        }));
      },

      removeAccount: (accountId) => {
        const state = get();
        
        // Nu permite ștergerea dacă este singurul cont activ
        const activeAccounts = state.accounts.filter(acc => acc.isActive);
        if (activeAccounts.length === 1 && activeAccounts[0].accountId === accountId) {
          set({ error: ACCOUNT_MANAGEMENT.VALIDATION.CANNOT_DELETE_LAST });
          return;
        }

        set((state) => {
          const newAccounts = state.accounts.filter(acc => acc.accountId !== accountId);
          return {
            accounts: newAccounts,
            defaultAccountId: state.defaultAccountId === accountId 
              ? newAccounts.find(acc => acc.isActive)?.accountId || null
              : state.defaultAccountId,
            error: null,
          };
        });
      },

      setDefaultAccount: (accountId) => {
        const account = get().getAccountById(accountId);
        if (!account) {
          set({ error: 'Contul nu a fost găsit' });
          return;
        }

        if (!account.isActive) {
          set({ error: 'Contul nu este activ' });
          return;
        }

        set({ defaultAccountId: accountId, error: null });
      },

      getAccountById: (accountId) => {
        return get().accounts.find(acc => acc.accountId === accountId) || null;
      },

      // App settings actions
      updateAppSettings: (settings) => {
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings },
          error: null,
        }));
      },

      // Utility actions
      reset: () => {
        set({
          accounts: [defaultAccount],
          defaultAccountId: 'default-account',
          appSettings: defaultAppSettings,
          isLoading: false,
          error: null,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      // Computed getters
      getActiveAccounts: () => {
        return get().accounts.filter(acc => acc.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder);
      },

      getTotalInitialBalance: () => {
        return get().accounts
          .filter(acc => acc.isActive)
          .reduce((total, acc) => total + acc.initialBalance, 0);
      },

      hasMultipleAccounts: () => {
        return get().accounts.filter(acc => acc.isActive).length > 1;
      },
    }),
    {
      name: 'budget-app-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        defaultAccountId: state.defaultAccountId,
        appSettings: state.appSettings,
      }),
    }
  )
); 
