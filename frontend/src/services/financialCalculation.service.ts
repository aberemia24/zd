/**
 * Serviciu pentru calculele financiare - Daily Balance Projection Engine
 * 
 * Implementează logica de calcul pentru balanța zilnică și proiecțiile financiare,
 * folosind pattern-urile existente de cache cu createCachedQueryFn.
 */

import { createCachedQueryFn } from "./reactQueryUtils";
import { TransactionType } from "@shared-constants";
import type { TransactionValidated } from "@shared-constants/transaction.schema";

// Interfețe pentru serviciul de calculare financiară
export interface DailyBalanceParams {
  transactions: TransactionValidated[];
  startingBalance: number;
  targetDate: string; // YYYY-MM-DD format
}

export interface BalanceProjection {
  date: string;
  balance: number;
  dayTransactions: TransactionValidated[];
  runningTotal: number;
}

export interface FinancialImpact {
  availableBalanceImpact: number;
  netWorthImpact: number;
  displayColor: string;
  impactType: 'positive' | 'negative' | 'transfer' | 'neutral';
  savingsAccount?: string;
}

export interface MonthlyProjection {
  year: number;
  month: number;
  dailyBalances: BalanceProjection[];
  monthStartBalance: number;
  monthEndBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

/**
 * Serviciu principal pentru calculele financiare
 * Folosește existing pattern cu createCachedQueryFn pentru performance
 */
class FinancialCalculationService {
  /**
   * Calculează balanța zilnică pentru o dată specifică
   * Cached pentru performance cu invalidation inteligentă
   */
  calculateDailyBalance = createCachedQueryFn(
    async (params: DailyBalanceParams): Promise<number> => {
      const { transactions, startingBalance, targetDate } = params;
      
      // Sortează tranzacțiile după dată pentru calcul secvențial
      const sortedTransactions = transactions
        .filter(t => t.date <= targetDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let runningBalance = startingBalance;
      
      // Calculare liniară O(n) - performance adecvată pentru personal budget
      for (const transaction of sortedTransactions) {
        const impact = this.calculateFinancialImpact(transaction);
        runningBalance += impact.availableBalanceImpact;
      }
      
      return runningBalance;
    },
    {
      cacheKey: (params) => `daily-balance:${params.targetDate}:${JSON.stringify({
        transactionCount: params.transactions.length,
        startingBalance: params.startingBalance
      })}`,
      maxAge: 5 * 60 * 1000, // 5 minute cache pentru financial data
    }
  );

  /**
   * Calculează proiecția pentru o lună întreagă
   * Pre-calculează toate zilele pentru performance optimă
   */
  calculateMonthlyProjection = createCachedQueryFn(
    async (
      year: number,
      month: number,
      transactions: TransactionValidated[],
      startingBalance: number
    ): Promise<MonthlyProjection> => {
      const daysInMonth = new Date(year, month, 0).getDate();
      const dailyBalances: BalanceProjection[] = [];
      
      let runningBalance = startingBalance;
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalSavings = 0;
      
      // Calculează pentru fiecare zi din lună
      for (let day = 1; day <= daysInMonth; day++) {
        const targetDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Găsește tranzacțiile pentru această zi
        const dayTransactions = transactions.filter(t => t.date === targetDate);
        
        // Calculează impactul zilei
        let dayImpact = 0;
        for (const transaction of dayTransactions) {
          const impact = this.calculateFinancialImpact(transaction);
          dayImpact += impact.availableBalanceImpact;
          
          // Actualizează totalurile lunare
          if (impact.impactType === 'positive') {
            totalIncome += transaction.amount;
          } else if (impact.impactType === 'negative') {
            totalExpenses += transaction.amount;
          } else if (impact.impactType === 'transfer') {
            totalSavings += transaction.amount;
          }
        }
        
        runningBalance += dayImpact;
        
        dailyBalances.push({
          date: targetDate,
          balance: runningBalance,
          dayTransactions,
          runningTotal: runningBalance
        });
      }
      
      return {
        year,
        month,
        dailyBalances,
        monthStartBalance: startingBalance,
        monthEndBalance: runningBalance,
        totalIncome,
        totalExpenses,
        totalSavings
      };
    },
    {
      cacheKey: (year, month, transactions, startingBalance) => 
        `monthly-projection:${year}:${month}:${transactions.length}:${startingBalance}`,
      maxAge: 5 * 60 * 1000, // 5 minute cache
    }
  );

  /**
   * Calculează impactul financiar al unei tranzacții
   * Implementează logica pentru savings treatment
   */
  calculateFinancialImpact(transaction: TransactionValidated): FinancialImpact {
    switch (transaction.type) {
      case TransactionType.INCOME:
        return {
          availableBalanceImpact: transaction.amount,
          netWorthImpact: transaction.amount,
          displayColor: 'text-green-600',
          impactType: 'positive'
        };
        
      case TransactionType.EXPENSE:
        return {
          availableBalanceImpact: -transaction.amount,
          netWorthImpact: -transaction.amount,
          displayColor: 'text-red-600',
          impactType: 'negative'
        };
        
      case TransactionType.SAVING:
        return {
          availableBalanceImpact: -transaction.amount, // Reduce available money
          netWorthImpact: 0, // Savings don't reduce net worth
          displayColor: 'text-blue-600',
          impactType: 'transfer',
          savingsAccount: transaction.subcategory || 'General Savings'
        };
        
      default:
        return {
          availableBalanceImpact: 0,
          netWorthImpact: 0,
          displayColor: 'text-gray-600',
          impactType: 'neutral'
        };
    }
  }

  /**
   * Validează și formatează data pentru calcule
   */
  formatDateForCalculation(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Obține data curentă formatată pentru calcule
   */
  getCurrentDate(): string {
    return this.formatDateForCalculation(new Date());
  }

  /**
   * Calculează intervalul de date pentru o lună
   */
  getMonthDateRange(year: number, month: number): { startDate: string; endDate: string } {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    
    return { startDate, endDate };
  }
}

// Export singleton instance pentru consistent usage
export const financialCalculationService = new FinancialCalculationService();
export default FinancialCalculationService; 