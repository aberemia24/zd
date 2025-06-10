import { TransactionType } from "@budget-app/shared-constants";
import type {
  FinancialTransaction,
  FinancialSummary,
  RunningBalance
} from "../../types/financial";

/**
 * Calculează soldul curent pentru fiecare tranzacție
 */
export function calculateRunningBalances(
  transactions: FinancialTransaction[],
  initialBalance: number = 0
): RunningBalance[] {
  let currentBalance = initialBalance;
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedTransactions.map((transaction) => {
    const dailyChange = transaction.type === TransactionType.INCOME 
      ? transaction.amount 
      : -transaction.amount;
    currentBalance += dailyChange;
    return {
      transactionId: transaction.id,
      balance: currentBalance,
      date: new Date(transaction.date),
      dailyChange: dailyChange,
    };
  });
}

/**
 * Calculează sumarul financiar pentru o listă de tranzacții
 */
export function calculateFinancialSummary(
  transactions: FinancialTransaction[],
  periodStart: Date,
  periodEnd: Date
): FinancialSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  let transactionCount = 0;

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= periodStart && transactionDate <= periodEnd;
  });

  for (const transaction of filteredTransactions) {
    if (transaction.type === TransactionType.INCOME) {
      totalIncome += transaction.amount;
    } else if (transaction.type === TransactionType.EXPENSE) {
      totalExpenses += transaction.amount;
    }
    transactionCount++;
  }

  const netBalance = totalIncome - totalExpenses;
  const averageTransaction = transactionCount > 0 
    ? (totalIncome + totalExpenses) / transactionCount // Suma absolută a tranzacțiilor / număr
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
        if (typeof value !== 'string' && typeof value !== 'number') return false;

        const stringValue = String(value);
        const searchValueToCompare = caseSensitive ? stringValue : stringValue.toLowerCase();

        if (useRegex && regex) {
          regex.lastIndex = 0; 
          return regex.test(stringValue);
        }

        return searchValueToCompare.includes(searchQuery);
      });
    });
  } catch (error) {
    console.error("Regex error during search, falling back to simple search:", error);
    return transactions.filter(transaction => {
      return searchColumns.some(column => {
        const value = (transaction as any)[column];
        if (typeof value !== 'string' && typeof value !== 'number') return false;

        const stringValue = String(value);
        const searchValueToCompare = caseSensitive ? stringValue : stringValue.toLowerCase();
        return searchValueToCompare.includes(searchQuery);
      });
    });
  }
}
