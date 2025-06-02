import React from 'react';
import { Row, flexRender } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";

// Constants și shared
import { UI, LUNAR_GRID, PLACEHOLDERS } from "@shared-constants";

// Components
import LunarGridSubcategoryRowCell from "./LunarGridSubcategoryRowCell";
import LunarGridAddSubcategoryRow from "./LunarGridAddSubcategoryRow";
import LunarGridCell from "./LunarGridCell";

// Types
import { TransformedTableDataRow } from "../hooks/useLunarGridTable";
import { CellPosition } from "../hooks/useKeyboardNavigation";

// Utilities
import { cn } from "../../../../styles/cva/shared/utils";
import {
  gridCategoryRow,
  gridSubcategoryRow,
  gridCell,
  gridExpandIcon,
  gridCellActions,
  gridTransactionCell,
} from "../../../../styles/cva/grid";
import { flex } from "../../../../styles/cva/components/layout";

interface LunarGridRowProps {
  row: Row<TransformedTableDataRow>;
  level?: number;
  categories: any[];
  expandedRows: Record<string, boolean>;
  subcategoryAction: any;
  editingSubcategoryName: string;
  highlightedCell: any;
  addingSubcategory: string | null;
  newSubcategoryName: string;
  table: any;
  transactionMap: Map<string, string>;
  // Event handlers
  onExpandToggle: (rowId: string, isExpanded: boolean) => void;
  onSubcategoryEdit: (category: string, subcategory: string, newName: string) => void;
  onSubcategoryDelete: (category: string, subcategory: string) => void;
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

export const LunarGridRow: React.FC<LunarGridRowProps> = ({
  row,
  level = 0,
  categories,
  expandedRows,
  subcategoryAction,
  editingSubcategoryName,
  highlightedCell,
  addingSubcategory,
  newSubcategoryName,
  table,
  transactionMap,
  onExpandToggle,
  onSubcategoryEdit,
  onSubcategoryDelete,
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
  const isSubcategory = !isCategory && original.subcategory;

  // Verifică câte subcategorii CUSTOM are categoria
  const categoryData = categories.find(cat => cat.name === original.category);
  const customSubcategoriesCount = categoryData?.subcategories?.filter((sub: any) => sub.isCustom)?.length || 0;
  const canAddSubcategory = isCategory && row.getIsExpanded() && customSubcategoriesCount < 5;

  return (
    <React.Fragment key={row.id}>
      <tr
        className={cn(
          isCategory 
            ? gridCategoryRow({ 
                variant: "professional",
                state: row.getIsExpanded() ? "selected" : undefined
              })
            : gridSubcategoryRow({ 
                variant: (() => {
                  const categoryData = categories.find(cat => cat.name === original.category);
                  const subcategoryData = categoryData?.subcategories?.find((sub: any) => sub.name === original.subcategory);
                  return subcategoryData?.isCustom ? "custom" : "professional";
                })()
              }),
          "interactive animate-fade-in-up group",
          row.getIsExpanded() && "border-b border-gray-200/60"
        )}
      >
        {row.getVisibleCells().map((cell, cellIdx) => {
          const isFirstCell = cellIdx === 0;
          const isDayCell = cell.column.id.startsWith("day-");
          const isTotalCell = cell.column.id === "total";

          // Determine cell type și state
          const cellType = isCategory && isFirstCell ? "category" :
                         !isCategory && isFirstCell ? "subcategory" :
                         isDayCell ? "value" :
                         isTotalCell ? "total" :
                         "value";

          const cellValue = cell.getValue() as string | number;
          const cellState = isDayCell && cellValue && cellValue !== "-" && cellValue !== "—" 
            ? (typeof cellValue === 'number' && cellValue > 0) || 
              (typeof cellValue === 'string' && parseFloat(cellValue.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0)
              ? "positive" 
              : "negative"
            : undefined;

          const valueClasses = isDayCell && cellValue && cellValue !== "-" && cellValue !== "—" 
            ? (typeof cellValue === 'number' && cellValue > 0) || 
              (typeof cellValue === 'string' && parseFloat(cellValue.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0)
              ? "value-positive font-financial" 
              : "value-negative font-financial"
            : "";

          return (
            <td
              key={cell.id}
              className={cn(
                gridCell({
                  type: cellType,
                  state: cellState,
                  size: "default"
                }),
                "text-professional",
                isFirstCell && level > 0 && "pl-8",
                isDayCell && "hover-scale focus-ring",
                isTotalCell && "font-semibold tabular-nums",
                valueClasses
              )}
              title={
                isCategory && isDayCell
                  ? UI.LUNAR_GRID_TOOLTIPS.CALCULATED_SUM
                  : undefined
              }
            >
              {isFirstCell && isCategory ? (
                // Category Cell
                <div 
                  className={cn(
                    gridCellActions({ variant: "always", position: "left" }),
                    "cursor-pointer interactive rounded-md p-2",
                    "hover:bg-gray-50/80 active:scale-98"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    row.toggleExpanded();
                    onExpandToggle(row.id, !row.getIsExpanded());
                  }}
                  title={row.getIsExpanded() ? LUNAR_GRID.COLLAPSE_CATEGORY_TITLE : LUNAR_GRID.EXPAND_CATEGORY_TITLE}
                  data-testid={`toggle-category-${original.category}`}
                >
                  <div className={flex({ align: "center", gap: "sm" })}>
                    <div className={cn(
                      gridExpandIcon({
                        variant: "professional",
                        state: row.getIsExpanded() ? "expanded" : "collapsed"
                      })
                    )}>
                      <ChevronRight size={16} />
                    </div>
                    <span className="text-gray-800 font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                    </span>
                  </div>
                </div>
              ) : isFirstCell && isSubcategory ? (
                // Subcategory Cell
                <LunarGridSubcategoryRowCell
                  category={original.category}
                  subcategory={original.subcategory!}
                  isCustom={(() => {
                    const categoryData = categories.find(cat => cat.name === original.category);
                    const subcategoryData = categoryData?.subcategories?.find((sub: any) => sub.name === original.subcategory);
                    return subcategoryData?.isCustom || false;
                  })()}
                  isEditing={
                    subcategoryAction?.type === 'edit' && 
                    subcategoryAction.category === original.category && 
                    subcategoryAction.subcategory === original.subcategory
                  }
                  editingValue={editingSubcategoryName}
                  onEditingValueChange={onEditingValueChange}
                  onSaveEdit={() => onSubcategoryEdit(original.category, original.subcategory!, editingSubcategoryName)}
                  onCancelEdit={onClearSubcategoryAction}
                  onStartEdit={() => onStartEditingSubcategory(original.category, original.subcategory!)}
                  onStartDelete={() => onStartDeletingSubcategory(original.category, original.subcategory!)}
                />
              ) : isDayCell && isSubcategory ? (
                // Data Cell
                <div className="interactive focus-ring">
                  <LunarGridCell
                    cellId={`${original.category}-${original.subcategory || "null"}-${parseInt(cell.column.id.split("-")[1])}`}
                    value={(() => {
                      const currentValue = cell.getValue() as string | number;
                      let displayValue = "";
                      if (currentValue && currentValue !== "-" && currentValue !== "—") {
                        if (typeof currentValue === "string") {
                          displayValue = currentValue
                            .replace(/[^\d,.-]/g, "")
                            .replace(/\./g, "")
                            .replace(",", ".");
                        } else {
                          displayValue = String(currentValue);
                        }
                      }
                      return displayValue;
                    })()}
                    onSave={async (value) => {
                      const day = parseInt(cell.column.id.split("-")[1]);
                      const transactionKey = `${original.category}-${original.subcategory || ''}-${day}`;
                      const transactionId = transactionMap.get(transactionKey) || null;
                      await onCellSave(original.category, original.subcategory, day, value, transactionId);
                    }}
                    onSingleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const day = parseInt(cell.column.id.split("-")[1]);
                      const currentValue = cell.getValue() as string | number;
                      let displayValue = "";
                      if (currentValue && currentValue !== "-" && currentValue !== "—") {
                        if (typeof currentValue === "string") {
                          displayValue = currentValue
                            .replace(/[^\d,.-]/g, "")
                            .replace(/\./g, "")
                            .replace(",", ".");
                        } else {
                          displayValue = String(currentValue);
                        }
                      }
                      const transactionKey = `${original.category}-${original.subcategory || ''}-${day}`;
                      const transactionId = transactionMap.get(transactionKey) || null;
                      const targetElement = e.currentTarget as HTMLElement;
                      onSingleClickModal(original.category, original.subcategory, day, displayValue, transactionId, targetElement);
                      
                      // Update navigation focus
                      const cellPosition: CellPosition = {
                        category: original.category,
                        subcategory: original.subcategory,
                        day,
                        rowIndex: Math.max(0, table.getRowModel().rows.findIndex((row: any) => 
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
                    className={(() => {
                      const day = parseInt(cell.column.id.split("-")[1]);
                      const transactionKey = `${original.category}-${original.subcategory || ''}-${day}`;
                      const transactionId = transactionMap.get(transactionKey) || null;
                      
                      const isHighlighted = highlightedCell && 
                        highlightedCell.category === original.category &&
                        highlightedCell.subcategory === original.subcategory &&
                        highlightedCell.day === day;

                      const cellPosition: CellPosition = {
                        category: original.category,
                        subcategory: original.subcategory,
                        day,
                        rowIndex: Math.max(0, table.getRowModel().rows.findIndex((row: any) => 
                          row.original.category === original.category && 
                          row.original.subcategory === original.subcategory
                        )),
                        colIndex: day - 1,
                      };
                      const isFocused = isPositionFocused(cellPosition);
                      const isSelected = isPositionSelected(cellPosition);

                      return cn(
                        gridTransactionCell({
                          state: transactionId ? "existing" : "new"
                        }),
                        isHighlighted && "ring-2 ring-blue-500 ring-opacity-75 bg-blue-50 shadow-lg transform scale-105 transition-all duration-200",
                        isFocused && "ring-2 ring-purple-500 ring-opacity-50 bg-purple-50",
                        isSelected && "bg-blue-100 border-blue-300",
                        (isFocused || isSelected) && "transition-all duration-150"
                      );
                    })()}
                    placeholder={(() => {
                      const day = parseInt(cell.column.id.split("-")[1]);
                      const transactionKey = `${original.category}-${original.subcategory || ''}-${day}`;
                      const transactionId = transactionMap.get(transactionKey) || null;
                      return transactionId ? PLACEHOLDERS.EDIT_TRANSACTION : PLACEHOLDERS.ADD_TRANSACTION;
                    })()}
                  />
                </div>
              ) : (
                // Default Cell
                <span className="text-professional">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  ) as React.ReactNode}
                </span>
              )}
            </td>
          );
        })}
      </tr>

      {/* Expanded Rows */}
      {row.getIsExpanded() &&
        row.subRows &&
        row.subRows.length > 0 &&
        row.subRows.map((subRow) => (
          <LunarGridRow
            key={subRow.id}
            row={subRow}
            level={level + 1}
            categories={categories}
            expandedRows={expandedRows}
            subcategoryAction={subcategoryAction}
            editingSubcategoryName={editingSubcategoryName}
            highlightedCell={highlightedCell}
            addingSubcategory={addingSubcategory}
            newSubcategoryName={newSubcategoryName}
            table={table}
            transactionMap={transactionMap}
            onExpandToggle={onExpandToggle}
            onSubcategoryEdit={onSubcategoryEdit}
            onSubcategoryDelete={onSubcategoryDelete}
            onEditingValueChange={onEditingValueChange}
            onClearSubcategoryAction={onClearSubcategoryAction}
            onStartEditingSubcategory={onStartEditingSubcategory}
            onStartDeletingSubcategory={onStartDeletingSubcategory}
            onCellSave={onCellSave}
            onSingleClickModal={onSingleClickModal}
            onCellClick={onCellClick}
            onAddSubcategory={onAddSubcategory}
            onCancelAddingSubcategory={onCancelAddingSubcategory}
            onSetAddingSubcategory={onSetAddingSubcategory}
            onSetNewSubcategoryName={onSetNewSubcategoryName}
            isPositionFocused={isPositionFocused}
            isPositionSelected={isPositionSelected}
          />
        ))}

      {/* Add Subcategory Row */}
      {canAddSubcategory && (
        <LunarGridAddSubcategoryRow
          category={original.category}
          isAdding={addingSubcategory === original.category}
          inputValue={newSubcategoryName}
          totalColumns={table.getFlatHeaders().length}
          onInputChange={onSetNewSubcategoryName}
          onSave={() => onAddSubcategory(original.category)}
          onCancel={onCancelAddingSubcategory}
          onStartAdd={() => onSetAddingSubcategory(original.category)}
        />
      )}
    </React.Fragment>
  );
};

export default LunarGridRow; 