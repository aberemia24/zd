import { useCallback, useMemo } from "react";
import { Transaction } from "../../types/Transaction";
import {
  BalanceCalculation,
  FinancialSummary,
  CalculationResult,
  TransactionBreakdown,
} from "../../types/lunarGrid/FinancialCalculations";
import {
  calculateDailyBalances as performDailyBalances,
  recalculateFromDate as performRecalculateFromDate,
  createFinancialSummary as performFinancialSummary,
  calculateWithValidation as performCalculationWithValidation,
} from "../../utils/lunarGrid/financialCalculations";

/**
 * Hook principal pentru calculele financiare LunarGrid
 *
 * REZOLVĂ PROBLEMA CRITICĂ: Algoritm de calcul incorect în LunarGrid actual
 * IMPLEMENTEAZĂ: Sequential Daily Calculation approach din creative phase
 */
export const useLunarGridCalculations = () => {
  /**
   * Calculează soldurile zilnice pentru o perioadă dată
   * Folosește Sequential Daily Calculation approach pentru corectitudine matematică
   */
  const calculateDailyBalances = useCallback(
    (
      startingBalance: number,
      transactionsByDate: Map<string, Transaction[]>,
    ): BalanceCalculation[] => {
      return performDailyBalances(startingBalance, transactionsByDate);
    },
    [],
  );

  /**
   * Recalculează doar de la o anumită dată înainte (optimizare performance)
   * Util când se modifică o tranzacție - nu recalculează toată luna
   */
  const recalculateFromDate = useCallback(
    (
      existingCalculations: BalanceCalculation[],
      fromDate: string,
      updatedTransactions: Map<string, Transaction[]>,
    ): BalanceCalculation[] => {
      return performRecalculateFromDate(
        existingCalculations,
        fromDate,
        updatedTransactions,
      );
    },
    [],
  );

  /**
   * Creează breakdown detaliat pentru o anumită zi
   * Oferă separare clară între disponibil, economii și patrimoniu total
   */
  const calculateBreakdown = useCallback(
    (calculation: BalanceCalculation): TransactionBreakdown => {
      return {
        availableImmediately: calculation.availableBalance,
        savings: calculation.savingsBalance,
        totalPatrimony: calculation.totalBalance,
        dailyTransactions: calculation.transactions,
      };
    },
    [],
  );

  /**
   * Calculează cu validare completă și error handling
   * Returnează rezultat cu flag pentru erori și mesaje descriptive
   */
  const calculateWithValidation = useCallback(
    (
      startingBalance: number,
      transactionsByDate: Map<string, Transaction[]>,
    ): CalculationResult => {
      return performCalculationWithValidation(
        startingBalance,
        transactionsByDate,
      );
    },
    [],
  );

  /**
   * Creează sumar financiar pentru o perioadă
   * Oferă overview rapid: venituri, cheltuieli, economii, schimbare netă
   */
  const createFinancialSummary = useCallback(
    (
      calculations: BalanceCalculation[],
      startingBalance: number,
    ): FinancialSummary => {
      return performFinancialSummary(calculations, startingBalance);
    },
    [],
  );

  /**
   * Convertește tranzacții în format Map pentru calcule eficiente
   * Grupează tranzacțiile pe zile pentru procesare cronologică
   */
  const prepareTransactionsMap = useCallback(
    (transactions: Transaction[]): Map<string, Transaction[]> => {
      const transactionsByDate = new Map<string, Transaction[]>();

      for (const transaction of transactions) {
        // Normalizează data la format YYYY-MM-DD
        const dateStr =
          typeof transaction.date === "string"
            ? transaction.date.split("T")[0] // Ia doar partea de dată din ISO string
            : transaction.date.toISOString().split("T")[0];

        if (!transactionsByDate.has(dateStr)) {
          transactionsByDate.set(dateStr, []);
        }

        transactionsByDate.get(dateStr)!.push(transaction);
      }

      return transactionsByDate;
    },
    [],
  );

  /**
   * Găsește diferențele între două seturi de calcule
   * Util pentru highlighting modificărilor în UI
   */
  const findCalculationDifferences = useCallback(
    (
      oldCalculations: BalanceCalculation[],
      newCalculations: BalanceCalculation[],
    ): string[] => {
      const differences: string[] = [];

      const oldMap = new Map(oldCalculations.map((calc) => [calc.date, calc]));
      const newMap = new Map(newCalculations.map((calc) => [calc.date, calc]));

      // Verifică diferențe în sold disponibil
      for (const [date, newCalc] of newMap) {
        const oldCalc = oldMap.get(date);
        if (!oldCalc) {
          differences.push(date);
          continue;
        }

        if (
          Math.abs(oldCalc.availableBalance - newCalc.availableBalance) > 0.01
        ) {
          differences.push(date);
        }
      }

      return differences;
    },
    [],
  );

  /**
   * Validează consistența calculelor
   * Verifică că nu există salturi inexplicabile în solduri
   */
  const validateCalculationConsistency = useCallback(
    (
      calculations: BalanceCalculation[],
    ): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      for (let i = 1; i < calculations.length; i++) {
        const prev = calculations[i - 1];
        const curr = calculations[i];

        // Verifică că soldul total este suma dintre disponibil și economii
        const expectedTotal = curr.availableBalance + curr.savingsBalance;
        if (Math.abs(curr.totalBalance - expectedTotal) > 0.01) {
          errors.push(`Inconsistență în calculul total pentru ${curr.date}`);
        }

        // Verifică că schimbarea în sold este justificată de tranzacții
        const totalDailyChange =
          curr.breakdown.dailyIncome -
          curr.breakdown.dailyExpenses -
          curr.breakdown.dailySavings;
        const actualChange = curr.availableBalance - prev.availableBalance;

        if (Math.abs(totalDailyChange - actualChange) > 0.01) {
          errors.push(`Inconsistență în calculul zilnic pentru ${curr.date}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [],
  );

  return {
    calculateDailyBalances,
    recalculateFromDate,
    calculateBreakdown,
    calculateWithValidation,
    createFinancialSummary,
    prepareTransactionsMap,
    findCalculationDifferences,
    validateCalculationConsistency,
  };
};
