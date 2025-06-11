/**
 * 🔄 LEGACY COMPATIBILITY - useExport Hook
 * 
 * This hook maintains backwards compatibility for existing components.
 * It wraps the new unified export functionality with the old interface.
 * 
 * @deprecated Consider migrating to useUnifiedExport for new code
 */

import { useCallback } from "react";
import { useUnifiedExport } from "./shared/useUnifiedExport";
import { ExportFormat } from "@budget-app/shared-constants";
import type { Transaction } from "../types/Transaction";

// Legacy interface for backwards compatibility
interface ExportOptions {
  filename?: string;
  title?: string;
  onProgress?: (progress: number) => void;
  includeHeaders?: boolean;
  dateRange?: { from: string; to: string };
}

interface ExportState {
  isExporting: boolean;
  progress: number;
  error: string | null;
}

interface UseExportReturn {
  exportData: (
    transactions: Transaction[],
    format: ExportFormat,
    options?: ExportOptions,
  ) => Promise<void>;
  state: ExportState;
  resetState: () => void;
}

/**
 * Legacy export hook - wraps unified implementation
 * @deprecated Use useUnifiedExport instead for new implementations
 */
export const useExport = (): UseExportReturn => {
  const unified = useUnifiedExport();

  // Adapter function to maintain legacy interface
  const exportData = useCallback(
    async (
      transactions: Transaction[],
      format: ExportFormat,
      options?: ExportOptions,
    ) => {
      await unified.exportData(transactions, format, options);
    },
    [unified.exportData],
  );

  return {
    exportData,
    state: unified.state,
    resetState: unified.resetState,
  };
};
