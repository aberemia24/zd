import { ExportManager } from "./ExportManager";
import type { Transaction } from "../types/Transaction";
import { TransactionType, TransactionStatus } from "@budget-app/shared-constants";

// Mock data pentru testare
const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "test-user",
    type: TransactionType.INCOME,
    amount: 1000,
    date: "2024-01-15",
    category: "Venituri",
    subcategory: "Salariu",
    description: "Salariu ianuarie",
    status: TransactionStatus.COMPLETED,
    recurring: false,
  },
  {
    id: "2",
    userId: "test-user",
    type: TransactionType.EXPENSE,
    amount: 500,
    date: "2024-01-16",
    category: "Cheltuieli",
    subcategory: "Mâncare",
    description: "Cumpărături",
    status: TransactionStatus.COMPLETED,
    recurring: false,
  },
];

describe("ExportManager", () => {
  test("should support all export formats", () => {
    expect(ExportManager.isFormatSupported("csv")).toBe(true);
    expect(ExportManager.isFormatSupported("pdf")).toBe(true);
    expect(ExportManager.isFormatSupported("excel")).toBe(true);
    expect(ExportManager.isFormatSupported("invalid")).toBe(false);
  });

  test("should estimate file size correctly", () => {
    const csvSize = ExportManager.estimateFileSize(mockTransactions, "csv");
    const pdfSize = ExportManager.estimateFileSize(mockTransactions, "pdf");
    const excelSize = ExportManager.estimateFileSize(mockTransactions, "excel");

    expect(csvSize).toBeGreaterThan(0);
    expect(pdfSize).toBeGreaterThan(csvSize);
    expect(excelSize).toBeGreaterThan(csvSize);
  });

  test("should handle empty transactions array", () => {
    expect(() => ExportManager.estimateFileSize([], "csv")).not.toThrow();
    expect(ExportManager.estimateFileSize([], "csv")).toBe(0);
  });
});
