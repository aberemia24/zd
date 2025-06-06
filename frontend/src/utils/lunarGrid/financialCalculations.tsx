import { Transaction } from "../../types/Transaction";
import { TransactionType } from "@budget-app/shared-constants/enums";
import {
  BalanceCalculation,
  FinancialSummary,
  CalculationResult,
} from "../../types/lunarGrid/FinancialCalculations";

/**
 * Calculează soldurile zilnice folosind Sequential Daily Calculation approach
 *
 * CORECTEAZĂ BUG-UL CRITIC: Algoritm actual adună toate sumele indiferent de tip
 * SOLUȚIE: INCOME (+), EXPENSE (-), SAVINGS (transfer din disponibil la economii)
 */
export function calculateDailyBalances(
  startingBalance: number,
  transactionsByDate: Map<string, Transaction[]>,
): BalanceCalculation[] {
  const results: BalanceCalculation[] = [];
  let runningAvailable = startingBalance;
  let runningSavings = 0;

  // Sortează datele cronologic pentru calcul secvențial
  const sortedDates = Array.from(transactionsByDate.keys()).sort();

  for (const date of sortedDates) {
    const dayTransactions = transactionsByDate.get(date) || [];

    let dayAvailableChange = 0;
    let daySavingsChange = 0;
    let dailyIncome = 0;
    let dailyExpenses = 0;
    let dailySavings = 0;

    // Procesează tranzacțiile zilei cu logică matematică corectă
    for (const transaction of dayTransactions) {
      // Convertește amount la number dacă este string
      const amount =
        typeof transaction.amount === "string"
          ? parseFloat(transaction.amount)
          : transaction.amount;

      switch (transaction.type) {
        case TransactionType.INCOME:
          dayAvailableChange += amount;
          dailyIncome += amount;
          break;
        case TransactionType.EXPENSE:
          dayAvailableChange -= amount;
          dailyExpenses += amount;
          break;
        case TransactionType.SAVING:
          // Economiile SE SCAD din disponibil și SE ADAUGĂ la economii
          dayAvailableChange -= amount;
          daySavingsChange += amount;
          dailySavings += amount;
          break;
      }
    }

    // Actualizează soldurile
    runningAvailable += dayAvailableChange;
    runningSavings += daySavingsChange;

    results.push({
      date,
      availableBalance: runningAvailable,
      savingsBalance: runningSavings,
      totalBalance: runningAvailable + runningSavings,
      transactions: dayTransactions,
      breakdown: {
        dailyIncome,
        dailyExpenses,
        dailySavings,
      },
    });
  }

  return results;
}

/**
 * Recalculează soldurile începând de la o anumită dată
 * OPTIMIZARE: Nu recalculează totul, doar de la data modificării înainte
 */
export function recalculateFromDate(
  existingCalculations: BalanceCalculation[],
  fromDate: string,
  updatedTransactions: Map<string, Transaction[]>,
): BalanceCalculation[] {
  // Găsește indexul de la care să înceapă recalcularea
  const startIndex = existingCalculations.findIndex(
    (calc) => calc.date >= fromDate,
  );

  if (startIndex === -1) {
    // Data nu există în calcule existente, adaugă la sfârșit
    return existingCalculations;
  }

  // Păstrează calculele de dinainte de data modificării
  const unchangedCalculations = existingCalculations.slice(0, startIndex);

  // Calculează balanța de pornire pentru recalculare
  const previousBalance =
    startIndex > 0 ? existingCalculations[startIndex - 1] : null;
  const startingAvailable = previousBalance?.availableBalance || 0;
  const startingSavings = previousBalance?.savingsBalance || 0;

  // Creează map pentru tranzacțiile de la data modificării înainte
  const transactionsFromDate = new Map<string, Transaction[]>();

  // Adaugă toate tranzacțiile de la data modificării
  for (const [date, transactions] of updatedTransactions.entries()) {
    if (date >= fromDate) {
      transactionsFromDate.set(date, transactions);
    }
  }

  // Recalculează de la data modificării
  const recalculated = calculateDailyBalancesFromBase(
    startingAvailable,
    startingSavings,
    transactionsFromDate,
  );

  return [...unchangedCalculations, ...recalculated];
}

/**
 * Calculează soldurile cu balante de pornire specifice (pentru recalculare parțială)
 */
function calculateDailyBalancesFromBase(
  startingAvailable: number,
  startingSavings: number,
  transactionsByDate: Map<string, Transaction[]>,
): BalanceCalculation[] {
  const results: BalanceCalculation[] = [];
  let runningAvailable = startingAvailable;
  let runningSavings = startingSavings;

  const sortedDates = Array.from(transactionsByDate.keys()).sort();

  for (const date of sortedDates) {
    const dayTransactions = transactionsByDate.get(date) || [];

    let dayAvailableChange = 0;
    let daySavingsChange = 0;
    let dailyIncome = 0;
    let dailyExpenses = 0;
    let dailySavings = 0;

    for (const transaction of dayTransactions) {
      // Convertește amount la number dacă este string
      const amount =
        typeof transaction.amount === "string"
          ? parseFloat(transaction.amount)
          : transaction.amount;

      switch (transaction.type) {
        case TransactionType.INCOME:
          dayAvailableChange += amount;
          dailyIncome += amount;
          break;
        case TransactionType.EXPENSE:
          dayAvailableChange -= amount;
          dailyExpenses += amount;
          break;
        case TransactionType.SAVING:
          dayAvailableChange -= amount;
          daySavingsChange += amount;
          dailySavings += amount;
          break;
      }
    }

    runningAvailable += dayAvailableChange;
    runningSavings += daySavingsChange;

    results.push({
      date,
      availableBalance: runningAvailable,
      savingsBalance: runningSavings,
      totalBalance: runningAvailable + runningSavings,
      transactions: dayTransactions,
      breakdown: {
        dailyIncome,
        dailyExpenses,
        dailySavings,
      },
    });
  }

  return results;
}

/**
 * Creează sumar financiar din calculele zilnice
 */
export function createFinancialSummary(
  calculations: BalanceCalculation[],
  startingBalance: number,
): FinancialSummary {
  if (calculations.length === 0) {
    return {
      startingBalance,
      endingBalance: startingBalance,
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      netChange: 0,
    };
  }

  const totalIncome = calculations.reduce(
    (sum, calc) => sum + calc.breakdown.dailyIncome,
    0,
  );
  const totalExpenses = calculations.reduce(
    (sum, calc) => sum + calc.breakdown.dailyExpenses,
    0,
  );
  const totalSavings = calculations.reduce(
    (sum, calc) => sum + calc.breakdown.dailySavings,
    0,
  );

  const lastCalculation = calculations[calculations.length - 1];
  const endingBalance = lastCalculation.totalBalance;
  const netChange = endingBalance - startingBalance;

  return {
    startingBalance,
    endingBalance,
    totalIncome,
    totalExpenses,
    totalSavings,
    netChange,
  };
}

/**
 * Validează și calculează cu error handling
 */
export function calculateWithValidation(
  startingBalance: number,
  transactionsByDate: Map<string, Transaction[]>,
): CalculationResult {
  const errors: string[] = [];

  // Validări de bază
  if (startingBalance < 0) {
    errors.push("Balanta de pornire nu poate fi negativă");
  }

  if (transactionsByDate.size === 0) {
    errors.push("Nu există tranzacții pentru calculat");
  }

  // Validează tranzacțiile
  for (const [date, transactions] of transactionsByDate.entries()) {
    if (!isValidDate(date)) {
      errors.push(`Data invalidă: ${date}`);
    }

    for (const transaction of transactions) {
      const amount =
        typeof transaction.amount === "string"
          ? parseFloat(transaction.amount)
          : transaction.amount;

      if (amount < 0) {
        errors.push(`Suma negativă în tranzacția ${transaction.id}`);
      }

      if (!Object.values(TransactionType).includes(transaction.type)) {
        errors.push(`Tip tranzacție invalid: ${transaction.type}`);
      }
    }
  }

  if (errors.length > 0) {
    return {
      calculations: [],
      summary: createFinancialSummary([], startingBalance),
      hasErrors: true,
      errors,
    };
  }

  try {
    const calculations = calculateDailyBalances(
      startingBalance,
      transactionsByDate,
    );
    const summary = createFinancialSummary(calculations, startingBalance);

    return {
      calculations,
      summary,
      hasErrors: false,
    };
  } catch (error) {
    return {
      calculations: [],
      summary: createFinancialSummary([], startingBalance),
      hasErrors: true,
      errors: [
        `Eroare în calcul: ${error instanceof Error ? error.message : "Eroare necunoscută"}`,
      ],
    };
  }
}

/**
 * Validează formatul datei
 */
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date.toISOString().split("T")[0] === dateString;
}
