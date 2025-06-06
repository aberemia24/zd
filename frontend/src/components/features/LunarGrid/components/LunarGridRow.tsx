import React, { useMemo } from 'react';
import { Row, flexRender, Table } from "@tanstack/react-table";
import { ChevronRight, Lock } from "lucide-react";
import { getTransactionTypeForCategory } from '@shared-constants/category-mapping';
import { TransactionType, VALIDATION } from '@shared-constants';

// Constants și shared
import { UI, LUNAR_GRID } from "@shared-constants";

// Components
import LunarGridSubcategoryRowCell from "./LunarGridSubcategoryRowCell";
import LunarGridAddSubcategoryRow from "./LunarGridAddSubcategoryRow";
import LunarGridCell from "./LunarGridCell";
import Tooltip from "../../../primitives/Tooltip/Tooltip";

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
  balanceDisplay,
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
  const { original } = row;
  const isCategory = original.isCategory;
  const isSubcategory = !isCategory;
  
  // Memoized computations pentru performance - evită recalcularea la fiecare render
  const rowMetadata = useMemo(() => {
    const isTotalRow = original.category === 'TOTAL';
    
    return { isTotalRow };
  }, [original.category]);

  const { isTotalRow } = rowMetadata;

  // 🔧 UPDATED LOGIC: Calculează dacă acest row este ultima subcategorie din categoria sa
  const isLastSubcategoryInCategory = useMemo(() => {
    if (isCategory || !original.category) return false;
    
    const tableRows = table.getRowModel().rows;
    const subcategoryRows = tableRows.filter(r => 
      !r.original.isCategory && r.original.category === original.category
    );
    
    return subcategoryRows.length > 0 && subcategoryRows[subcategoryRows.length - 1].id === row.id;
  }, [isCategory, original.category, table, row.id]);

  // 🔒 LOCK ICON LOGIC: Verifică dacă categoria a atins limita de 5 subcategorii custom
  const shouldShowLockIcon = useMemo(() => {
    if (!isCategory) return false;
    
    const categoryData = categories.find(cat => cat.name === original.category);
    const customSubcategoriesCount = categoryData?.subcategories?.filter(sub => sub.isCustom).length || 0;
    
    return customSubcategoriesCount >= VALIDATION.MAX_CUSTOM_SUBCATEGORIES;
  }, [isCategory, categories, original.category]);

  // 💡 TOOLTIP LOGIC: Verifică dacă să afișeze tooltip pe ultima subcategorie
  const shouldShowTooltipOnLastSubcategory = useMemo(() => {
    if (isCategory || !isLastSubcategoryInCategory) return false;
    
    const categoryData = categories.find(cat => cat.name === original.category);
    const customSubcategoriesCount = categoryData?.subcategories?.filter(sub => sub.isCustom).length || 0;
    
    return customSubcategoriesCount >= VALIDATION.MAX_CUSTOM_SUBCATEGORIES;
  }, [isCategory, isLastSubcategoryInCategory, categories, original.category]);

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

          // 🎨 Value classes using transaction type colors - aplicat pe LunarGridCell
          const getValueClasses = () => {
            // Obține valoarea celulei din TanStack Table
            const cellValue = cell.getValue();
            
            // Aplică color coding doar pentru valori numerice non-zero și doar pentru celulele de zi
            if (isDayCell && (typeof cellValue === 'string' || typeof cellValue === 'number')) {
              const numValue = parseFloat(cellValue.toString());
              if (!isNaN(numValue) && numValue !== 0) {
                // Determină tipul de tranzacție pe baza categoriei
                const transactionType = getTransactionTypeForCategory(original.category);
                
                if (transactionType === TransactionType.INCOME) {
                  return balanceDisplay({ variant: "positive", size: "sm" }); // Verde pentru venituri
                } else if (transactionType === TransactionType.SAVING) {
                  return balanceDisplay({ variant: "primary", size: "sm" }); // Copper pentru economii/investiții
                } else {
                  // EXPENSE sau default
                  return balanceDisplay({ variant: "negative", size: "sm" }); // Roșu pentru cheltuieli
                }
              }
            }
            
            // Pentru celulele fără valoare sau non-day cells, returnează string gol
            return '';
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
                isTotalCell && "font-semibold tabular-nums"
              )}
              title={
                isCategory && isDayCell
                  ? UI.LUNAR_GRID_TOOLTIPS.CALCULATED_SUM
                  : undefined
              }
            >
              {isFirstCell && isCategory ? (
                // Category Cell cu unified CVA expand icon
                <div className="flex items-center gap-2">
                  {/* 🔧 EXPAND SECTION: Div separat pentru expand cu tooltip propriu */}
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const isCurrentlyExpanded = row.getIsExpanded();
                      const willBeExpanded = !isCurrentlyExpanded;
                      
                      row.toggleExpanded();
                      onExpandToggle(row.id, willBeExpanded);
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
                      textProfessional({ variant: "heading", contrast: "high" })
                    )}>
                      {original.category}
                    </span>
                  </div>

                  {/* 🔒 LOCK ICON SECTION: Div separat pentru lacăt cu tooltip propriu */}
                  {shouldShowLockIcon && (
                    <Tooltip
                      content={`Categoria "${original.category}" a atins limita maximă de ${VALIDATION.MAX_CUSTOM_SUBCATEGORIES} subcategorii custom. Nu se mai poate adăuga butonul "Add Subcategory".`}
                      variant="warning"
                      placement="right"
                      delay={300}
                    >
                      <span className="inline-flex">
                        <Lock 
                          className="h-4 w-4 text-amber-600 dark:text-amber-400 cursor-help" 
                          aria-label={`Limitare atinsă: ${VALIDATION.MAX_CUSTOM_SUBCATEGORIES} subcategorii custom maxim`}
                        />
                      </span>
                    </Tooltip>
                  )}
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
              ) : isDayCell && isSubcategory ? (
                // Day Cell cu unified CVA input styling - DOAR pentru subcategorii
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
                      "text-center min-h-[40px] flex items-center justify-center",
                      getValueClasses()
                    )}
                    placeholder="0"
                  />
                </div>
              ) : isDayCell && isCategory ? (
                // Day Cell pentru categorii - DOAR afișare, fără interactivitate
                <div className="w-full h-full min-h-[40px] flex items-center justify-center">
                  <span className={cn(
                    "text-center font-medium",
                    getValueClasses()
                  )}>
                    {(() => {
                      const cellValue = cell.getValue();
                      if (cellValue === null || cellValue === undefined || cellValue === '') {
                        return '';
                      }
                      return String(cellValue);
                    })()}
                  </span>
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
      {(() => {
        // 🔧 UPDATED LOGIC: Render Add Subcategory button after the LAST subcategory, not after category
        const categoryIsExpanded = _expandedRows[original.category];
        const shouldRenderAfterLastSubcategory = isLastSubcategoryInCategory && categoryIsExpanded;
        
        // 🔧 LIMIT CHECK: Verify custom subcategories limit (max 5 per category)
        const categoryData = categories.find(cat => cat.name === original.category);
        const customSubcategoriesCount = categoryData?.subcategories?.filter(sub => sub.isCustom).length || 0;
        const hasReachedLimit = customSubcategoriesCount >= 5; // VALIDATION.MAX_CUSTOM_SUBCATEGORIES
        
        // 🔧 SAFETY CHECK: Prevent duplicate buttons by checking if this specific row should render
        const uniqueKey = `add-subcategory-${original.category}-${row.id}`;
        
        // Only render if category is expanded, this is last subcategory, AND limit not reached
        const shouldRender = shouldRenderAfterLastSubcategory && !hasReachedLimit;
        
        return shouldRender ? (
          <LunarGridAddSubcategoryRow
            key={uniqueKey}
            category={original.category}
            isAdding={addingSubcategory === original.category}
            inputValue={newSubcategoryName}
            totalColumns={table.getFlatHeaders().length}
            onInputChange={onSetNewSubcategoryName}
            onSave={() => onAddSubcategory(original.category)}
            onCancel={onCancelAddingSubcategory}
            onStartAdd={() => onSetAddingSubcategory(original.category)}
          />
        ) : null;
      })()}
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