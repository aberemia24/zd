import { TransactionType } from "@budget-app/shared-constants/enums";
import { Transaction } from "../../../types/Transaction";
import {
  calculateDailyBalances,
  calculateWithValidation,
} from "../financialCalculations";

describe("Financial Calculations", () => {
  const createMockTransaction = (
    type: TransactionType,
    amount: number,
    date: string,
  ): Transaction => ({
    id: `test-${Date.now()}`,
    userId: "test-user",
    type,
    amount,
    date,
    category: "test-category",
    subcategory: "test-subcategory",
  });

  describe("calculateDailyBalances", () => {
    test("INCOME increases available balance", () => {
      const transactions = new Map([
        [
          "2024-01-01",
          [createMockTransaction(TransactionType.INCOME, 500, "2024-01-01")],
        ],
      ]);

      const result = calculateDailyBalances(1000, transactions);

      expect(result).toHaveLength(1);
      expect(result[0].availableBalance).toBe(1500);
      expect(result[0].savingsBalance).toBe(0);
      expect(result[0].totalBalance).toBe(1500);
      expect(result[0].breakdown.dailyIncome).toBe(500);
    });

    test("EXPENSE decreases available balance", () => {
      const transactions = new Map([
        [
          "2024-01-01",
          [createMockTransaction(TransactionType.EXPENSE, 200, "2024-01-01")],
        ],
      ]);

      const result = calculateDailyBalances(1000, transactions);

      expect(result).toHaveLength(1);
      expect(result[0].availableBalance).toBe(800);
      expect(result[0].savingsBalance).toBe(0);
      expect(result[0].totalBalance).toBe(800);
      expect(result[0].breakdown.dailyExpenses).toBe(200);
    });

    test("SAVING moves money from available to savings", () => {
      const transactions = new Map([
        [
          "2024-01-01",
          [createMockTransaction(TransactionType.SAVING, 300, "2024-01-01")],
        ],
      ]);

      const result = calculateDailyBalances(1000, transactions);

      expect(result).toHaveLength(1);
      expect(result[0].availableBalance).toBe(700);
      expect(result[0].savingsBalance).toBe(300);
      expect(result[0].totalBalance).toBe(1000); // Unchanged total
      expect(result[0].breakdown.dailySavings).toBe(300);
    });

    test("handles multiple transactions in same day", () => {
      const transactions = new Map([
        [
          "2024-01-01",
          [
            createMockTransaction(TransactionType.INCOME, 500, "2024-01-01"),
            createMockTransaction(TransactionType.EXPENSE, 200, "2024-01-01"),
            createMockTransaction(TransactionType.SAVING, 100, "2024-01-01"),
          ],
        ],
      ]);

      const result = calculateDailyBalances(1000, transactions);

      expect(result).toHaveLength(1);
      expect(result[0].availableBalance).toBe(1200); // 1000 + 500 - 200 - 100
      expect(result[0].savingsBalance).toBe(100);
      expect(result[0].totalBalance).toBe(1300); // 1200 + 100
      expect(result[0].breakdown.dailyIncome).toBe(500);
      expect(result[0].breakdown.dailyExpenses).toBe(200);
      expect(result[0].breakdown.dailySavings).toBe(100);
    });

    test("handles sequential days correctly", () => {
      const transactions = new Map([
        [
          "2024-01-01",
          [createMockTransaction(TransactionType.INCOME, 500, "2024-01-01")],
        ],
        [
          "2024-01-02",
          [createMockTransaction(TransactionType.EXPENSE, 200, "2024-01-02")],
        ],
      ]);

      const result = calculateDailyBalances(1000, transactions);

      expect(result).toHaveLength(2);

      // Day 1
      expect(result[0].availableBalance).toBe(1500);
      expect(result[0].totalBalance).toBe(1500);

      // Day 2 - builds on Day 1
      expect(result[1].availableBalance).toBe(1300); // 1500 - 200
      expect(result[1].totalBalance).toBe(1300);
    });

    test("handles string amounts correctly", () => {
      const transactionWithStringAmount: Transaction = {
        ...createMockTransaction(TransactionType.INCOME, 0, "2024-01-01"),
        amount: "500.50", // String amount
      };

      const transactions = new Map([
        ["2024-01-01", [transactionWithStringAmount]],
      ]);

      const result = calculateDailyBalances(1000, transactions);

      expect(result[0].availableBalance).toBe(1500.5);
      expect(result[0].breakdown.dailyIncome).toBe(500.5);
    });
  });

  describe("calculateWithValidation", () => {
    test("validates negative starting balance", () => {
      const transactions = new Map();

      const result = calculateWithValidation(-100, transactions);

      expect(result.hasErrors).toBe(true);
      expect(result.errors).toContain(
        "Balanta de pornire nu poate fi negativă",
      );
    });

    test("validates empty transactions", () => {
      const transactions = new Map();

      const result = calculateWithValidation(1000, transactions);

      expect(result.hasErrors).toBe(true);
      expect(result.errors).toContain("Nu există tranzacții pentru calculat");
    });

    test("validates negative transaction amounts", () => {
      const transactionWithNegativeAmount: Transaction = {
        ...createMockTransaction(TransactionType.INCOME, -100, "2024-01-01"),
      };

      const transactions = new Map([
        ["2024-01-01", [transactionWithNegativeAmount]],
      ]);

      const result = calculateWithValidation(1000, transactions);

      expect(result.hasErrors).toBe(true);
      expect(result.errors).toContain(
        `Suma negativă în tranzacția ${transactionWithNegativeAmount.id}`,
      );
    });

    test("returns valid result for correct data", () => {
      const transactions = new Map([
        [
          "2024-01-01",
          [createMockTransaction(TransactionType.INCOME, 500, "2024-01-01")],
        ],
      ]);

      const result = calculateWithValidation(1000, transactions);

      expect(result.hasErrors).toBe(false);
      expect(result.calculations).toHaveLength(1);
      expect(result.summary.totalIncome).toBe(500);
    });
  });
});
