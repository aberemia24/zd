import { LABELS } from '@shared-constants';
/**
 * 💰 FINANCIAL UTILITIES - Task 8.2
 * Utilitare pentru formatarea și calcularea datelor financiare pentru piața românească
 */

import { TransactionType } from '@shared-constants';
import type { 
  FinancialTransaction, 
  FinancialTableRow, 
  FinancialSummary, 
  RunningBalance,
  CurrencyConfig
} from '../types/financial';

// =============================================================================
// CURRENCY CONFIGURATION
// =============================================================================

const RON_CURRENCY: CurrencyConfig = {
  code: 'RON',
  symbol: 'lei',
  locale: 'ro-RO',
  decimalPlaces: 2,
  thousandsSeparator: '.',
  decimalSeparator: ',',
};

// =============================================================================
// CURRENCY FORMATTING
// =============================================================================

/**
 * Formatează o sumă în lei românești cu separatorii corecți
 */
export function formatCurrencyRON(amount: number): string {
  return new Intl.NumberFormat(RON_CURRENCY.locale, {
    style: 'currency',
    currency: RON_CURRENCY.code,
    minimumFractionDigits: RON_CURRENCY.decimalPlaces,
    maximumFractionDigits: RON_CURRENCY.decimalPlaces,
  }).format(amount);
}

/**
 * Formatează sumă numerică cu separatori pentru RON (fără simbolul monetar)
 */
export function formatAmountRON(amount: number): string {
  return new Intl.NumberFormat(RON_CURRENCY.locale, {
    minimumFractionDigits: RON_CURRENCY.decimalPlaces,
    maximumFractionDigits: RON_CURRENCY.decimalPlaces,
  }).format(amount);
}

/**
 * Parsează string cu valută RON în număr
 */
export function parseCurrencyRON(value: string): number {
  // Elimină simboluri monetare și spații
  const cleanValue = value
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formatează sumă cu culoare bazată pe tip (verde pentru venit, roșu pentru cheltuială)
 */
export function formatAmountWithColor(amount: number, type: TransactionType): {
  formatted: string;
  color: string;
  bgColor: string;
} {
  const isIncome = type === TransactionType.INCOME;
  
  return {
    formatted: formatCurrencyRON(Math.abs(amount)),
    color: isIncome ? 'text-success-600' : 'text-error-600',
    bgColor: isIncome ? 'bg-success-50' : 'bg-error-50',
  };
}

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Formatează data pentru afișare în tabel (format românesc)
 */
export function formatDateRON(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formatează data și ora pentru afișare detaliată
 */
export function formatDateTimeRON(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Obține numele lunii în română
 */
export function getMonthNameRON(monthIndex: number): string {
  const months = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
  ];
  return months[monthIndex] || '';
}

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

/**
 * Calculează soldul curent pentru fiecare tranzacție
 */
export function calculateRunningBalances(
  transactions: FinancialTransaction[],
  initialBalance: number = 0
): RunningBalance[] {
  const sortedTransactions = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  let runningBalance = initialBalance;
  const balances: RunningBalance[] = [];

  sortedTransactions.forEach((transaction) => {
    const dailyChange = transaction.type === TransactionType.INCOME 
      ? transaction.amount 
      : -transaction.amount;
    
    runningBalance += dailyChange;

    balances.push({
      date: transaction.date,
      balance: runningBalance,
      dailyChange,
      transactionId: transaction.id,
    });
  });

  return balances;
}

/**
 * Calculează sumarul financiar pentru o listă de tranzacții
 */
export function calculateFinancialSummary(
  transactions: FinancialTransaction[],
  periodStart: Date,
  periodEnd: Date
): FinancialSummary {
  const filteredTransactions = transactions.filter(
    t => t.date >= periodStart && t.date <= periodEnd
  );

  const totalIncome = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const transactionCount = filteredTransactions.length;
  const averageTransaction = transactionCount > 0 
    ? (totalIncome + totalExpenses) / transactionCount 
    : 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    averageTransaction,
    transactionCount,
    period: {
      start: periodStart,
      end: periodEnd,
    },
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

/**
 * Efectuează căutare în tranzacții
 */
export function searchTransactions(
  transactions: FinancialTransaction[],
  query: string,
  searchColumns: string[] = ['description', 'category', 'subcategory'],
  caseSensitive: boolean = false,
  useRegex: boolean = false
): FinancialTransaction[] {
  if (!query.trim()) return transactions;

  const searchQuery = caseSensitive ? query : query.toLowerCase();

  try {
    const regex = useRegex ? new RegExp(searchQuery, caseSensitive ? 'g' : 'gi') : null;

    return transactions.filter(transaction => {
      return searchColumns.some(column => {
        const value = (transaction as any)[column];
        if (!value) return false;

        const stringValue = String(value);
        const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase();

        if (useRegex && regex) {
          return regex.test(stringValue);
        }

        return searchValue.includes(searchQuery);
      });
    });
  } catch (error) {
    // Fallback la căutare simplă dacă regex este invalid
    return transactions.filter(transaction => {
      return searchColumns.some(column => {
        const value = (transaction as any)[column];
        if (!value) return false;

        const stringValue = String(value);
        const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase();
        return searchValue.includes(searchQuery);
      });
    });
  }
}

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