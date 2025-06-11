import { Transaction } from "../../types/Transaction";

/**
 * Soldul zilnic pentru o dată specifică
 */
export interface DailyBalance {
  /** Data în format românesc DD/MM/YYYY (ex: 15/06/2025) */
  date: string;
  /** Soldul disponibil (bani lichizi) */
  availableBalance: number;
  /** Soldul în economii */
  savingsBalance: number;
  /** Soldul total (disponibil + economii) */
  totalBalance: number;
  /** Indică dacă soldul disponibil este negativ */
  isNegative: boolean;
  /** Breakdown-ul financiar pentru ziua respectivă */
  breakdown: {
    dailyIncome: number;
    dailyExpenses: number;
    dailySavings: number;
    dailyInvestments: number;
  };
  /** Tranzacțiile din ziua respectivă */
  transactions: Transaction[];
  /** Soldurile pentru toate conturile (dacă multi-account este activat) */
  accountBalances?: AccountDailyBalance[];
}

/**
 * Sold zilnic pentru un cont specific în context multi-account
 */
export interface AccountDailyBalance {
  accountId: string;
  accountName: string;
  balance: number;
  availableBalance: number;
  savingsBalance: number;
  isNegative: boolean;
}

/**
 * Configurarea soldului inițial pentru un cont
 */
export interface AccountBalance {
  accountId: string;
  accountName: string;
  initialBalance: number;
  accountType: 'checking' | 'savings' | 'investment' | 'credit';
  isActive: boolean;
  displayOrder: number;
}

/**
 * Rezultatul hook-ului useBalanceCalculator
 */
export interface UseBalanceCalculatorResult {
  // Funcții principale de calcul
  calculateDailyBalance: (date: string, accountId?: string) => DailyBalance | null;
  calculateMonthlyBalance: (month: string, year: string, accountId?: string) => DailyBalance[];
  
  // State și status
  isLoading: boolean;
  error: Error | null;
  
  // Cache management
  invalidateCache: (dateRange?: { start: string; end: string }) => void;
  refreshBalances: () => Promise<void>;
  
  // Multi-account support
  getAccountBalance: (accountId: string, date: string) => AccountDailyBalance | null;
  getAllAccountsBalance: (date: string) => AccountDailyBalance[];
  
  // Utilități
  isBalanceNegative: (balance: DailyBalance) => boolean;
  getBalanceProjection: (fromDate: string, toDate: string, accountId?: string) => DailyBalance[];
}

/**
 * Parametri pentru calculul soldurilor zilnice
 */
export interface BalanceCalculationParams {
  date: string;
  transactions: Transaction[];
  accountId?: string;
  includeProjections?: boolean;
  startingBalance?: number;
}

/**
 * Parametri pentru calculul soldurilor lunare
 */
export interface MonthlyBalanceCalculationParams {
  month: string; // MM format
  year: string; // YYYY format
  transactions: Transaction[];
  accountId?: string;
  carryoverFromPreviousMonth?: boolean;
}

/**
 * Configurația pentru transfer între luni
 */
export interface MonthlyTransferConfig {
  previousMonthEndBalance: number;
  currentMonthStartBalance: number;
  transferDate: string;
  accountId: string;
}

/**
 * Configurația hook-ului
 */
export interface UseBalanceCalculatorConfig {
  enableMultiAccount?: boolean;
  enableMonthlyTransfers?: boolean;
  cacheTimeout?: number; // milliseconds
  defaultAccountId?: string;
  enableProjections?: boolean;
}

/**
 * Rezultatul validării calculelor
 */
export interface BalanceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  inconsistencies: {
    date: string;
    expected: number;
    actual: number;
    difference: number;
  }[];
}

/**
 * Erori specifice pentru calculele de sold
 */
export class BalanceCalculationError extends Error {
  constructor(
    message: string,
    public readonly code: 'MISSING_DATA' | 'INVALID_DATE' | 'ACCOUNT_NOT_FOUND' | 'CALCULATION_ERROR',
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'BalanceCalculationError';
  }
}

/**
 * Tip pentru funcția de fallback în caz de eroare
 */
export type BalanceCalculationFallback = (
  error: BalanceCalculationError,
  params: BalanceCalculationParams
) => DailyBalance | null; 
