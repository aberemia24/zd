/**
 * 🚀 UNIFIED EXPORT HOOK - Consolidated Export Functionality
 * 
 * Consolidates duplicate export functionality from:
 * - hooks/useExport.tsx (React Query approach)
 * - utils/lazyExportUtils.tsx useExportProgress (basic state approach)
 * 
 * Provides unified interface with backwards compatibility for both patterns
 */

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  ExportFormat, 
  ExportProgress, 
  ExportProgressCallback,
  DEFAULT_EXPORT_PROGRESS 
} from "@budget-app/shared-constants";
import { LazyExportManager } from "../../utils/lazyExportUtils";
import { MESAJE } from "@budget-app/shared-constants";
import type { Transaction } from "@budget-app/shared-constants";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ExportState {
  isExporting: boolean;
  progress: number;
  error: string | null;
  status?: string;
}

export interface UnifiedExportOptions {
  filename?: string;
  title?: string;
  includeHeaders?: boolean;
  dateRange?: { from: string; to: string };
  onProgress?: (progress: number) => void;
}

export interface UseUnifiedExportReturn {
  // Primary export function
  exportData: (
    transactions: Transaction[],
    format: ExportFormat,
    options?: UnifiedExportOptions,
  ) => Promise<void>;
  
  // State management
  state: ExportState;
  resetState: () => void;
  
  // Progress tracking (legacy compatibility)
  progress: ExportProgress | null;
  isExporting: boolean;
  handleProgress: (progress: ExportProgress) => void;
  
  // Quick export functions (legacy compatibility)
  quickExport: {
    excel: (data: any[], filename: string) => Promise<void>;
    pdf: (data: any[], filename: string, title?: string) => Promise<void>;
    csv: (data: any[], filename: string) => Promise<void>;
    png: (element: HTMLElement, filename: string, options?: any) => Promise<void>;
  };
}

// =============================================================================
// UNIFIED EXPORT HOOK
// =============================================================================

/**
 * Unified hook for all export functionality
 * Combines React Query mutation pattern with progress tracking
 */
export const useUnifiedExport = (): UseUnifiedExportReturn => {
  // Dual state management for compatibility
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null,
  });
  
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Progress callback for React Query approach  
  const onProgressCallback = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  // Progress handler for legacy approach
  const handleProgress = useCallback((progress: ExportProgress) => {
    setProgress(progress);
    setIsExporting(progress.stage !== 'complete' && progress.stage !== 'error');
    
    // Sync with state
    setState(prev => ({
      ...prev,
      progress: progress.progress,
      isExporting: progress.stage !== 'complete' && progress.stage !== 'error',
      error: progress.stage === 'error' ? progress.error || 'Export error' : null,
      status: progress.message
    }));
  }, []);

  // React Query mutation for transaction exports
  const exportMutation = useMutation({
    mutationFn: async ({
      transactions,
      format,
      options,
    }: {
      transactions: Transaction[];
      format: ExportFormat;
      options?: UnifiedExportOptions;
    }) => {
      setState((prev) => ({
        ...prev,
        isExporting: true,
        error: null,
        progress: 0,
      }));

      try {
        // Use LazyExportManager for consistent behavior
        const manager = new LazyExportManager(handleProgress);
        
        // Transform transactions to export format
        const exportData = transactions.map(t => ({
          Date: t.date,
          Type: t.type,
          Amount: t.amount,
          Category: t.category,
          Subcategory: t.subcategory || '',
          Description: t.description || ''
        }));

        // Apply date filtering if specified
        let filteredData = exportData;
        if (options?.dateRange) {
          filteredData = exportData.filter(item => {
            const itemDate = new Date(item.Date);
            const fromDate = new Date(options.dateRange!.from);
            const toDate = new Date(options.dateRange!.to);
            return itemDate >= fromDate && itemDate <= toDate;
          });
        }

        const filename = options?.filename || `transactions_${Date.now()}`;
        const title = options?.title || 'Transactions Export';

        // Route to appropriate export method
        switch (format) {
          case 'excel':
            await manager.exportToExcel(filteredData, filename);
            break;
          case 'pdf':
            await manager.exportToPDF(filteredData, filename, title);
            break;
          case 'csv':
            await manager.exportToCSV(filteredData, filename);
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        setState((prev) => ({ ...prev, progress: 100 }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : MESAJE.EROARE_NECUNOSCUTA;
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      } finally {
        setState((prev) => ({ ...prev, isExporting: false }));
      }
    },
    onError: (error: Error) => {
      setState((prev) => ({
        ...prev,
        error: error.message || MESAJE.EROARE_EXPORT,
        isExporting: false,
      }));
    },
  });

  // Primary export function
  const exportData = useCallback(
    async (
      transactions: Transaction[],
      format: ExportFormat,
      options?: UnifiedExportOptions,
    ) => {
      await exportMutation.mutateAsync({ transactions, format, options });
    },
    [exportMutation],
  );

  // Reset state function
  const resetState = useCallback(() => {
    setState({
      isExporting: false,
      progress: 0,
      error: null,
    });
    setProgress(null);
    setIsExporting(false);
  }, []);

  // Quick export functions for legacy compatibility
  const quickExport = {
    excel: useCallback(async (data: any[], filename: string) => {
      const manager = new LazyExportManager(handleProgress);
      return manager.exportToExcel(data, filename);
    }, [handleProgress]),

    pdf: useCallback(async (data: any[], filename: string, title?: string) => {
      const manager = new LazyExportManager(handleProgress);
      return manager.exportToPDF(data, filename, title);
    }, [handleProgress]),

    csv: useCallback(async (data: any[], filename: string) => {
      const manager = new LazyExportManager(handleProgress);
      return manager.exportToCSV(data, filename);
    }, [handleProgress]),

    png: useCallback(async (element: HTMLElement, filename: string, options?: any) => {
      const manager = new LazyExportManager(handleProgress);
      return manager.exportToPNG(element, filename, options);
    }, [handleProgress]),
  };

  return {
    exportData,
    state,
    resetState,
    progress,
    isExporting,
    handleProgress,
    quickExport,
  };
};

export default useUnifiedExport; 