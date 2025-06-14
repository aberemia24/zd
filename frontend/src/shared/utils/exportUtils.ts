import type { Transaction } from "@budget-app/shared-constants"; 
import { TransactionType, LABELS } from "@budget-app/shared-constants";
import { ExportFormat } from "@budget-app/shared-constants";

export interface ExportOptions {
  filename?: string;
  title?: string;
  onProgress?: (progress: number) => void;
  includeHeaders?: boolean;
  dateRange?: { from: string; to: string };
}

/**
 * Verifică dacă formatul este suportat
 */
export function isFormatSupported(format: string): format is ExportFormat {
  return ["csv", "pdf", "excel"].includes(format);
}

/**
 * Estimează dimensiunea aproximativă a fișierului pentru tracking progres
 */
export function estimateFileSize(
  transactions: Transaction[],
  format: ExportFormat,
): number {
  const baseSize = transactions.length * 100;
  switch (format) {
    case "csv":
      return baseSize;
    case "pdf":
      return baseSize * 3;
    case "excel":
      return baseSize * 2;
    default:
      return baseSize;
  }
}

/**
 * Obține label pentru tipul de tranzacție
 */
export function getTransactionTypeLabel(type: TransactionType): string {
  switch (type) {
    case TransactionType.INCOME:
      return LABELS.INCOME_TYPE;
    case TransactionType.EXPENSE:
      return LABELS.EXPENSE_TYPE;
    default:
      return "Necunoscut";
  }
}
