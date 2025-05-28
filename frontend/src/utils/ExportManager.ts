import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { Transaction } from "../types/Transaction";
import { TransactionType, OPTIONS } from "@shared-constants";

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

// Extend jsPDF type for autoTable plugin
interface AutoTableOptions {
  head?: string[][];
  body?: string[][];
  startY?: number;
  styles?: { fontSize?: number };
  headStyles?: { fillColor?: number[] };
  margin?: { top?: number };
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }
}

export class ExportManager {
  /**
   * Export tranzacții în format specificat
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

    switch (format) {
      case "csv":
        return this.exportToCSV(filteredTransactions, filename, {
          includeHeaders,
          onProgress,
        });
      case "pdf":
        return this.exportToPDF(filteredTransactions, filename, {
          title,
          onProgress,
        });
      case "excel":
        return this.exportToExcel(filteredTransactions, filename, {
          title,
          onProgress,
        });
      default:
        throw new Error(`Format de export nesuportat: ${format}`);
    }
  }

  /**
   * Export în format CSV
   */
  private static async exportToCSV(
    transactions: Transaction[],
    filename: string,
    options: {
      includeHeaders?: boolean;
      onProgress?: (progress: number) => void;
    },
  ): Promise<void> {
    const { includeHeaders = true, onProgress } = options;

    onProgress?.(50);

    const csvData = this.prepareCSVData(transactions, includeHeaders);

    onProgress?.(80);

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);

    onProgress?.(100);
  }

  /**
   * Export în format PDF
   */
  private static async exportToPDF(
    transactions: Transaction[],
    filename: string,
    options: { title?: string; onProgress?: (progress: number) => void },
  ): Promise<void> {
    const { title = "Raport Tranzacții", onProgress } = options;

    onProgress?.(50);

    const doc = new jsPDF();

    // Configurare font pentru suport Unicode (română)
    doc.setFont("helvetica");

    // Titlu
    doc.setFontSize(16);
    doc.text(title, 20, 20);

    // Data generării
    doc.setFontSize(10);
    doc.text(`Generat: ${new Date().toLocaleDateString("ro-RO")}`, 20, 30);

    onProgress?.(70);

    // Pregătire date pentru tabel
    const tableData = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("ro-RO"),
      t.description || "",
      t.category || "",
      t.subcategory || "",
      this.getTransactionTypeLabel(t.type),
      `${typeof t.amount === "number" ? t.amount.toFixed(2) : parseFloat(t.amount.toString()).toFixed(2)} RON`,
    ]);

    onProgress?.(85);

    // Adăugare tabel
    doc.autoTable({
      head: [["Data", "Descriere", "Categorie", "Subcategorie", "Tip", "Sumă"]],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 40 },
    });

    onProgress?.(95);

    // Salvare
    doc.save(`${filename}.pdf`);

    onProgress?.(100);
  }

  /**
   * Export în format Excel cu ExcelJS (securizat)
   */
  private static async exportToExcel(
    transactions: Transaction[],
    filename: string,
    options: { title?: string; onProgress?: (progress: number) => void },
  ): Promise<void> {
    const { title = "Raport Tranzacții", onProgress } = options;

    onProgress?.(50);

    // Creare workbook și worksheet cu ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tranzacții");

    onProgress?.(60);

    // Definire header-e cu stil
    worksheet.columns = [
      { header: "Data", key: "date", width: 15 },
      { header: "Descriere", key: "description", width: 30 },
      { header: "Categorie", key: "category", width: 20 },
      { header: "Subcategorie", key: "subcategory", width: 20 },
      { header: "Tip", key: "type", width: 15 },
      { header: "Sumă", key: "amount", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Styling pentru header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF428BCA" },
    };

    onProgress?.(70);

    // Adăugare date
    transactions.forEach((t) => {
      worksheet.addRow({
        date: new Date(t.date).toLocaleDateString("ro-RO"),
        description: t.description || "",
        category: t.category || "",
        subcategory: t.subcategory || "",
        type: this.getTransactionTypeLabel(t.type),
        amount: t.amount,
        status: t.status || "ACTIVE",
      });
    });

    onProgress?.(90);

    // Export la Buffer pentru download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}.xlsx`);

    onProgress?.(100);
  }

  /**
   * Pregătire date CSV
   */
  private static prepareCSVData(
    transactions: Transaction[],
    includeHeaders: boolean,
  ): string {
    const headers = [
      "Data",
      "Descriere",
      "Categorie",
      "Subcategorie",
      "Tip",
      "Sumă",
      "Status",
    ];

    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("ro-RO"),
      `"${(t.description || "").replace(/"/g, '""')}"`, // Escape quotes
      t.category || "",
      t.subcategory || "",
      this.getTransactionTypeLabel(t.type),
      typeof t.amount === "number"
        ? t.amount.toFixed(2)
        : parseFloat(t.amount.toString()).toFixed(2),
      t.status || "ACTIVE",
    ]);

    const csvRows = includeHeaders ? [headers, ...rows] : rows;

    return csvRows.map((row) => row.join(",")).join("\n");
  }

  /**
   * Conversie tip tranzacție în label lizibil
   */
  private static getTransactionTypeLabel(type: TransactionType): string {
    const typeOption = OPTIONS.TYPE.find(option => option.value === type);
    return typeOption ? typeOption.label : String(type);
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
