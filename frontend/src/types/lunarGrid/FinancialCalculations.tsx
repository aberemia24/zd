import { Transaction } from "../Transaction";

/**
 * Calculul soldurilor zilnice pentru o anumită dată
 */
export interface BalanceCalculation {
  date: string; // YYYY-MM-DD format
  availableBalance: number; // Money available for spending
  savingsBalance: number; // Money saved/invested
  totalBalance: number; // Total patrimony
  transactions: Transaction[]; // Transactions for this day
  breakdown: {
    dailyIncome: number;
    dailyExpenses: number;
    dailySavings: number;
  };
}

/**
 * Sumar financiar pentru o perioadă
 */
export interface FinancialSummary {
  startingBalance: number;
  endingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netChange: number;
}

/**
 * Parametri pentru calculul soldurilor zilnice
 */
export interface CalculationParams {
  startingBalance: number;
  transactionsByDate: Map<string, Transaction[]>;
  startDate: string;
  endDate: string;
}

/**
 * Rezultatul calculului cu breakdown detaliat
 */
export interface CalculationResult {
  calculations: BalanceCalculation[];
  summary: FinancialSummary;
  hasErrors: boolean;
  errors?: string[];
}

/**
 * Breakdown detaliat pentru o tranzacție
 */
export interface TransactionBreakdown {
  availableImmediately: number;
  savings: number;
  totalPatrimony: number;
  dailyTransactions: Transaction[];
}
