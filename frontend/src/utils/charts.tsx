/**
 * 📊 CHART UTILITIES - Task 8.3
 * Utilitare pentru procesarea datelor și configurarea chart-urilor financiare
 */

import { TransactionType } from '@budget-app/shared-constants';
import { formatCurrencyRON, formatDateRON } from './financial';
import type {
  ChartDataPoint,
  TimeSeriesDataPoint,
  CategoryDataPoint,
  MonthlyComparisonDataPoint,
  ChartTheme,
  BudgetAnalysisData,
  TrendAnalysisData,
} from '../types/charts';
import type { FinancialTransaction } from '../types/financial';

// =============================================================================
// CHART THEME CONFIGURATION
// =============================================================================

export const DEFAULT_CHART_THEME: ChartTheme = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    income: '#10b981', // green-500
    expense: '#ef4444', // red-500
    savings: '#3b82f6', // blue-500
    neutral: '#6b7280', // gray-500
    grid: '#e5e7eb', // gray-200
    text: '#374151', // gray-700
    background: '#ffffff',
    accent: [
      '#8b5cf6', // violet-500
      '#f59e0b', // amber-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
      '#f97316', // orange-500
      '#ec4899', // pink-500
    ],
  },
  fonts: {
    family: 'Inter, system-ui, sans-serif',
    sizes: {
      title: 18,
      subtitle: 14,
      axis: 12,
      legend: 12,
      tooltip: 13,
    },
  },
  spacing: {
    margin: 20,
    padding: 16,
    gap: 12,
  },
  animations: {
    duration: 750,
    easing: 'ease-in-out',
  },
};

// =============================================================================
// COLOR ASSIGNMENT UTILITIES
// =============================================================================

/**
 * Generează culori pentru categorii bazate pe tipul de tranzacție
 */
export function getCategoryColor(
  category: string,
  type: TransactionType,
  index: number = 0
): string {
  const theme = DEFAULT_CHART_THEME;

  // Culori specifice pentru tipuri cunoscute
  if (type === TransactionType.INCOME) {
    return theme.colors.income;
  }
  if (type === TransactionType.EXPENSE) {
    return theme.colors.expense;
  }

  // Pentru subcategorii, folosește paleta de accente
  return theme.colors.accent[index % theme.colors.accent.length];
}

/**
 * Generează paletă de culori pentru mai multe categorii
 */
export function generateCategoryColors(
  categories: string[],
  baseType?: TransactionType
): Record<string, string> {
  const colorMap: Record<string, string> = {};
  const theme = DEFAULT_CHART_THEME;

  categories.forEach((category, index) => {
    if (baseType) {
      colorMap[category] = getCategoryColor(category, baseType, index);
    } else {
      colorMap[category] = theme.colors.accent[index % theme.colors.accent.length];
    }
  });

  return colorMap;
}

// =============================================================================
// DATA TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Transformă tranzacții în date pentru time series chart
 */
export function transformToTimeSeriesData(
  transactions: FinancialTransaction[],
  groupBy: 'day' | 'week' | 'month' = 'day'
): TimeSeriesDataPoint[] {
  const groupedData = new Map<string, {
    income: number;
    expenses: number;
    balance: number;
    date: Date;
  }>();

  // Grupează tranzacțiile pe perioada specificată
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let groupKey: string;

    switch (groupBy) {
      case 'week':
        // Prima zi a săptămânii
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        groupKey = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      default:
        groupKey = date.toISOString().split('T')[0];
    }

    if (!groupedData.has(groupKey)) {
      groupedData.set(groupKey, {
        income: 0,
        expenses: 0,
        balance: 0,
        date: new Date(groupKey),
      });
    }

    const group = groupedData.get(groupKey)!;
    
    if (transaction.type === TransactionType.INCOME) {
      group.income += transaction.amount;
    } else if (transaction.type === TransactionType.EXPENSE) {
      group.expenses += transaction.amount;
    }
  });

  // Calculează balance running și convertește la format final
  let runningBalance = 0;
  const sortedEntries = Array.from(groupedData.entries()).sort(([a], [b]) => a.localeCompare(b));

  return sortedEntries.map(([key, data]) => {
    const net = data.income - data.expenses;
    runningBalance += net;

    return {
      date: key,
      timestamp: data.date.getTime(),
      income: data.income,
      expenses: data.expenses,
      balance: runningBalance,
      net,
    };
  });
}

/**
 * Transformă tranzacții în date pentru category charts
 */
export function transformToCategoryData(
  transactions: FinancialTransaction[],
  type?: TransactionType
): CategoryDataPoint[] {
  const filteredTransactions = type
    ? transactions.filter(t => t.type === type)
    : transactions;

  const categoryMap = new Map<string, {
    amount: number;
    count: number;
    subcategories: Map<string, { amount: number; count: number }>;
  }>();

  // Agregă datele pe categorii
  filteredTransactions.forEach(transaction => {
    const category = transaction.category;
    const subcategory = transaction.subcategory || 'Altele';

    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        amount: 0,
        count: 0,
        subcategories: new Map(),
      });
    }

    const categoryData = categoryMap.get(category)!;
    categoryData.amount += transaction.amount;
    categoryData.count += 1;

    if (!categoryData.subcategories.has(subcategory)) {
      categoryData.subcategories.set(subcategory, { amount: 0, count: 0 });
    }

    const subcategoryData = categoryData.subcategories.get(subcategory)!;
    subcategoryData.amount += transaction.amount;
    subcategoryData.count += 1;
  });

  // Calculează totalul pentru percentaje
  const totalAmount = Array.from(categoryMap.values())
    .reduce((sum, cat) => sum + cat.amount, 0);

  // Convertește la format final
  return Array.from(categoryMap.entries()).map(([category, data], index) => {
    const subcategories = Array.from(data.subcategories.entries()).map(
      ([subcat, subData], subIndex) => ({
        subcategory: subcat,
        amount: subData.amount,
        percentage: (subData.amount / data.amount) * 100,
        color: getCategoryColor(subcat, type || TransactionType.EXPENSE, subIndex),
        transactionCount: subData.count,
      })
    );

    return {
      category,
      amount: data.amount,
      percentage: (data.amount / totalAmount) * 100,
      color: getCategoryColor(category, type || TransactionType.EXPENSE, index),
      transactionCount: data.count,
      subcategories,
    };
  }).sort((a, b) => b.amount - a.amount); // Sortează descrescător după sumă
}

/**
 * Transformă tranzacții în date pentru comparația lunară
 */
export function transformToMonthlyComparison(
  transactions: FinancialTransaction[],
  months: number = 12
): MonthlyComparisonDataPoint[] {
  const monthlyData = new Map<string, {
    income: number;
    expenses: number;
    year: number;
    month: number;
  }>();

  // Grupează pe luni
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        income: 0,
        expenses: 0,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      });
    }

    const monthData = monthlyData.get(monthKey)!;
    
    if (transaction.type === TransactionType.INCOME) {
      monthData.income += transaction.amount;
    } else if (transaction.type === TransactionType.EXPENSE) {
      monthData.expenses += transaction.amount;
    }
  });

  // Sortează și limitează la numărul specificat de luni
  const sortedEntries = Array.from(monthlyData.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // Descrescător (cele mai recente prima)
    .slice(0, months);

  return sortedEntries.map(([monthKey, data]) => {
    const savings = data.income - data.expenses;
    const monthNames = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];

    return {
      month: monthKey,
      year: data.year,
      monthName: monthNames[data.month - 1],
      income: data.income,
      expenses: data.expenses,
      savings,
      balance: savings, // Pentru compatibilitate
    };
  }).reverse(); // Afișează cronologic
}

// =============================================================================
// CHART FORMATTING UTILITIES
// =============================================================================

/**
 * Formatează valores monetare pentru afișare în chart-uri
 */
export function formatChartCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M lei`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K lei`;
  }
  return formatCurrencyRON(value);
}

/**
 * Formatează percentaje pentru chart-uri
 */
export function formatChartPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Formatează date pentru axele chart-urilor
 */
export function formatChartDate(
  value: string | number,
  format: 'short' | 'medium' | 'long' = 'short'
): string {
  const date = typeof value === 'string' ? new Date(value) : new Date(value);
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'medium':
      return date.toLocaleDateString('ro-RO', {
        month: 'short',
        day: 'numeric',
      });
    default:
      return date.toLocaleDateString('ro-RO', {
        month: 'numeric',
        day: 'numeric',
      });
  }
}

// =============================================================================
// ANALYSIS UTILITIES
// =============================================================================

/**
 * Calculează analiza de trend pentru o serie de date
 */
export function calculateTrendAnalysis(
  data: TimeSeriesDataPoint[],
  metric: keyof TimeSeriesDataPoint = 'balance'
): TrendAnalysisData {
  if (data.length < 2) {
    return {
      direction: 'stable',
      changePercentage: 0,
      changeAmount: 0,
      confidence: 0,
      timeframe: '0 zile',
    };
  }

  const values = data.map(d => Number(d[metric]));
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const changeAmount = lastValue - firstValue;
  const changePercentage = firstValue !== 0 ? (changeAmount / Math.abs(firstValue)) * 100 : 0;

  // Calculează direcția bazată pe variația totală
  let direction: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(changePercentage) < 5) {
    direction = 'stable';
  } else {
    direction = changePercentage > 0 ? 'increasing' : 'decreasing';
  }

  // Calculează confidence bazat pe consistența trend-ului
  const increments = values.slice(1).map((val, i) => val - values[i]);
  const positiveIncrements = increments.filter(inc => inc > 0).length;
  const confidence = Math.abs((positiveIncrements / increments.length) - 0.5) * 2;

  return {
    direction,
    changePercentage: Math.abs(changePercentage),
    changeAmount: Math.abs(changeAmount),
    confidence,
    timeframe: `${data.length} ${data.length === 1 ? 'zi' : 'zile'}`,
  };
}

/**
 * Creează analiza completă de budget din tranzacții
 */
export function createBudgetAnalysis(
  transactions: FinancialTransaction[],
  period: { start: Date; end: Date; label: string }
): BudgetAnalysisData {
  const periodTransactions = transactions.filter(
    t => t.date >= period.start && t.date <= period.end
  );

  const totalIncome = periodTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = periodTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  return {
    period,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    expensesByCategory: transformToCategoryData(periodTransactions, TransactionType.EXPENSE),
    incomeByCategory: transformToCategoryData(periodTransactions, TransactionType.INCOME),
    monthlyTrends: transformToTimeSeriesData(periodTransactions, 'month'),
  };
} 
