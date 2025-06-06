import { useMemo } from 'react';
import { TransactionType } from '@budget-app/shared-constants';
import type { Transaction } from '../types/Transaction';
import type { CategoryDataPoint, TimeSeriesDataPoint } from '../types/charts';

interface TransactionChartData {
  categoryData: CategoryDataPoint[];
  timeSeriesData: TimeSeriesDataPoint[];
  expensesByCategory: CategoryDataPoint[];
  incomeByCategory: CategoryDataPoint[];
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
}

/**
 * 📊 TRANSACTION CHART DATA HOOK
 * 
 * Transformă datele de tranzacții într-un format optim pentru chart-uri
 * Generează date pentru pie charts, line charts și statistici generale
 */
export const useTransactionChartData = (
  transactions: Transaction[] = []
): TransactionChartData => {
  
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        categoryData: [],
        timeSeriesData: [],
        expensesByCategory: [],
        incomeByCategory: [],
        totalIncome: 0,
        totalExpenses: 0,
        totalTransactions: 0,
      };
    }

    // =============================================================================
    // CATEGORY DATA PROCESSING
    // =============================================================================

    const categoryMap = new Map<string, {
      amount: number;
      count: number;
      type: TransactionType;
    }>();

    const expenseMap = new Map<string, { amount: number; count: number }>();
    const incomeMap = new Map<string, { amount: number; count: number }>();

    let totalIncome = 0;
    let totalExpenses = 0;

    // Procesează fiecare tranzacție
    transactions.forEach((transaction) => {
      const category = transaction.category || 'Altele';
      const amount = Math.abs(Number(transaction.amount));

      // Map general pentru toate categoriile
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          amount: 0,
          count: 0,
          type: transaction.type as TransactionType,
        });
      }
      
      const categoryData = categoryMap.get(category)!;
      categoryData.amount += amount;
      categoryData.count += 1;

      // Separă pe tipuri
      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount;
        
        if (!incomeMap.has(category)) {
          incomeMap.set(category, { amount: 0, count: 0 });
        }
        const incomeData = incomeMap.get(category)!;
        incomeData.amount += amount;
        incomeData.count += 1;
      } else if (transaction.type === TransactionType.EXPENSE) {
        totalExpenses += amount;
        
        if (!expenseMap.has(category)) {
          expenseMap.set(category, { amount: 0, count: 0 });
        }
        const expenseData = expenseMap.get(category)!;
        expenseData.amount += amount;
        expenseData.count += 1;
      }
    });

    // =============================================================================
    // CHART COLORS
    // =============================================================================

    const getColorByType = (type: TransactionType, index: number) => {
      const colors = {
        [TransactionType.INCOME]: [
          '#10b981', // green-500
          '#059669', // green-600  
          '#34d399', // green-400
          '#6ee7b7', // green-300
        ],
        [TransactionType.EXPENSE]: [
          '#ef4444', // red-500
          '#dc2626', // red-600
          '#f87171', // red-400
          '#fca5a5', // red-300
        ],
        [TransactionType.SAVING]: [
          '#3b82f6', // blue-500
          '#2563eb', // blue-600
          '#60a5fa', // blue-400
          '#93c5fd', // blue-300
        ],
      };
      
      const typeColors = colors[type] || colors[TransactionType.EXPENSE];
      return typeColors[index % typeColors.length];
    };

    // =============================================================================
    // TRANSFORM TO CHART DATA
    // =============================================================================

    const transformCategoryMap = (
      map: Map<string, { amount: number; count: number }>,
      type: TransactionType,
      total: number
    ): CategoryDataPoint[] => {
      return Array.from(map.entries())
        .map(([category, data], index) => ({
          category,
          amount: data.amount,
          percentage: total > 0 ? (data.amount / total) * 100 : 0,
          color: getColorByType(type, index),
          transactionCount: data.count,
        }))
        .sort((a, b) => b.amount - a.amount); // Sort descrescător după sumă
    };

    // Categorii generale (toate tipurile)
    const categoryData: CategoryDataPoint[] = Array.from(categoryMap.entries())
      .map(([category, data], index) => ({
        category,
        amount: data.amount,
        percentage: (data.amount / (totalIncome + totalExpenses)) * 100,
        color: getColorByType(data.type, index),
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Categorii separate pe tipuri
    const expensesByCategory = transformCategoryMap(
      expenseMap,
      TransactionType.EXPENSE,
      totalExpenses
    );

    const incomeByCategory = transformCategoryMap(
      incomeMap,
      TransactionType.INCOME,
      totalIncome
    );

    // =============================================================================
    // TIME SERIES DATA (pentru line charts)
    // =============================================================================

    // Grupează tranzacțiile pe zile
    const dailyData = new Map<string, {
      income: number;
      expenses: number;
      date: Date;
    }>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          income: 0,
          expenses: 0,
          date: date,
        });
      }
      
      const dayData = dailyData.get(dateKey)!;
      const amount = Math.abs(Number(transaction.amount));
      
      if (transaction.type === TransactionType.INCOME) {
        dayData.income += amount;
      } else if (transaction.type === TransactionType.EXPENSE) {
        dayData.expenses += amount;
      }
    });

    // Transformă în time series format
    const timeSeriesData: TimeSeriesDataPoint[] = Array.from(dailyData.entries())
      .map(([dateStr, data]) => ({
        date: dateStr,
        timestamp: data.date.getTime(),
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    return {
      categoryData,
      timeSeriesData,
      expensesByCategory,
      incomeByCategory,
      totalIncome,
      totalExpenses,
      totalTransactions: transactions.length,
    };
  }, [transactions]);
};

export default useTransactionChartData; 
