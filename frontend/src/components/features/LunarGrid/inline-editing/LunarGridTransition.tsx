import React, { useCallback, useState, useRef } from "react";
import LunarGridTanStack from "../LunarGridTanStack";
import {
  useInlineCellEdit,
  useGridNavigation,
  usePerformanceOptimization,
  LunarGridCellData,
} from "./index";
import { TransactionType } from "@shared-constants";

/**
 * Component de tranziție pentru înlocuirea modalurilor cu inline editing
 * Implementează treptat direct manipulation în loc de modal system
 */

export interface LunarGridTransitionProps {
  year: number;
  month: number;
  /** Dacă să folosească inline editing în loc de modaluri */
  useInlineEditing?: boolean;
  /** Callback pentru salvarea tranzacțiilor */
  onTransactionSave?: (data: LunarGridCellData) => Promise<void>;
}

export const LunarGridTransition: React.FC<LunarGridTransitionProps> = ({
  year,
  month,
  useInlineEditing = true,
  onTransactionSave,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  // Performance optimization pentru grid mare
  const { shouldOptimize, measurePerformance, setupEventDelegation } =
    usePerformanceOptimization({
      gridRef: gridRef as React.RefObject<HTMLElement>,
      totalCells: 31 * 10, // Aproximativ pentru o lună
      enableVirtualScrolling: false,
      performanceThreshold: 100,
    });

  // Grid navigation pentru Excel-like behavior
  const {
    focusedCell,
    handleCellClick,
    handleKeyDown: navigationKeyDown,
  } = useGridNavigation({
    gridRef: gridRef as React.RefObject<HTMLDivElement>,
    totalRows: 31,
    totalCols: 10,
    onCellFocus: (row, col) => {
      console.log(`Cell focused: ${row}, ${col}`);
    },
    onCellEdit: (row, col) => {
      console.log(`Cell edit triggered: ${row}, ${col}`);
    },
    isEnabled: useInlineEditing,
  });

  // Handler pentru salvarea celulelor
  const handleCellSave = useCallback(
    async (data: LunarGridCellData) => {
      measurePerformance("cell-save", () => {
        console.log("Saving cell data:", data);
      });

      if (onTransactionSave) {
        await onTransactionSave(data);
      }
    },
    [onTransactionSave, measurePerformance],
  );

  // Setup event delegation pentru performance
  React.useEffect(() => {
    if (shouldOptimize) {
      const cleanup = setupEventDelegation();
      return cleanup;
    }
  }, [shouldOptimize, setupEventDelegation]);

  // Dacă inline editing este activat, folosim noua arhitectură
  if (useInlineEditing) {
    return (
      <div
        ref={gridRef}
        className="lunar-grid-transition-container"
        data-testid="lunar-grid-transition"
      >
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            🚀 Inline Editing Mode Active
          </h3>
          <p className="text-xs text-blue-600">
            Modalurile au fost înlocuite cu inline editing. Folosiți F2 pentru
            editare, Enter pentru salvare, Escape pentru anulare.
          </p>
          <div className="mt-2 text-xs text-blue-500">
            Performance: {shouldOptimize ? "Optimized" : "Standard"} | Focus:
            Row {focusedCell.row}, Col {focusedCell.col}
          </div>
        </div>

        {/* Componenta LunarGrid existentă cu inline editing overlay */}
        <div className="relative">
          <LunarGridTanStack year={year} month={month} />

          {/* Overlay pentru inline editing - va fi implementat în Phase 2 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Placeholder pentru inline editing overlay */}
          </div>
        </div>
      </div>
    );
  }

  // Fallback la componenta originală cu modaluri
  return (
    <div data-testid="lunar-grid-legacy">
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          ⚠️ Legacy Modal Mode
        </h3>
        <p className="text-xs text-yellow-600">
          Folosind modalurile existente. Activați inline editing pentru
          experiența nouă.
        </p>
      </div>

      <LunarGridTanStack year={year} month={month} />
    </div>
  );
};

/**
 * Hook pentru gestionarea tranziției de la modaluri la inline editing
 */
export const useLunarGridTransition = () => {
  const [useInlineEditing, setUseInlineEditing] = useState(true);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const enableInlineEditing = useCallback(() => {
    setUseInlineEditing(true);
    setTransitionProgress(100);
  }, []);

  const disableInlineEditing = useCallback(() => {
    setUseInlineEditing(false);
    setTransitionProgress(0);
  }, []);

  const getModalReplacementStatus = useCallback(() => {
    return {
      advancedEditModal: useInlineEditing ? "replaced" : "active",
      recurringSetupModal: useInlineEditing ? "replaced" : "active",
      bulkOperationsModal: useInlineEditing ? "replaced" : "active",
      quickAddModal: "kept", // Păstrat conform PRD
      transitionProgress,
    };
  }, [useInlineEditing, transitionProgress]);

  return {
    useInlineEditing,
    enableInlineEditing,
    disableInlineEditing,
    getModalReplacementStatus,
    transitionProgress,
  };
};
