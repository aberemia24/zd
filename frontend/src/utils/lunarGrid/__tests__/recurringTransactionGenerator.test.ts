import {
  calculateNextOccurrence,
  generateRecurringTransactions,
  generateAllRecurringTransactions,
  detectConflicts,
  resolveConflicts,
  validateRecurringTemplate,
  formatFrequencyDisplay,
} from "../recurringTransactionGenerator";
import {
  RecurringTemplate,
  RecurringFrequency,
  GenerationConfig,
} from "../../../types/lunarGrid/RecurringTransactions";
import { TransactionType } from "@shared-constants";

describe("Recurring Transaction Generator", () => {
  // =============================================================================
  // DATE CALCULATION TESTS
  // =============================================================================

  describe("calculateNextOccurrence", () => {
    test("calculates next daily occurrence correctly", () => {
      const currentDate = new Date("2024-01-15");
      const frequency: RecurringFrequency = { type: "daily", interval: 1 };

      const nextDate = calculateNextOccurrence(currentDate, frequency);

      expect(nextDate.toISOString().split("T")[0]).toBe("2024-01-16");
    });

    test("calculates next weekly occurrence correctly", () => {
      const currentDate = new Date("2024-01-15"); // Monday
      const frequency: RecurringFrequency = {
        type: "weekly",
        interval: 1,
        dayOfWeek: 5, // Friday
      };

      const nextDate = calculateNextOccurrence(currentDate, frequency);

      expect(nextDate.toISOString().split("T")[0]).toBe("2024-01-19"); // Next Friday
    });

    test("calculates next monthly occurrence correctly", () => {
      const currentDate = new Date("2024-01-15");
      const frequency: RecurringFrequency = {
        type: "monthly",
        interval: 1,
        dayOfMonth: 15,
      };

      const nextDate = calculateNextOccurrence(currentDate, frequency);

      expect(nextDate.toISOString().split("T")[0]).toBe("2024-02-15");
    });

    test("handles month-end edge cases correctly", () => {
      const currentDate = new Date("2024-01-31");
      const frequency: RecurringFrequency = {
        type: "monthly",
        interval: 1,
        dayOfMonth: 31,
      };

      const nextDate = calculateNextOccurrence(currentDate, frequency);

      // Should move to March (February doesn't have 31 days)
      expect(nextDate.toISOString().split("T")[0]).toBe("2024-03-31");
    });

    test.skip("calculates next yearly occurrence correctly", () => {
      const currentDate = new Date("2024-01-15");
      const frequency: RecurringFrequency = {
        type: "yearly",
        interval: 1,
        monthOfYear: 6,
        dayOfMonth: 15,
      };

      const nextDate = calculateNextOccurrence(currentDate, frequency);

      expect(nextDate.toISOString().split("T")[0]).toBe("2024-06-15");
    });

    test.skip("handles leap year correctly for yearly recurrence", () => {
      const currentDate = new Date("2024-02-29"); // Leap year
      const frequency: RecurringFrequency = {
        type: "yearly",
        interval: 1,
        monthOfYear: 2,
        dayOfMonth: 29,
      };

      const nextDate = calculateNextOccurrence(currentDate, frequency);

      // 2025 is not a leap year, so February 29 becomes February 28
      expect(nextDate.toISOString().split("T")[0]).toBe("2025-02-28");
    });
  });

  // =============================================================================
  // GENERATION TESTS
  // =============================================================================

  describe("generateRecurringTransactions", () => {
    const mockTemplate: RecurringTemplate = {
      id: "template-1",
      userId: "user-1",
      name: "Monthly Salary",
      amount: 5000,
      type: TransactionType.INCOME,
      categoryId: "category-1",
      subcategoryId: "subcategory-1",
      description: "Monthly salary payment",
      frequency: { type: "monthly", interval: 1, dayOfMonth: 1 },
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    test("generates correct number of monthly transactions", () => {
      const generated = generateRecurringTransactions(
        mockTemplate,
        "2024-01-01",
        "2024-03-31",
      );

      expect(generated).toHaveLength(3); // January, February, March
      expect(generated[0].date).toBe("2024-01-01");
      expect(generated[1].date).toBe("2024-02-01");
      expect(generated[2].date).toBe("2024-03-01");
    });

    test("respects template start and end dates", () => {
      const limitedTemplate = {
        ...mockTemplate,
        startDate: "2024-02-01",
        endDate: "2024-02-29",
      };

      const generated = generateRecurringTransactions(
        limitedTemplate,
        "2024-01-01",
        "2024-03-31",
      );

      expect(generated).toHaveLength(1); // Only February
      expect(generated[0].date).toBe("2024-02-01");
    });

    test("generates transactions with correct properties", () => {
      const generated = generateRecurringTransactions(
        mockTemplate,
        "2024-01-01",
        "2024-01-31",
      );

      expect(generated).toHaveLength(1);

      const transaction = generated[0];
      expect(transaction.id).toBe("recurring-template-1-2024-01-01");
      expect(transaction.amount).toBe(5000);
      expect(transaction.type).toBe(TransactionType.INCOME);
      expect(transaction.categoryId).toBe("category-1");
      expect(transaction.subcategoryId).toBe("subcategory-1");
      expect(transaction.description).toBe("Monthly salary payment");
      expect(transaction.isRecurring).toBe(true);
      expect(transaction.recurringTemplateId).toBe("template-1");
    });

    test.skip("skips weekends when configured", () => {
      const weekendTemplate = {
        ...mockTemplate,
        frequency: { type: "weekly" as const, interval: 1, dayOfWeek: 6 }, // Saturday
      };

      const generated = generateRecurringTransactions(
        weekendTemplate,
        "2024-01-01",
        "2024-01-31",
        { skipWeekends: true },
      );

      // Should generate transactions moved to Monday
      generated.forEach((tx) => {
        const date = new Date(tx.date);
        const dayOfWeek = date.getDay();
        expect(dayOfWeek).not.toBe(0); // Not Sunday
        expect(dayOfWeek).not.toBe(6); // Not Saturday
      });
    });

    test.skip("skips holiday dates when configured", () => {
      const generated = generateRecurringTransactions(
        mockTemplate,
        "2024-01-01",
        "2024-03-31",
        { holidayDates: ["2024-02-01"] },
      );

      expect(generated).toHaveLength(2); // January and March, February skipped
      expect(generated.find((tx) => tx.date === "2024-02-01")).toBeUndefined();
    });
  });

  describe("generateAllRecurringTransactions", () => {
    const mockTemplates: RecurringTemplate[] = [
      {
        id: "template-1",
        userId: "user-1",
        name: "Monthly Salary",
        amount: 5000,
        type: TransactionType.INCOME,
        categoryId: "category-1",
        frequency: { type: "monthly", interval: 1, dayOfMonth: 1 },
        startDate: "2024-01-01",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "template-2",
        userId: "user-1",
        name: "Weekly Groceries",
        amount: 500,
        type: TransactionType.EXPENSE,
        categoryId: "category-2",
        frequency: { type: "weekly", interval: 1, dayOfWeek: 1 }, // Monday
        startDate: "2024-01-01",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    test("generates transactions for all active templates", () => {
      const config: GenerationConfig = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        activeTemplates: mockTemplates,
      };

      const result = generateAllRecurringTransactions(config);

      expect(result.statistics.templatesProcessed).toBe(2);
      expect(result.statistics.transactionsGenerated).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    test.skip("provides accurate statistics", () => {
      const config: GenerationConfig = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        activeTemplates: mockTemplates,
      };

      const result = generateAllRecurringTransactions(config);

      expect(result.statistics.periodCovered.startDate).toBe("2024-01-01");
      expect(result.statistics.periodCovered.endDate).toBe("2024-01-31");
      expect(result.statistics.periodCovered.daysSpanned).toBe(31);
      expect(result.statistics.generationTimeMs).toBeGreaterThan(0);
    });

    test("skips inactive templates", () => {
      const inactiveTemplate = { ...mockTemplates[0], isActive: false };
      const config: GenerationConfig = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        activeTemplates: [inactiveTemplate, mockTemplates[1]],
      };

      const result = generateAllRecurringTransactions(config);

      expect(result.statistics.templatesProcessed).toBe(1); // Only active template
    });
  });

  // =============================================================================
  // CONFLICT DETECTION TESTS
  // =============================================================================

  describe("detectConflicts", () => {
    const recurringTransactions = [
      {
        id: "recurring-1-2024-01-01",
        userId: "user-1",
        amount: 1000,
        type: TransactionType.EXPENSE,
        categoryId: "category-1",
        subcategoryId: "subcategory-1",
        date: "2024-01-01",
        isRecurring: true as const,
        recurringTemplateId: "template-1",
        isOverridden: false,
        overrideTransactionId: undefined,
      },
      {
        id: "recurring-2-2024-01-02",
        userId: "user-1",
        amount: 500,
        type: TransactionType.EXPENSE,
        categoryId: "category-2",
        date: "2024-01-02",
        isRecurring: true as const,
        recurringTemplateId: "template-2",
        isOverridden: false,
        overrideTransactionId: undefined,
      },
    ];

    const existingTransactions = [
      {
        id: "manual-1",
        date: "2024-01-01",
        categoryId: "category-1",
        subcategoryId: "subcategory-1",
        amount: 1200,
        type: TransactionType.EXPENSE,
        isRecurring: false,
      },
    ];

    test("detects conflicts correctly", () => {
      const conflicts = detectConflicts(
        recurringTransactions,
        existingTransactions,
      );

      expect(conflicts.totalConflicts).toBe(1);
      expect(conflicts.conflicts).toHaveLength(1);

      const conflict = conflicts.conflicts[0];
      expect(conflict.date).toBe("2024-01-01");
      expect(conflict.categoryId).toBe("category-1");
      expect(conflict.amountDifference).toBe(200); // 1200 - 1000
    });

    test("marks recurring transactions as overridden", () => {
      detectConflicts(recurringTransactions, existingTransactions);

      const overriddenTransaction = recurringTransactions.find(
        (tx) => tx.date === "2024-01-01",
      );
      expect(overriddenTransaction?.isOverridden).toBe(true);
      expect(overriddenTransaction?.overrideTransactionId).toBe("manual-1");
    });

    test("provides resolution suggestions", () => {
      const conflicts = detectConflicts(
        recurringTransactions,
        existingTransactions,
      );

      expect(conflicts.resolutionSuggestions.length).toBeGreaterThan(0);
      expect(conflicts.resolutionSuggestions[0]).toContain(
        "conflicts detected",
      );
    });

    test("handles no conflicts scenario", () => {
      const noConflictTransactions = [
        {
          id: "manual-2",
          date: "2024-01-03",
          categoryId: "category-3",
          amount: 300,
          type: TransactionType.EXPENSE,
          isRecurring: false,
        },
      ];

      const conflicts = detectConflicts(
        recurringTransactions,
        noConflictTransactions,
      );

      expect(conflicts.totalConflicts).toBe(0);
      expect(conflicts.conflicts).toHaveLength(0);
    });
  });

  describe("resolveConflicts", () => {
    const recurringTransactions = [
      {
        id: "recurring-1",
        userId: "user-1",
        amount: 1000,
        type: TransactionType.EXPENSE,
        categoryId: "category-1",
        date: "2024-01-01",
        isRecurring: true as const,
        recurringTemplateId: "template-1",
      },
      {
        id: "recurring-2",
        userId: "user-1",
        amount: 500,
        type: TransactionType.EXPENSE,
        categoryId: "category-2",
        date: "2024-01-02",
        isRecurring: true as const,
        recurringTemplateId: "template-2",
      },
    ];

    const existingTransactions = [
      {
        id: "manual-1",
        date: "2024-01-01",
        categoryId: "category-1",
        amount: 1200,
        type: TransactionType.EXPENSE,
        isRecurring: false,
      },
    ];

    test("filters out conflicted transactions", () => {
      const resolved = resolveConflicts(
        recurringTransactions,
        existingTransactions,
      );

      expect(resolved).toHaveLength(1); // Only non-conflicted transaction
      expect(resolved[0].id).toBe("recurring-2");
    });
  });

  // =============================================================================
  // TEMPLATE VALIDATION TESTS
  // =============================================================================

  describe("validateRecurringTemplate", () => {
    const validTemplate = {
      name: "Test Template",
      amount: 1000,
      type: TransactionType.EXPENSE,
      categoryId: "category-1",
      startDate: "2024-01-01",
      frequency: { type: "monthly" as const, interval: 1, dayOfMonth: 1 },
    };

    test("validates valid template correctly", () => {
      const result = validateRecurringTemplate(validTemplate);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test.skip("detects missing required fields", () => {
      const invalidTemplate = { ...validTemplate };
      delete (invalidTemplate as any).name;
      delete (invalidTemplate as any).amount;

      const result = validateRecurringTemplate(invalidTemplate);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((error) => error.includes("nume"))).toBe(true);
      expect(result.errors.some((error) => error.includes("suma"))).toBe(true);
    });

    test("validates frequency constraints", () => {
      const invalidFrequency = {
        ...validTemplate,
        frequency: { type: "weekly" as const, interval: 1, dayOfWeek: 8 }, // Invalid day
      };

      const result = validateRecurringTemplate(invalidFrequency);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((error) => error.includes("săptămânii"))).toBe(
        true,
      );
    });

    test("provides warnings for edge cases", () => {
      const largeAmountTemplate = {
        ...validTemplate,
        amount: 200000, // Very large amount
      };

      const result = validateRecurringTemplate(largeAmountTemplate);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((warning) => warning.includes("mare"))).toBe(
        true,
      );
    });

    test("calculates estimated impact", () => {
      const result = validateRecurringTemplate(validTemplate);

      expect(result.estimatedImpact.transactionsPerMonth).toBeGreaterThan(0);
      expect(result.estimatedImpact.totalTransactionsNextYear).toBeGreaterThan(
        0,
      );
    });
  });

  // =============================================================================
  // UTILITY TESTS
  // =============================================================================

  describe("formatFrequencyDisplay", () => {
    test("formats daily frequency correctly", () => {
      const frequency: RecurringFrequency = { type: "daily", interval: 1 };
      expect(formatFrequencyDisplay(frequency)).toBe("Zilnic");

      const everyThreeDays: RecurringFrequency = { type: "daily", interval: 3 };
      expect(formatFrequencyDisplay(everyThreeDays)).toBe("La fiecare 3 zile");
    });

    test("formats weekly frequency correctly", () => {
      const frequency: RecurringFrequency = {
        type: "weekly",
        interval: 1,
        dayOfWeek: 1,
      };
      expect(formatFrequencyDisplay(frequency)).toBe("Săptămânal (Luni)");

      const biweekly: RecurringFrequency = { type: "weekly", interval: 2 };
      expect(formatFrequencyDisplay(biweekly)).toBe("La fiecare 2 săptămâni");
    });

    test("formats monthly frequency correctly", () => {
      const frequency: RecurringFrequency = {
        type: "monthly",
        interval: 1,
        dayOfMonth: 15,
      };
      expect(formatFrequencyDisplay(frequency)).toBe("Lunar în ziua 15");

      const quarterly: RecurringFrequency = { type: "monthly", interval: 3 };
      expect(formatFrequencyDisplay(quarterly)).toBe("La fiecare 3 luni");
    });

    test("formats yearly frequency correctly", () => {
      const frequency: RecurringFrequency = {
        type: "yearly",
        interval: 1,
        monthOfYear: 6,
        dayOfMonth: 15,
      };
      expect(formatFrequencyDisplay(frequency)).toBe("Anual în Iunie ziua 15");
    });
  });
});
