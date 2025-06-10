import { LABELS } from '@budget-app/shared-constants';
/**
 * 💰 FINANCIAL UTILITIES - Task 8.2
 * Utilitare pentru formatarea și calcularea datelor financiare pentru piața românească
 */

import { TransactionType } from '@budget-app/shared-constants';
import type { 
  FinancialTransaction, 
  FinancialTableRow, 
  FinancialSummary, 
  RunningBalance,
  CurrencyConfig
} from '../types/financial';
import {
  calculateRunningBalances,
  calculateFinancialSummary,
  searchTransactions
} from '../shared/utils/dataUtils';
import {
  RON_CURRENCY,
  formatCurrencyRON,
  formatAmountRON,
  parseCurrencyRON,
  formatAmountWithColor,
  formatDateRON,
  formatDateTimeRON,
  getMonthNameRON
} from '../shared/utils/formatUtils';

// =============================================================================
// RE-EXPORTS for backwards compatibility
// =============================================================================

export {
  formatCurrencyRON,
  formatAmountRON,
  parseCurrencyRON,
  formatAmountWithColor,
  formatDateRON,
  formatDateTimeRON,
  getMonthNameRON,
  calculateRunningBalances,
  calculateFinancialSummary,
  searchTransactions
};


// =============================================================================
// TRANSACTION PROCESSING
// =============================================================================

/**
 * Transformă tranzacție brută în row pentru tabel
 */
export function transformToTableRow(
  transaction: FinancialTransaction,
  runningBalance?: number
): FinancialTableRow {
  const typeDisplay = transaction.type === TransactionType.INCOME ? LABELS.INCOME_TYPE : LABELS.EXPENSE_TYPE;
  const categoryPath = transaction.subcategory 
    ? `${transaction.category} > ${transaction.subcategory}`
    : transaction.category;

  return {
    ...transaction,
    runningBalance,
    formattedAmount: formatCurrencyRON(transaction.amount),
    formattedDate: formatDateRON(transaction.date),
    typeDisplay,
    categoryPath,
  };
}

// =============================================================================
// QUICK FILTER PERIODS
// =============================================================================

/**
 * Obține range-urile de date pentru filtrele rapide
 */
export function getQuickFilterPeriods() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  return {
    today: {
      start: startOfDay,
      end: endOfDay,
      label: 'Astăzi'
    },
    thisWeek: {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()),
      end: endOfDay,
      label: 'Săptămâna aceasta'
    },
    lastWeek: {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1, 23, 59, 59),
      label: 'Săptămâna trecută'
    },
    thisMonth: {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: endOfDay,
      label: 'Luna aceasta'
    },
    lastMonth: {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
      label: 'Luna trecută'
    },
    thisYear: {
      start: new Date(now.getFullYear(), 0, 1),
      end: endOfDay,
      label: 'Anul acesta'
    },
    lastYear: {
      start: new Date(now.getFullYear() - 1, 0, 1),
      end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59),
      label: 'Anul trecut'
    },
  };
}

// =============================================================================
// SEARCH & FILTERING
// =============================================================================

// =============================================================================
// PERFORMANCE UTILITIES
// =============================================================================

/**
 * Debounce function pentru search și filtering
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function pentru scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Măsoară timpul de execuție pentru operații
 */
export function measurePerformance<T>(
  operation: () => T,
  label: string = 'Operation'
): { result: T; duration: number } {
  const start = performance.now();
  const result = operation();
  const duration = performance.now() - start;
  
  console.log(`${label} took ${duration.toFixed(2)}ms`);
  
  return { result, duration };
} 
