/**
 * 📊 DATA AGGREGATION & TRANSFORMATION UTILITIES
 * 
 * Centralized module for all data aggregation and transformation functions
 * Consolidates duplicate functionality from:
 * - utils/charts.tsx
 * - utils/lunarGrid/dataTransformers.tsx
 * - hooks/useTransactionChartData.tsx
 * - utils/lunarGrid/calculations.tsx
 */

import { TransactionType } from '@budget-app/shared-constants';
import type { Transaction } from '@budget-app/shared-constants';

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryDataPoint {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
  subcategories?: SubcategoryDataPoint[];
}

export interface SubcategoryDataPoint {
  subcategory: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  timestamp: number;
  income: number;
  expenses: number;
  balance: number;
  net: number;
}

export interface MonthlyComparisonDataPoint {
  month: string;
  year: number;
  monthName: string;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

export interface DailyAggregation {
  income: number;
  expenses: number;
  net: number;
  count: number;
}

export type GroupByPeriod = 'day' | 'week' | 'month' | 'year';

// =============================================================================
// CORE AGGREGATION FUNCTIONS
// =============================================================================

/**
 * Groups transactions by a specified period
 */
export function groupTransactionsByPeriod(
  transactions: Transaction[],
  groupBy: GroupByPeriod = 'day'
): Map<string, Transaction[]> {
  const grouped = new Map<string, Transaction[]>();

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let groupKey: string;

    switch (groupBy) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        groupKey = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'year':
        groupKey = date.getFullYear().toString();
        break;
      default: // day
        groupKey = date.toISOString().split('T')[0];
    }

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey)!.push(transaction);
  });

  return grouped;
}

/**
 * Groups transactions by category
 */
export function groupTransactionsByCategory(
  transactions: Transaction[],
  transactionType?: TransactionType
): Map<string, Transaction[]> {
  const filtered = transactionType 
    ? transactions.filter(t => t.type === transactionType)
    : transactions;

  const grouped = new Map<string, Transaction[]>();

  filtered.forEach(transaction => {
    const category = transaction.category || 'Altele';
    
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(transaction);
  });

  return grouped;
}

/**
 * Groups transactions by subcategory within categories
 */
export function groupTransactionsBySubcategory(
  transactions: Transaction[]
): Map<string, Map<string, Transaction[]>> {
  const grouped = new Map<string, Map<string, Transaction[]>>();

  transactions.forEach(transaction => {
    const category = transaction.category || 'Altele';
    const subcategory = transaction.subcategory || 'Altele';

    if (!grouped.has(category)) {
      grouped.set(category, new Map());
    }

    const categoryMap = grouped.get(category)!;
    if (!categoryMap.has(subcategory)) {
      categoryMap.set(subcategory, []);
    }

    categoryMap.get(subcategory)!.push(transaction);
  });

  return grouped;
}

// =============================================================================
// AGGREGATION CALCULATIONS
// =============================================================================

/**
 * Calculates total amount for a group of transactions
 */
export function calculateTotalAmount(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount.toString());
    return sum + Math.abs(amount);
  }, 0);
}

/**
 * Calculates net amount (income - expenses)
 */
export function calculateNetAmount(transactions: Transaction[]): number {
  return transactions.reduce((net, t) => {
    const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount.toString());
    
    if (t.type === TransactionType.INCOME) {
      return net + Math.abs(amount);
    } else if (t.type === TransactionType.EXPENSE) {
      return net - Math.abs(amount);
    }
    return net;
  }, 0);
}

/**
 * Calculates daily aggregations
 */
export function calculateDailyAggregations(
  transactionsByDate: Map<string, Transaction[]>
): Map<string, DailyAggregation> {
  const result = new Map<string, DailyAggregation>();

  for (const [date, transactions] of transactionsByDate) {
    const aggregation: DailyAggregation = {
      income: 0,
      expenses: 0,
      net: 0,
      count: transactions.length
    };

    transactions.forEach(t => {
      const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount.toString());
      const absAmount = Math.abs(amount);

      if (t.type === TransactionType.INCOME) {
        aggregation.income += absAmount;
      } else if (t.type === TransactionType.EXPENSE) {
        aggregation.expenses += absAmount;
      }
    });

    aggregation.net = aggregation.income - aggregation.expenses;
    result.set(date, aggregation);
  }

  return result;
}

// =============================================================================
// CHART DATA TRANSFORMATIONS
// =============================================================================

/**
 * Transforms grouped transactions to category data points
 */
export function transformToCategoryData(
  transactionsByCategory: Map<string, Transaction[]>,
  transactionType?: TransactionType
): CategoryDataPoint[] {
  const totalAmount = Array.from(transactionsByCategory.values())
    .reduce((sum, transactions) => sum + calculateTotalAmount(transactions), 0);

  return Array.from(transactionsByCategory.entries()).map(([category, transactions], index) => {
    const amount = calculateTotalAmount(transactions);
    
    return {
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      color: getCategoryColor(category, transactionType || TransactionType.EXPENSE, index),
      transactionCount: transactions.length,
    };
  }).sort((a, b) => b.amount - a.amount);
}

/**
 * Transforms grouped transactions to time series data
 */
export function transformToTimeSeriesData(
  transactionsByDate: Map<string, Transaction[]>
): TimeSeriesDataPoint[] {
  const dailyAggregations = calculateDailyAggregations(transactionsByDate);
  let runningBalance = 0;

  const sortedEntries = Array.from(dailyAggregations.entries())
    .sort(([a], [b]) => a.localeCompare(b));

  return sortedEntries.map(([date, aggregation]) => {
    runningBalance += aggregation.net;

    return {
      date,
      timestamp: new Date(date).getTime(),
      income: aggregation.income,
      expenses: aggregation.expenses,
      balance: runningBalance,
      net: aggregation.net,
    };
  });
}

/**
 * Transforms transactions to monthly comparison data
 */
export function transformToMonthlyComparison(
  transactions: Transaction[],
  months: number = 12
): MonthlyComparisonDataPoint[] {
  const monthlyTransactions = groupTransactionsByPeriod(transactions, 'month');
  const monthlyAggregations = calculateDailyAggregations(monthlyTransactions);

  const monthNames = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  const sortedEntries = Array.from(monthlyAggregations.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, months);

  return sortedEntries.map(([monthKey, aggregation]) => {
    const [year, month] = monthKey.split('-').map(Number);
    
    return {
      month: monthKey,
      year,
      monthName: monthNames[month - 1],
      income: aggregation.income,
      expenses: aggregation.expenses,
      savings: aggregation.net,
      balance: aggregation.net, // For compatibility
    };
  }).reverse();
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Gets category color based on type and index
 */
export function getCategoryColor(
  category: string,
  type: TransactionType,
  index: number
): string {
  const colors = {
    [TransactionType.INCOME]: [
      '#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0',
      '#6ee7b7', '#34d399', '#10b981', '#047857', '#065f46'
    ],
    [TransactionType.EXPENSE]: [
      '#ef4444', '#dc2626', '#f87171', '#fca5a5', '#fecaca',
      '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'
    ],
    [TransactionType.SAVING]: [
      '#3b82f6', '#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe',
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'
    ],
  };

  const typeColors = colors[type] || colors[TransactionType.EXPENSE];
  return typeColors[index % typeColors.length];
}

/**
 * Filters transactions by date range
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

/**
 * Gets unique categories from transactions
 */
export function getUniqueCategories(transactions: Transaction[]): string[] {
  const categories = new Set<string>();
  transactions.forEach(t => {
    if (t.category) {
      categories.add(t.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Gets unique subcategories for a category
 */
export function getUniqueSubcategories(
  transactions: Transaction[],
  category: string
): string[] {
  const subcategories = new Set<string>();
  transactions
    .filter(t => t.category === category)
    .forEach(t => {
      if (t.subcategory) {
        subcategories.add(t.subcategory);
      }
    });
  return Array.from(subcategories).sort();
}

// =============================================================================
// PERFORMANCE OPTIMIZATIONS
// =============================================================================

/**
 * Cache for expensive calculations
 */
const calculationCache = new Map<string, any>();

/**
 * Generates cache key for calculations
 */
function generateCacheKey(...params: any[]): string {
  return JSON.stringify(params);
}

/**
 * Cached version of category data transformation
 */
export function getCachedCategoryData(
  transactions: Transaction[],
  transactionType?: TransactionType
): CategoryDataPoint[] {
  const cacheKey = generateCacheKey('categoryData', transactions.length, transactionType);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const transactionsByCategory = groupTransactionsByCategory(transactions, transactionType);
  const result = transformToCategoryData(transactionsByCategory, transactionType);
  
  calculationCache.set(cacheKey, result);
  return result;
}

/**
 * Clears calculation cache
 */
export function clearCalculationCache(): void {
  calculationCache.clear();
} 