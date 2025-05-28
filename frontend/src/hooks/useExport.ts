import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ExportManager,
  ExportFormat,
  ExportOptions,
} from "../utils/ExportManager";
import type { Transaction } from "../types/Transaction";
import { MESAJE } from "@shared-constants/messages";

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
 * Hook specializat pentru export rapoarte
 * Implementează progress tracking și error handling
 */
export const useExport = (): UseExportReturn => {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null,
  });

  // Progress callback pentru tracking export
  const onProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  // Mutation pentru export
  const exportMutation = useMutation({
    mutationFn: async ({
      transactions,
      format,
      options,
    }: {
      transactions: Transaction[];
      format: ExportFormat;
      options?: ExportOptions;
    }) => {
      setState((prev) => ({
        ...prev,
        isExporting: true,
        error: null,
        progress: 0,
      }));

      try {
        await ExportManager.exportTransactions(transactions, format, {
          ...options,
          onProgress,
        });

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

  const exportData = useCallback(
    async (
      transactions: Transaction[],
      format: ExportFormat,
      options?: ExportOptions,
    ) => {
      await exportMutation.mutateAsync({ transactions, format, options });
    },
    [exportMutation],
  );

  const resetState = useCallback(() => {
    setState({
      isExporting: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    exportData,
    state,
    resetState,
  };
};
