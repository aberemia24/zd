/**
 * Teste edge-case pentru transaction hooks - logica core
 * Focus pe validare și edge cases fără dependințe complexe
 */

import { TransactionType, TransactionStatus } from "@budget-app/shared-constants";

// Test utilities pentru validarea datelor
const validateTransactionData = (transaction: any): boolean => {
  if (!transaction) return false;
  if (!transaction.id || typeof transaction.id !== "string") return false;
  if (!transaction.amount || typeof transaction.amount !== "number")
    return false;
  if (!Object.values(TransactionType).includes(transaction.type)) return false;
  return true;
};

const normalizeTransactionFilter = (filter: any): any => {
  if (!filter) return {};

  const normalized = { ...filter };

  // Normalize search string
  if (normalized.search && typeof normalized.search === "string") {
    const trimmed = normalized.search.trim();
    if (trimmed === "") {
      delete normalized.search;
    } else {
      normalized.search = trimmed;
    }
  } else if (
    normalized.search === "" ||
    (normalized.search && normalized.search.trim() === "")
  ) {
    delete normalized.search;
  }

  // Normalize amount ranges - only delete if both min and max are exactly 0
  if (normalized.amount) {
    if (normalized.amount.min === 0 && normalized.amount.max === 0) {
      delete normalized.amount;
    }
    // Keep amount if it has meaningful values (like min: 10, max: 20)
  }

  // Normalize date ranges
  if (normalized.date) {
    if (!normalized.date.from && !normalized.date.to) {
      delete normalized.date;
    }
  }

  return normalized;
};

const processTransactionPage = (pageData: any[], userId: string): any[] => {
  if (!Array.isArray(pageData)) return [];

  return pageData.map((transaction) => {
    // Handle null/undefined by keeping them as-is initially, then process only valid ones
    if (transaction === null || transaction === undefined) {
      return transaction;
    }

    const processed = { ...transaction };

    // Add userId if missing
    if (!processed.userId && userId) {
      processed.userId = userId;
    }

    // Add id based on _id if missing
    if (processed._id && !processed.id) {
      processed.id = processed._id;
    }

    return processed;
  });
};

const calculatePaginationLimits = (
  pageSize: number,
  totalCount: number,
  currentPages: number,
): { hasMore: boolean; nextOffset: number | undefined } => {
  // Handle edge cases
  if (pageSize <= 0 || totalCount <= 0 || currentPages < 0) {
    return { hasMore: false, nextOffset: undefined };
  }

  const currentOffset = currentPages * pageSize;
  const hasMore =
    currentOffset < totalCount && currentOffset + pageSize < totalCount;
  const nextOffset = hasMore ? currentOffset + pageSize : undefined;

  return { hasMore, nextOffset };
};

describe("Transaction Hooks Edge Cases - Core Logic", () => {
  const mockUser = {
    id: "test-user-123",
    email: "test@example.com",
  };

  const validTransaction = {
    id: "1",
    userId: "test-user-123",
    type: TransactionType.INCOME,
    amount: 1000,
    date: "2024-01-15",
    category: "Venituri",
    subcategory: "Salariu",
    description: "Test transaction",
    status: TransactionStatus.COMPLETED,
    recurring: false,
  };

  describe("Data Validation Edge Cases", () => {
    test("should validate transaction data correctly", () => {
      expect(validateTransactionData(validTransaction)).toBe(true);

      // Test invalid data
      expect(validateTransactionData(null)).toBe(false);
      expect(validateTransactionData(undefined)).toBe(false);
      expect(validateTransactionData({})).toBe(false);
      expect(validateTransactionData({ id: null })).toBe(false);
      expect(validateTransactionData({ id: "1", amount: "invalid" })).toBe(
        false,
      );
      expect(
        validateTransactionData({ id: "1", amount: 100, type: "INVALID_TYPE" }),
      ).toBe(false);
    });

    test("should handle malformed transaction arrays", () => {
      const malformedData = [
        { id: "1", amount: "invalid-number" },
        { userId: null, type: "INVALID_TYPE" },
        null,
        undefined,
        validTransaction,
      ];

      const processed = processTransactionPage(malformedData, mockUser.id);

      expect(processed).toHaveLength(5);
      expect(processed[4]).toEqual(validTransaction);

      // Should add userId to transactions that don't have it
      const validTransactions = processed.filter(transaction => transaction !== null && transaction !== undefined);
      expect(validTransactions).toHaveLength(3); // Only non-null/undefined items: [0], [1], [4]
      
      validTransactions.forEach((transaction) => {
        expect(transaction.userId).toBe(mockUser.id);
      });
    });

    test("should handle empty and null arrays gracefully", () => {
      expect(processTransactionPage([], mockUser.id)).toEqual([]);
      expect(processTransactionPage(null as any, mockUser.id)).toEqual([]);
      expect(processTransactionPage(undefined as any, mockUser.id)).toEqual([]);
    });
  });

  describe("Filter Normalization Edge Cases", () => {
    test("should normalize empty search strings", () => {
      const whiteSpaceFilter = { search: "   whitespace   " };
      const emptyFilter = { search: "" };
      const spacesFilter = { search: "   " };
      const categoryFilter = { category: "" };
      const amountFilter = { amount: { min: 0, max: 0 } };
      const dateFilter = { date: { from: "", to: "" } };

      // Test whitespace normalization
      const normalizedWhitespace = normalizeTransactionFilter(whiteSpaceFilter);
      expect(normalizedWhitespace.search).toBe("whitespace");

      // Test empty string removal
      const normalizedEmpty = normalizeTransactionFilter(emptyFilter);
      expect(normalizedEmpty.search).toBeUndefined();

      const normalizedSpaces = normalizeTransactionFilter(spacesFilter);
      expect(normalizedSpaces.search).toBeUndefined();

      // Test amount filter removal when min=0 and max=0
      const normalizedAmount = normalizeTransactionFilter(amountFilter);
      expect(normalizedAmount.amount).toBeUndefined();

      // Test date filter removal when from and to are empty
      const normalizedDate = normalizeTransactionFilter(dateFilter);
      expect(normalizedDate.date).toBeUndefined();

      // Test category filter (currently unused but defined)
      const normalizedCategory = normalizeTransactionFilter(categoryFilter);
      expect(normalizedCategory.category).toBe("");
    });

    test("should handle complex filter combinations", () => {
      const complexFilters = {
        type: TransactionType.EXPENSE,
        category: "Food",
        subcategory: "Restaurants",
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
        minAmount: 10,
        maxAmount: 1000,
        recurring: true,
        search: "  pizza  ",
      };

      const normalized = normalizeTransactionFilter(complexFilters);

      expect(normalized.search).toBe("pizza");
      expect(normalized.type).toBe(TransactionType.EXPENSE);
      expect(normalized.category).toBe("Food");
    });

    test("should handle null and undefined filters", () => {
      expect(normalizeTransactionFilter(null)).toEqual({});
      expect(normalizeTransactionFilter(undefined)).toEqual({});
      expect(normalizeTransactionFilter({})).toEqual({});
    });
  });

  describe("Pagination Logic Edge Cases", () => {
    test("should calculate pagination limits correctly", () => {
      // Standard pagination
      const result1 = calculatePaginationLimits(10, 100, 0);
      expect(result1.hasMore).toBe(true);
      expect(result1.nextOffset).toBe(10);

      // Last page with exact count
      const result2 = calculatePaginationLimits(10, 20, 1);
      expect(result2.hasMore).toBe(false);
      expect(result2.nextOffset).toBeUndefined();

      // Empty dataset
      const result3 = calculatePaginationLimits(10, 0, 0);
      expect(result3.hasMore).toBe(false);
      expect(result3.nextOffset).toBeUndefined();

      // Very large dataset
      const result4 = calculatePaginationLimits(10, 100000, 5);
      expect(result4.hasMore).toBe(true);
      expect(result4.nextOffset).toBe(60);
    });

    test("should handle edge cases in pagination", () => {
      // Page size larger than total count
      const result1 = calculatePaginationLimits(100, 50, 0);
      expect(result1.hasMore).toBe(false);
      expect(result1.nextOffset).toBeUndefined();

      // Negative values (should be handled gracefully)
      const result2 = calculatePaginationLimits(-10, 100, 0);
      expect(result2.hasMore).toBe(false);

      // Zero page size
      const result3 = calculatePaginationLimits(0, 100, 0);
      expect(result3.hasMore).toBe(false);
    });
  });

  describe("Data Processing Edge Cases", () => {
    test("should handle transactions with missing IDs", () => {
      const transactionsWithMissingIds = [
        { _id: "mongo-id-1", amount: 100, type: TransactionType.INCOME },
        { id: "existing-id", amount: 200, type: TransactionType.EXPENSE },
        { amount: 300, type: TransactionType.INCOME }, // No ID at all
      ];

      const processed = processTransactionPage(
        transactionsWithMissingIds,
        mockUser.id,
      );

      expect(processed[0].id).toBe("mongo-id-1");
      expect(processed[1].id).toBe("existing-id");
      expect(processed[2].id).toBeUndefined();
    });

    test("should handle very large datasets efficiently", () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `transaction-${i}`,
        amount: Math.random() * 1000,
        type: i % 2 === 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
        userId: i % 100 === 0 ? null : "some-user", // 1% missing userId
      }));

      const startTime = Date.now();
      const processed = processTransactionPage(largeDataset, mockUser.id);
      const endTime = Date.now();

      expect(processed).toHaveLength(10000);
      expect(endTime - startTime).toBeLessThan(1000); // Should process quickly

      // Check userId assignment logic - split verification
      const itemsWithNullUserId = processed.filter((_, index) => index % 100 === 0);
      const itemsWithExistingUserId = processed.filter((_, index) => index % 100 !== 0);
      
      // Items with null userId should be updated
      itemsWithNullUserId.forEach((transaction) => {
        expect(transaction).toBeDefined();
        expect(transaction.userId).toBe(mockUser.id);
      });
      
      // Items with existing userId should remain unchanged
      itemsWithExistingUserId.forEach((transaction) => {
        expect(transaction).toBeDefined();
        expect(transaction.userId).toBe("some-user");
      });
    });
  });

  describe("Memory and Performance Edge Cases", () => {
    test("should handle rapid consecutive filter changes", () => {
      const filters = Array.from({ length: 100 }, (_, i) => ({
        search: `test-${i}`,
        type: i % 2 === 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
        amount: { min: (i + 1) * 10, max: (i + 1) * 20 }, // Start from 1 to avoid min=0,max=0
      }));

      const startTime = Date.now();
      const normalized = filters.map((filter) =>
        normalizeTransactionFilter(filter),
      );
      const endTime = Date.now();

      expect(normalized).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100); // Should normalize quickly

      normalized.forEach((filter, index) => {
        expect(filter.search).toBe(`test-${index}`);
        expect(filter.type).toBeDefined();
        expect(filter.amount).toBeDefined();
      });
    });

    test("should handle memory cleanup scenarios", () => {
      // Simulate memory cleanup by creating and discarding large objects
      for (let i = 0; i < 100; i++) {
        const largeArray = Array.from({ length: 1000 }, (_, j) => ({
          id: `temp-${i}-${j}`,
          data: "x".repeat(1000),
        }));

        const processed = processTransactionPage(
          largeArray as any,
          mockUser.id,
        );
        expect(processed).toHaveLength(1000);
      }

      // Should complete without memory issues
      expect(true).toBe(true);
    });
  });

  describe("Error Handling Edge Cases", () => {
    test("should handle circular references gracefully", () => {
      const circularObject: any = { id: "1", amount: 100 };
      circularObject.self = circularObject;

      expect(() => {
        processTransactionPage([circularObject], mockUser.id);
      }).not.toThrow();
    });

    test("should handle deeply nested objects", () => {
      const deepObject = {
        id: "1",
        amount: 100,
        nested: {
          level1: {
            level2: {
              level3: {
                data: "deep",
              },
            },
          },
        },
      };

      expect(() => {
        processTransactionPage([deepObject], mockUser.id);
      }).not.toThrow();
    });

    test("should handle special numeric values", () => {
      const specialValues = [
        { id: "1", amount: Infinity },
        { id: "2", amount: -Infinity },
        { id: "3", amount: NaN },
        { id: "4", amount: 0 },
        { id: "5", amount: -0 },
      ];

      expect(() => {
        const processed = processTransactionPage(specialValues, mockUser.id);
        expect(processed).toHaveLength(5);
      }).not.toThrow();
    });
  });
});
