import { TransactionType } from '@budget-app/shared-constants';
import { BUTTONS } from '@budget-app/shared-constants';
/**
 * Lazy Export Utilities
 * 
 * Încărcare lazy pentru librăriile mari de export (Excel, PDF, HTML2Canvas)
 * pentru a reduce bundle-ul inițial și a încărca doar când sunt necesare.
 */

import React from 'react';

// Tipuri pentru exporturi
export type ExportFormat = 'csv' | 'pdf' | 'excel' | 'png';

// =============================================================================
// LAZY IMPORT UTILITIES
// =============================================================================

/**
 * Încarcă lazy librăriile de Excel export
 */
export const loadExcelExport = async () => {
  const [ExcelJS, { saveAs }] = await Promise.all([
    import('exceljs'),
    import('file-saver')
  ]);
  
  return { ExcelJS: ExcelJS.default || ExcelJS, saveAs };
};

/**
 * Încarcă lazy librăriile de PDF export
 */
export const loadPDFExport = async () => {
  const [jsPDF, autoTable, { saveAs }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
    import('file-saver')
  ]);
  
  return { 
    jsPDF: jsPDF.default || jsPDF, 
    autoTable,
    saveAs 
  };
};

/**
 * Încarcă lazy HTML2Canvas pentru screenshot-uri
 */
export const loadHTML2Canvas = async () => {
  const html2canvas = await import('html2canvas');
  return html2canvas.default || html2canvas;
};

/**
 * Încarcă lazy CSV export utilities
 */
export const loadCSVExport = async () => {
  const [{ CSVLink }, { saveAs }] = await Promise.all([
    import('react-csv'),
    import('file-saver')
  ]);
  
  return { CSVLink, saveAs };
};

// =============================================================================
// EXPORT PROGRESS TRACKING
// =============================================================================

export interface ExportProgress {
  stage: 'loading' | 'processing' | 'generating' | TransactionType.SAVING | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
}

export type ExportProgressCallback = (progress: ExportProgress) => void;

// =============================================================================
// UNIFIED EXPORT MANAGER (LAZY LOADED)
// =============================================================================

export class LazyExportManager {
  private progressCallback?: ExportProgressCallback;

  constructor(progressCallback?: ExportProgressCallback) {
    this.progressCallback = progressCallback;
  }

  private reportProgress(stage: ExportProgress['stage'], progress: number, message: string) {
    this.progressCallback?.({ stage, progress, message });
  }

  /**
   * Export Excel lazy-loaded
   */
  async exportToExcel(data: any[], filename: string, worksheetName: string = 'Data') {
    try {
      this.reportProgress('loading', 10, 'Încărcare librării Excel...');
      
      const { ExcelJS, saveAs } = await loadExcelExport();
      
      this.reportProgress('processing', 30, 'Procesare date...');
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(worksheetName);
      
      // Adaugă header-ul
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        
        // Stilizează header-ul
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F3FF' }
        };
      }
      
      this.reportProgress('generating', 60, 'Generare Excel...');
      
      // Adaugă datele
      data.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });
      
      // Auto-dimensionare coloane
      worksheet.columns.forEach((column) => {
        column.width = 15;
      });
      
      this.reportProgress(TransactionType.SAVING, 80, 'Salvare fișier...');
      
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      saveAs(blob, `${filename}.xlsx`);
      
      this.reportProgress('complete', 100, 'Export complet!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      this.reportProgress('error', 0, `Eroare export Excel: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Export PDF lazy-loaded
   */
  async exportToPDF(data: any[], filename: string, title: string = BUTTONS.EXPORT) {
    try {
      this.reportProgress('loading', 10, 'Încărcare librării PDF...');
      
      const { jsPDF, saveAs } = await loadPDFExport();
      
      this.reportProgress('processing', 30, 'Procesare date...');
      
      const doc = new jsPDF();
      
      // Titlu
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      
      this.reportProgress('generating', 60, 'Generare PDF...');
      
      // Tabel cu date
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const rows = data.map(row => Object.values(row));
        
        (doc as any).autoTable({
          head: [headers],
          body: rows,
          startY: 30,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });
      }
      
      this.reportProgress(TransactionType.SAVING, 80, 'Salvare fișier...');
      
      doc.save(`${filename}.pdf`);
      
      this.reportProgress('complete', 100, 'Export complet!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      this.reportProgress('error', 0, `Eroare export PDF: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Export PNG screenshot lazy-loaded
   */
  async exportToPNG(element: HTMLElement, filename: string, options: any = {}) {
    try {
      this.reportProgress('loading', 10, 'Încărcare librării screenshot...');
      
      const html2canvas = await loadHTML2Canvas();
      
      this.reportProgress('generating', 50, 'Generare screenshot...');
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // High DPI
        ...options
      });
      
      this.reportProgress(TransactionType.SAVING, 80, 'Salvare imagine...');
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.png`;
          link.click();
          URL.revokeObjectURL(url);
          
          this.reportProgress('complete', 100, 'Export complet!');
        }
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      this.reportProgress('error', 0, `Eroare export PNG: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Export CSV lazy-loaded
   */
  async exportToCSV(data: any[], filename: string) {
    try {
      this.reportProgress('loading', 10, 'Încărcare librării CSV...');
      
      const { saveAs } = await loadCSVExport();
      
      this.reportProgress('processing', 50, 'Procesare CSV...');
      
      // Generare CSV manual pentru control complet
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            // Escape pentru valori cu virgule sau ghilimele
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');
      
      this.reportProgress(TransactionType.SAVING, 80, 'Salvare fișier...');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}.csv`);
      
      this.reportProgress('complete', 100, 'Export complet!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      this.reportProgress('error', 0, `Eroare export CSV: ${errorMessage}`);
      throw error;
    }
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Hook pentru progress tracking în componente React
 */
export const useExportProgress = () => {
  const [progress, setProgress] = React.useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleProgress = (progress: ExportProgress) => {
    setProgress(progress);
    setIsExporting(progress.stage !== 'complete' && progress.stage !== 'error');
  };

  const resetProgress = () => {
    setProgress(null);
    setIsExporting(false);
  };

  return { progress, isExporting, handleProgress, resetProgress };
};

/**
 * Quick export functions pentru utilizare simplă
 */
export const quickExport = {
  async excel(data: any[], filename: string, onProgress?: ExportProgressCallback) {
    const manager = new LazyExportManager(onProgress);
    return manager.exportToExcel(data, filename);
  },

  async pdf(data: any[], filename: string, title?: string, onProgress?: ExportProgressCallback) {
    const manager = new LazyExportManager(onProgress);
    return manager.exportToPDF(data, filename, title);
  },

  async csv(data: any[], filename: string, onProgress?: ExportProgressCallback) {
    const manager = new LazyExportManager(onProgress);
    return manager.exportToCSV(data, filename);
  },

  async png(element: HTMLElement, filename: string, options?: any, onProgress?: ExportProgressCallback) {
    const manager = new LazyExportManager(onProgress);
    return manager.exportToPNG(element, filename, options);
  }
}; 
