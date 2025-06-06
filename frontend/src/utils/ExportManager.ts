import type { Transaction } from "../types/Transaction";
import { TransactionType, OPTIONS } from "@budget-app/shared-constants";
import { LazyExportManager, type ExportProgressCallback } from "./lazyExportUtils";
import { LABELS } from '@budget-app/shared-constants';

export type ExportFormat = "csv" | "pdf" | "excel";

export interface ExportOptions {
  filename?: string;
  title?: string;
  onProgress?: (progress: number) => void;
  includeHeaders?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

/**
 * ExportManager cu lazy loading pentru performanță optimă
 * Librăriile mari (ExcelJS, jsPDF, file-saver) se încarcă doar când sunt necesare
 */
export class ExportManager {
  /**
   * Export tranzacții în format specificat cu lazy loading
   */
  static async exportTransactions(
    transactions: Transaction[],
    format: ExportFormat,
    options: ExportOptions = {},
  ): Promise<void> {
    const {
      filename = `tranzactii_${new Date().getTime()}`,
      title = "Raport Tranzacții",
      onProgress,
      includeHeaders = true,
      dateRange,
    } = options;

    // Simulare progress pentru UX
    onProgress?.(10);

    // Filtrare în funcție de intervalul de date dacă este specificat
    let filteredTransactions = transactions;
    if (dateRange) {
      filteredTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    onProgress?.(30);

    // Conversie progress callback pentru LazyExportManager
    const progressCallback: ExportProgressCallback = (progress) => {
      onProgress?.(30 + (progress.progress * 0.7)); // Scale 0-100 to 30-100
    };

    // Pregătire date pentru export
    const exportData = filteredTransactions.map((t) => ({
      Data: new Date(t.date).toLocaleDateString("ro-RO"),
      Descriere: t.description || "",
      Categorie: t.category || "",
      Subcategorie: t.subcategory || "",
      Tip: this.getTransactionTypeLabel(t.type),
      Suma: `${typeof t.amount === "number" ? t.amount.toFixed(2) : parseFloat(t.amount.toString()).toFixed(2)} RON`,
      Status: t.status || "ACTIVE",
    }));

    // Utilizare LazyExportManager pentru lazy loading
    const lazyExporter = new LazyExportManager(progressCallback);

    switch (format) {
      case "csv":
        return lazyExporter.exportToCSV(exportData, filename);
      case "pdf":
        return lazyExporter.exportToPDF(exportData, filename, title);
      case "excel":
        return lazyExporter.exportToExcel(exportData, filename, "Tranzacții");
      default:
        throw new Error(`Format de export nesuportat: ${format}`);
    }
  }

  /**
   * Conversie tip tranzacție în label pentru afișare
   */
  private static getTransactionTypeLabel(type: TransactionType): string {
    switch (type) {
      case TransactionType.INCOME:
        return LABELS.INCOME_TYPE;
      case TransactionType.EXPENSE:
        return LABELS.EXPENSE_TYPE;
      default:
        return "Necunoscut";
    }
  }

  /**
   * Validare format suportat
   */
  static isFormatSupported(format: string): format is ExportFormat {
    return ["csv", "pdf", "excel"].includes(format);
  }

  /**
   * Calculare dimensiune aproximativă fișier pentru progress tracking
   */
  static estimateFileSize(
    transactions: Transaction[],
    format: ExportFormat,
  ): number {
    const baseSize = transactions.length * 100; // ~100 bytes per transaction

    switch (format) {
      case "csv":
        return baseSize;
      case "pdf":
        return baseSize * 3; // PDF-urile sunt mai mari
      case "excel":
        return baseSize * 2; // Excel-urile sunt mai mari decât CSV
      default:
        return baseSize;
    }
  }
}
