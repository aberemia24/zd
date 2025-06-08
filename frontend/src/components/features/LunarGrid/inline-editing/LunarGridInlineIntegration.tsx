import React, { useCallback, useMemo } from "react";
import { EditableCell } from "./EditableCell";
import { useGridNavigation } from "./useGridNavigation";
import { TransactionType } from "@budget-app/shared-constants";

/**
 * Component pentru integrarea inline editing cu LunarGrid existent
 * Înlocuiește funcționalitatea modalurilor cu direct manipulation
 */

export interface LunarGridCellData {
  category: string;
  subcategory?: string;
  day: number;
  amount: number;
  type: TransactionType;
}

export interface LunarGridInlineIntegrationProps {
  /** Grid data pentru celule */
  gridData: LunarGridCellData[][];

  /** Handler pentru salvarea unei celule */
  onCellSave: (data: LunarGridCellData) => Promise<void>;

  /** Referință către containerul grid */
  gridRef: React.RefObject<HTMLDivElement>;

  /** Dacă grid-ul este readonly */
  isReadonly?: boolean;

  /** Callback pentru focus change */
  onFocusChange?: (row: number, col: number) => void;
}

export const LunarGridInlineIntegration: React.FC<
  LunarGridInlineIntegrationProps
> = ({ gridData, onCellSave, gridRef, isReadonly = false, onFocusChange }) => {
  // Calculate grid dimensions
  const totalRows = gridData.length;
  const totalCols = gridData[0]?.length || 0;

  // Handle cell focus
  const handleCellFocus = useCallback(
    (row: number, col: number) => {
      onFocusChange?.(row, col);
    },
    [onFocusChange],
  );

  // Handle cell edit
  const handleCellEdit = useCallback((row: number, col: number) => {
    // Trigger edit pentru celula specificată
    // Această funcție va fi gestionată de componenta părinte
  }, []);

  // Grid navigation hook
  const { focusedCell, handleCellClick } = useGridNavigation({
    gridRef,
    totalRows,
    totalCols,
    onCellFocus: handleCellFocus,
    onCellEdit: handleCellEdit,
    isEnabled: !isReadonly,
  });

  // Generate cell save handler pentru o celulă specifică
  const createCellSaveHandler = useCallback(
    (cellData: LunarGridCellData) => {
      return async (value: string | number): Promise<void> => {
        const updatedData: LunarGridCellData = {
          ...cellData,
          amount: typeof value === "number" ? value : parseFloat(String(value)),
        };

        await onCellSave(updatedData);
      };
    },
    [onCellSave],
  );

  // Generate validation type based on cell data
  const getValidationType = useCallback(
    (
      cellData: LunarGridCellData,
    ): "amount" | "text" | "percentage" | "date" => {
      // Pentru LunarGrid, majoritatea celulelor sunt amounts
      return "amount";
    },
    [],
  );

  // Generate cell ID pentru tracking
  const generateCellId = useCallback(
    (row: number, col: number, cellData: LunarGridCellData): string => {
      return `grid-${row}-${col}-${cellData.category}-${cellData.subcategory || "null"}-${cellData.day}`;
    },
    [],
  );

  // Render grid cells
  const renderGridCells = useMemo(() => {
    return gridData.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row flex">
        {row.map((cellData, colIndex) => {
          const cellId = generateCellId(rowIndex, colIndex, cellData);
          const isSelected =
            focusedCell.row === rowIndex && focusedCell.col === colIndex;
          const validationType = getValidationType(cellData);

          return (
            <EditableCell
              key={cellId}
              cellId={cellId}
              value={cellData.amount}
              onSave={createCellSaveHandler(cellData)}
              validationType={validationType}
              isSelected={isSelected}
              isReadonly={isReadonly}
              onFocus={() => handleCellClick(rowIndex, colIndex)}
              className="min-w-[100px] border border-gray-200"
            />
          );
        })}
      </div>
    ));
  }, [
    gridData,
    focusedCell,
    isReadonly,
    generateCellId,
    getValidationType,
    createCellSaveHandler,
    handleCellClick,
  ]);

  return (
    <div
      ref={gridRef}
      className="lunar-grid-inline-container"
      data-testid="lunar-grid-inline-container"
    >
      {renderGridCells}
    </div>
  );
};

/**
 * Hook pentru integrarea cu LunarGrid existent
 * Înlocuiește modalurile cu inline editing
 */
export const useLunarGridInlineIntegration = () => {
  // Convert existing modal triggers to inline editing
  const convertModalToInline = useCallback(
    (modalType: "advanced" | "recurring" | "bulk") => {
      switch (modalType) {
        case "advanced":
          // Înlocuiește AdvancedEditModal cu inline editing
          return {
            triggerEdit: (cellData: LunarGridCellData) => {
              // Trigger inline edit direct pe celulă
      
            },
          };

        case "recurring":
          // Înlocuiește RecurringSetupModal cu inline recurring setup
          return {
            setupRecurring: (cellData: LunarGridCellData) => {
              // Inline recurring setup
      
            },
          };

        case "bulk":
          // Înlocuiește BulkOperationsModal cu inline bulk operations
          return {
            performBulkOperation: (
              operation: string,
              cells: LunarGridCellData[],
            ) => {
              // Inline bulk operations
              console.log("Performing bulk operation:", operation, cells);
            },
          };

        default:
          return {};
      }
    },
    [],
  );

  return {
    convertModalToInline,
  };
};
