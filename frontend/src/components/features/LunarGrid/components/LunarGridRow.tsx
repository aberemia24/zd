import React, { useMemo } from 'react';
import { Row, flexRender, Table } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { getTransactionTypeForCategory } from '@shared-constants/category-mapping';
import { TransactionType } from '@shared-constants';

// Constants și shared
import { UI, LUNAR_GRID } from "@shared-constants";

// Components
import LunarGridSubcategoryRowCell from "./LunarGridSubcategoryRowCell";
import LunarGridAddSubcategoryRow from "./LunarGridAddSubcategoryRow";
import LunarGridCell from "./LunarGridCell";

// Types
import { TransformedTableDataRow } from "../hooks/useLunarGridTable";
import { CellPosition } from "../hooks/useKeyboardNavigation";

// Utilities - MIGRATED TO CVA-V2
import { 
  cn,
  gridRow,
  gridCell,
  gridExpandIcon,
  gridInput,
  textProfessional,
  hoverScale,
  focusRing,
  type GridRowProps,
  type GridCellProps
} from "../../../../styles/cva-v2";

// Tip pentru celula evidențiată (simplified version of CellPosition)
interface HighlightedCell {
  category: string;
  subcategory: string | undefined;
  day: number;
}

// Interface pentru categoria cu subcategoriile sale
interface CategoryWithSubcategories {
  name: string;
  subcategories?: Array<{
    name: string;
    isCustom?: boolean;
  }>;
}

interface LunarGridRowProps {
  row: Row<TransformedTableDataRow>;
  level?: number;
  categories: CategoryWithSubcategories[];
  _expandedRows: Record<string, boolean>;
  subcategoryAction: { type: 'edit' | 'delete'; category: string; subcategory: string } | null;
  editingSubcategoryName: string;
  _highlightedCell: HighlightedCell | null;
  addingSubcategory: string | null;
  newSubcategoryName: string;
  table: Table<TransformedTableDataRow>;
  transactionMap: Map<string, string>;
  // Event handlers
  onExpandToggle: (rowId: string, isExpanded: boolean) => void;
  onSubcategoryEdit: (category: string, subcategory: string, newName: string) => void;
  _onSubcategoryDelete: (category: string, subcategory: string) => void;
  onEditingValueChange: (value: string) => void;
  onClearSubcategoryAction: () => void;
  onStartEditingSubcategory: (category: string, subcategory: string) => void;
  onStartDeletingSubcategory: (category: string, subcategory: string) => void;
  onCellSave: (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null) => Promise<void>;
  onSingleClickModal: (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null, element: HTMLElement) => void;
  onCellClick: (position: CellPosition, modifiers: { ctrlKey: boolean; shiftKey: boolean; metaKey: boolean }) => void;
  onAddSubcategory: (category: string) => void;
  onCancelAddingSubcategory: () => void;
  onSetAddingSubcategory: (category: string | null) => void;
  onSetNewSubcategoryName: (name: string) => void;
  // Position functions
  isPositionFocused: (position: CellPosition) => boolean;
  isPositionSelected: (position: CellPosition) => boolean;
}

/**
 * LunarGridRow Component - Excel-like row rendering with Unified CVA
 * 🎨 Migrated to Mocha Mousse 2025 Design System
 * 🌙 Full Dark Mode Support
 * 
 * Features:
 * - Category și subcategory row types cu professional styling
 * - Expandable categories cu smooth animations
 * - Inline editing support cu sophisticated focus states
 * - Dark mode compatibility cu Mocha Mousse palette
 * - Performance optimized cu consolidated CVA variants și React.memo
 */
const LunarGridRowComponent: React.FC<LunarGridRowProps> = ({
  row,
  level = 0,
  categories,
  _expandedRows,
  subcategoryAction,
  editingSubcategoryName,
  _highlightedCell,
  addingSubcategory,
  newSubcategoryName,
  table,
  transactionMap,
  onExpandToggle,
  onSubcategoryEdit,
  _onSubcategoryDelete,
  onEditingValueChange,
  onClearSubcategoryAction,
  onStartEditingSubcategory,
  onStartDeletingSubcategory,
  onCellSave,
  onSingleClickModal,
  onCellClick,
  onAddSubcategory,
  onCancelAddingSubcategory,
  onSetAddingSubcategory,
  onSetNewSubcategoryName,
  isPositionFocused,
  isPositionSelected,
}) => {
  const original = row.original;
  
  // Memoized computations pentru performance - evită recalcularea la fiecare render
  const rowMetadata = useMemo(() => {
    const isCategory = !original.subcategory;
    const isSubcategory = !!original.subcategory;
    const isTotalRow = original.category === 'TOTAL';
    
    return { isCategory, isSubcategory, isTotalRow };
  }, [original.subcategory, original.category]);

  const { isCategory, isSubcategory, isTotalRow } = rowMetadata;

  // Determine row type for unified CVA styling - MEMOIZED
  const rowType = useMemo((): GridRowProps['type'] => {
    if (isTotalRow) {return 'total';}
    if (isCategory) {return 'category';}
    return 'subcategory';
  }, [isTotalRow, isCategory]);

  // Determine row state for unified CVA styling - MEMOIZED
  const rowState = useMemo((): GridRowProps['state'] => {
    if (isCategory && row.getIsExpanded()) {return 'expanded';}
    return undefined;
  }, [isCategory, row]);

  return (
    <>
      <tr className={cn(
        gridRow({ 
          type: rowType,
          state: rowState
        }),
        "group" // Preserve group hover functionality
      )}>
        {row.getVisibleCells().map((cell, cellIdx) => {
          const isFirstCell = cellIdx === 0;
          const isDayCell = cell.column.id.includes("day");
          const isTotalCell = cell.column.id === "total";
          
          // Get cell type for unified CVA styling
          const getCellType = (): GridCellProps['type'] => {
            if (isFirstCell) {
              if (isCategory) {return 'category';}
              if (isSubcategory) {return 'subcategory';}
            }
            if (isTotalCell) {return 'balance';}
            return 'value';
          };

          // Get cell state for unified CVA styling
          const getCellState = (): GridCellProps['state'] => {
            if (isDayCell) {
              const day = parseInt(cell.column.id.split("-")[1]);
              const cellPosition: CellPosition = {
                category: original.category,
                subcategory: original.subcategory,
                day,
                rowIndex: Math.max(0, table.getRowModel().rows.findIndex((row) => 
                  row.original.category === original.category && 
                  row.original.subcategory === original.subcategory
                )),
                colIndex: day - 1,
              };
              
              if (isPositionFocused(cellPosition)) {return 'active';}
              if (isPositionSelected(cellPosition)) {return 'selected';}
            }

            // Value state based on content
            const cellValue = flexRender(cell.column.columnDef.cell, cell.getContext());
            if (typeof cellValue === 'string' || typeof cellValue === 'number') {
              const numValue = parseFloat(cellValue.toString());
              if (!isNaN(numValue)) {
                if (numValue > 0) {return 'positive';}
                if (numValue < 0) {return 'negative';}
              }
            }

            return 'default';
          };

          // Value classes using transaction type colors
          const getValueClasses = () => {
            const cellValue = flexRender(cell.column.columnDef.cell, cell.getContext());
            if (typeof cellValue === 'string' || typeof cellValue === 'number') {
              const numValue = parseFloat(cellValue.toString());
              if (!isNaN(numValue) && numValue !== 0) {
                // Determină tipul de tranzacție pe baza categoriei
                const transactionType = getTransactionTypeForCategory(original.category);
                
                if (transactionType === TransactionType.INCOME) {
                  return 'text-green-600'; // Verde pentru venituri
                } else if (transactionType === TransactionType.SAVING) {
                  return 'text-blue-600'; // Albastru pentru economii/investiții
                } else {
                  // EXPENSE sau default
                  return 'text-red-600'; // Roșu pentru cheltuieli
                }
              }
            }
            return 'text-gray-600'; // Neutral pentru zero/empty
          };

          return (
            <td
              key={cell.id}
              className={cn(
                gridCell({
                  type: getCellType(),
                  state: getCellState()
                }),
                textProfessional({ variant: "default" }),
                isFirstCell && level > 0 && "pl-8",
                isDayCell && cn(
                  hoverScale({ intensity: "subtle" }),
                  focusRing({ variant: "default" }),
                  "transition-all duration-150"
                ),
                isTotalCell && "font-semibold tabular-nums",
                getValueClasses()
              )}
              title={
                isCategory && isDayCell
                  ? UI.LUNAR_GRID_TOOLTIPS.CALCULATED_SUM
                  : undefined
              }
            >
              {isFirstCell && isCategory ? (
                // Category Cell cu unified CVA expand icon
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    row.toggleExpanded();
                    onExpandToggle(row.id, !row.getIsExpanded());
                  }}
                  title={row.getIsExpanded() ? LUNAR_GRID.COLLAPSE_CATEGORY_TITLE : LUNAR_GRID.EXPAND_CATEGORY_TITLE}
                  data-testid={`toggle-category-${original.category}`}
                >
                  <ChevronRight 
                    className={cn(
                      gridExpandIcon({ 
                        variant: "professional",
                        expanded: row.getIsExpanded()
                      })
                    )}
                  />
                  <span className={cn(
                    "font-semibold",
                    textProfessional({ variant: "default" })
                  )}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ) : isFirstCell && isSubcategory ? (
                // Subcategory Cell
                <LunarGridSubcategoryRowCell
                  category={original.category}
                  subcategory={original.subcategory || ''}
                  isCustom={(() => {
                    const categoryData = categories.find(cat => cat.name === original.category);
                    const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
                    return subcategoryData?.isCustom || false;
                  })()}
                  isEditing={
                    subcategoryAction?.type === 'edit' && 
                    subcategoryAction.category === original.category && 
                    subcategoryAction.subcategory === original.subcategory
                  }
                  editingValue={editingSubcategoryName}
                  onEditingValueChange={onEditingValueChange}
                  onSaveEdit={() => onSubcategoryEdit(original.category, original.subcategory || '', editingSubcategoryName)}
                  onCancelEdit={onClearSubcategoryAction}
                  onStartEdit={() => onStartEditingSubcategory(original.category, original.subcategory || '')}
                  onStartDelete={() => onStartDeletingSubcategory(original.category, original.subcategory || '')}
                />
              ) : isDayCell && (isCategory || isSubcategory) ? (
                // Day Cell cu unified CVA input styling
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    const day = parseInt(cell.column.id.split("-")[1]);
                    const cellPosition: CellPosition = {
                      category: original.category,
                      subcategory: original.subcategory,
                      day,
                      rowIndex: Math.max(0, table.getRowModel().rows.findIndex((row) => 
                        row.original.category === original.category && 
                        row.original.subcategory === original.subcategory
                      )),
                      colIndex: day - 1,
                    };

                    onCellClick(cellPosition, {
                      ctrlKey: e.ctrlKey,
                      shiftKey: e.shiftKey,
                      metaKey: e.metaKey,
                    });
                  }}
                  className="w-full h-full min-h-[40px] flex items-center justify-center cursor-pointer"
                >
                  <LunarGridCell
                    cellId={`${original.category}-${original.subcategory || ''}-${cell.column.id.split("-")[1]}`}
                    value={(() => {
                      const cellValue = cell.getValue();
                      if (cellValue === null || cellValue === undefined || cellValue === '') {return '';}
                      return String(cellValue);
                    })()}
                    onSave={async (value: string | number) => {
                      const day = parseInt(cell.column.id.split("-")[1]);
                      const transactionKey = `${original.category}-${original.subcategory || ''}-${day}`;
                      const transactionId = transactionMap.get(transactionKey) || null;
                      await onCellSave(original.category, original.subcategory, day, value, transactionId);
                    }}
                    onSingleClick={(e: React.MouseEvent) => {
                      const day = parseInt(cell.column.id.split("-")[1]);
                      const transactionKey = `${original.category}-${original.subcategory || ''}-${day}`;
                      const transactionId = transactionMap.get(transactionKey) || null;
                      const cellValue = cell.getValue();
                      
                      let safeValue: string | number = 0;
                      if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
                        if (typeof cellValue === 'number') {
                          safeValue = cellValue;
                        } else {
                          const stringValue = String(cellValue);
                          const numericValue = parseFloat(stringValue.replace(/[^\d,.-]/g, '').replace(',', '.'));
                          safeValue = isNaN(numericValue) ? stringValue : numericValue;
                        }
                      }
                      
                      onSingleClickModal(original.category, original.subcategory, day, safeValue, transactionId, e.currentTarget as HTMLElement);
                    }}
                    className={cn(
                      gridInput({ variant: "default", type: "number" }),
                      "text-center min-h-[40px] flex items-center justify-center"
                    )}
                    placeholder="0"
                  />
                </div>
              ) : (
                // Regular cell content
                <div className="flex items-center justify-center min-h-[40px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              )}
            </td>
          );
        })}
      </tr>

      {/* Add Subcategory Row - cu unified CVA styling */}
      {isCategory && row.getIsExpanded() && addingSubcategory === original.category && (
        <LunarGridAddSubcategoryRow
          category={original.category}
          isAdding={true}
          inputValue={newSubcategoryName}
          totalColumns={table.getFlatHeaders().length}
          onInputChange={onSetNewSubcategoryName}
          onSave={() => onAddSubcategory(original.category)}
          onCancel={onCancelAddingSubcategory}
          onStartAdd={() => onSetAddingSubcategory(original.category)}
        />
      )}
    </>
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
const LunarGridRow = React.memo(LunarGridRowComponent, (prevProps, nextProps) => {
  // Custom comparison pentru props critice la performance
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.level === nextProps.level &&
    prevProps.editingSubcategoryName === nextProps.editingSubcategoryName &&
    prevProps.addingSubcategory === nextProps.addingSubcategory &&
    prevProps.newSubcategoryName === nextProps.newSubcategoryName &&
    JSON.stringify(prevProps._expandedRows) === JSON.stringify(nextProps._expandedRows) &&
    JSON.stringify(prevProps.subcategoryAction) === JSON.stringify(nextProps.subcategoryAction) &&
    JSON.stringify(prevProps._highlightedCell) === JSON.stringify(nextProps._highlightedCell) &&
    prevProps.row.getIsExpanded() === nextProps.row.getIsExpanded()
    // Event handlers se vor schimba în mod normal și nu trebuie comparate
  );
});

export default LunarGridRow; 