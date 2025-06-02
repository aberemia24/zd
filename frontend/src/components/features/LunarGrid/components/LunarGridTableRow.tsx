import React, { useCallback } from 'react';
import { Row, flexRender } from "@tanstack/react-table";
import { TransformedTableDataRow } from "../hooks/useLunarGridTable";
import { cn } from "../../../../styles/cva/shared/utils";
import {
  gridCategoryRow,
  gridSubcategoryRow,
  gridCell,
  gridCellActions,
  gridExpandIcon,
  gridBadge,
  gridInput,
  gridActionButton,
  gridInteractive,
  gridSubcategoryState,
} from "../../../../styles/cva/grid";
import {
  flex,
} from "../../../../styles/cva/components/layout";
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react";
import Button from "../../../primitives/Button/Button";
import { FLAGS, PLACEHOLDERS, UI, BUTTONS, LUNAR_GRID, LUNAR_GRID_ACTIONS } from "@shared-constants";
import { 
  findCategoryByName, 
  countCustomSubcategories,
  canAddSubcategory,
  type CategoryStoreItem
} from "../../../../utils/lunarGrid/lunarGridHelpers";
import type { CustomCategory } from '../../../../types/Category';

interface LunarGridTableRowProps {
  row: Row<TransformedTableDataRow>;
  level?: number;
  categories: CustomCategory[];
  table: any; // TanStack table instance
  renderEditableCell: (
    category: string,
    subcategory: string | undefined,
    day: number,
    currentValue: string | number,
  ) => React.ReactNode;
  
  // Expanded state management
  setExpandedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  
  // Subcategory management
  addingSubcategory: string | null;
  newSubcategoryName: string;
  handleAddSubcategory: (categoryName: string) => Promise<void>;
  handleCancelAddSubcategory: () => void;
  setAddingSubcategory: React.Dispatch<React.SetStateAction<string | null>>;
  
  // Subcategory actions
  subcategoryAction: {
    type: 'edit' | 'delete';
    category: string;
    subcategory: string;
  } | null;
  editingSubcategoryName: string;
  setEditingSubcategoryName: React.Dispatch<React.SetStateAction<string>>;
  setSubcategoryAction: React.Dispatch<React.SetStateAction<{
    type: 'edit' | 'delete';
    category: string;
    subcategory: string;
  } | null>>;
  handleRenameSubcategory: (categoryName: string, oldSubcategoryName: string, newSubcategoryName: string) => Promise<void>;
}

const LunarGridTableRow: React.FC<LunarGridTableRowProps> = ({
  row,
  level = 0,
  categories,
  table,
  renderEditableCell,
  setExpandedRows,
  addingSubcategory,
  newSubcategoryName,
  handleAddSubcategory,
  handleCancelAddSubcategory,
  setAddingSubcategory,
  subcategoryAction,
  editingSubcategoryName,
  setEditingSubcategoryName,
  setSubcategoryAction,
  handleRenameSubcategory,
}) => {
  const { original } = row;
  const isCategory = original.isCategory;
  const isSubcategory = !isCategory && original.subcategory;

  // Verifică câte subcategorii CUSTOM are categoria (nu toate subcategoriile)
  const categoryData = findCategoryByName(categories as any, original.category);
  const customSubcategoriesCount = categoryData ? countCustomSubcategories(categoryData) : 0;
  const canAddSubcategoryToCategory = isCategory && row.getIsExpanded() && categoryData && canAddSubcategory(categoryData);

  return (
    <React.Fragment key={row.id}>
      {/* 🎨 Professional Row Styling cu enhanced visual hierarchy */}
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
                  const subcategoryData = categoryData?.subcategories?.find((sub) => sub.name === original.subcategory);
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

          // 🎨 Determine professional cell type și state
          const cellType = isCategory && isFirstCell ? "category" :
                         !isCategory && isFirstCell ? "subcategory" :
                         isDayCell ? "value" :
                         isTotalCell ? "total" :
                         "value";

          // 🎨 Professional cell state detection cu enhanced color psychology
          const cellValue = cell.getValue() as string | number;
          const cellState = isDayCell && cellValue && cellValue !== "-" && cellValue !== "—" 
            ? (typeof cellValue === 'number' && cellValue > 0) || 
              (typeof cellValue === 'string' && parseFloat(cellValue.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0)
              ? "positive" 
              : "negative"
            : undefined;

          // 🎨 Phase 4: Enhanced styling classes pentru visual hierarchy
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
                // 🎨 Professional Category Cell cu enhanced interactions
                <div 
                  className={cn(
                    gridCellActions({ variant: "always", position: "left" }),
                    "cursor-pointer interactive rounded-md p-2",
                    "hover:bg-gray-50/80 active:scale-98"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    row.toggleExpanded();
                    setExpandedRows(prev => ({
                      ...prev,
                      [row.id]: !row.getIsExpanded()
                    }));
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
                // 🎨 Professional Subcategory Cell cu enhanced badge și actions
                <div className={flex({ justify: "between", gap: "sm", width: "full" })}>
                  <div className={flex({ align: "center", gap: "md" })}>
                    {/* 🎨 Editing Mode cu professional styling */}
                    {subcategoryAction?.type === 'edit' && 
                     subcategoryAction.category === original.category && 
                     subcategoryAction.subcategory === original.subcategory ? (
                      <div className={flex({ align: "center", gap: "sm" })}>
                        <input
                          type="text"
                          value={editingSubcategoryName}
                          onChange={(e) => setEditingSubcategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY && editingSubcategoryName.trim()) {
                              handleRenameSubcategory(original.category, original.subcategory!, e.currentTarget.value);
                            } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                              setEditingSubcategoryName("");
                            }
                          }}
                          className={cn(
                            gridInput({ variant: "professional", state: "editing" }),
                            "flex-1 animate-scale-in focus-ring-primary"
                          )}
                          autoFocus
                          data-testid={`edit-subcategory-input-${original.subcategory}`}
                        />
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={(e) => handleRenameSubcategory(original.category, original.subcategory!, editingSubcategoryName)}
                          disabled={!editingSubcategoryName.trim()}
                          data-testid={`save-edit-subcategory-${original.subcategory}`}
                          className="hover-scale"
                        >
                          ✓
                        </Button>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => {
                            setSubcategoryAction(null);
                            setEditingSubcategoryName("");
                          }}
                          data-testid={`cancel-edit-subcategory-${original.subcategory}`}
                          className="hover-scale"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      // 🎨 Normal Mode cu professional text și badge
                      <div className={flex({ align: "center", gap: "md" })}>
                        <span className="text-professional-body contrast-high">
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                        </span>
                        {(() => {
                          const categoryData = categories.find(cat => cat.name === original.category);
                          const subcategoryData = categoryData?.subcategories?.find((sub) => sub.name === original.subcategory);
                          return subcategoryData?.isCustom ? (
                            <div className={cn(
                              gridBadge({ variant: "custom", size: "sm" }),
                              "animate-bounce-subtle text-professional-caption"
                            )}>
                              {FLAGS.CUSTOM}
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                  
                  {/* 🎨 Professional Action Buttons cu enhanced hover effects */}
                  {subcategoryAction?.type !== 'edit' && (() => {
                    const categoryData = categories.find(cat => cat.name === original.category);
                    const subcategoryData = categoryData?.subcategories?.find((sub) => sub.name === original.subcategory);
                    const isCustom = subcategoryData?.isCustom;
                    
                    // Afișăm buttons pentru TOATE subcategoriile
                    return (
                      <div className={cn(
                        gridCellActions({ variant: "professional" }),
                        "animate-fade-in-up"
                      )}>
                        {/* Edit button pentru TOATE subcategoriile */}
                        <button
                          className={cn(
                            gridActionButton({ variant: "primary", size: "sm" }),
                            "hover-lift"
                          )}
                          onClick={() => {
                            setSubcategoryAction({
                              type: 'edit',
                              category: original.category,
                              subcategory: original.subcategory!
                            });
                            setEditingSubcategoryName(original.subcategory!);
                          }}
                          data-testid={`edit-subcategory-btn-${original.subcategory}`}
                          title={UI.SUBCATEGORY_ACTIONS.RENAME_TITLE}
                        >
                          <Edit size={12} />
                        </button>
                        
                        {/* Delete button DOAR pentru subcategoriile custom */}
                        {isCustom && (
                          <button
                            className={cn(
                              gridActionButton({ variant: "danger", size: "sm" }),
                              "hover-lift"
                            )}
                            onClick={() => {
                              setSubcategoryAction({
                                type: 'delete',
                                category: original.category,
                                subcategory: original.subcategory!
                              });
                            }}
                            data-testid={`delete-subcategory-btn-${original.subcategory}`}
                            title={UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : isDayCell && isSubcategory ? (
                // 🎨 Professional Editable Cell
                <div className="interactive focus-ring">
                  {renderEditableCell(
                    original.category,
                    original.subcategory,
                    parseInt(cell.column.id.split("-")[1]),
                    cell.getValue() as string | number,
                  )}
                </div>
              ) : (
                // 🎨 Default Professional Cell
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

      {/* 🎨 Professional Expanded Rows */}
      {row.getIsExpanded() &&
        row.subRows &&
        row.subRows.length > 0 &&
        row.subRows.map((subRow) => (
          <LunarGridTableRow
            key={subRow.id}
            row={subRow}
            level={level + 1}
            categories={categories}
            table={table}
            renderEditableCell={renderEditableCell}
            setExpandedRows={setExpandedRows}
            addingSubcategory={addingSubcategory}
            newSubcategoryName={newSubcategoryName}
            handleAddSubcategory={handleAddSubcategory}
            handleCancelAddSubcategory={handleCancelAddSubcategory}
            setAddingSubcategory={setAddingSubcategory}
            subcategoryAction={subcategoryAction}
            editingSubcategoryName={editingSubcategoryName}
            setEditingSubcategoryName={setEditingSubcategoryName}
            setSubcategoryAction={setSubcategoryAction}
            handleRenameSubcategory={handleRenameSubcategory}
          />
        ))}

      {/* 🎨 Professional Add Subcategory Row */}
      {canAddSubcategoryToCategory && (
        <tr className={cn(
          gridSubcategoryRow({ variant: "professional" }),
          gridSubcategoryState({ variant: "adding" })
        )}>
          <td 
            className={cn(
              gridCell({ type: "subcategory" }),
              gridSubcategoryState({ cell: "backdrop" })
            )}
          >
            {addingSubcategory === original.category ? (
              // 🎨 Professional Input Mode
              <div className={flex({ align: "center", gap: "md" })}>
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setAddingSubcategory(e.target.value)}
                  placeholder={PLACEHOLDERS.SUBCATEGORY_NAME}
                  className={cn(
                    gridInput({ variant: "professional", state: "editing" }),
                    "flex-1 focus-ring-primary"
                  )}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY) {
                      handleAddSubcategory(original.category);
                    } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                      handleCancelAddSubcategory();
                    }
                  }}
                  data-testid={`new-subcategory-input-${original.category}`}
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAddSubcategory(original.category)}
                  disabled={!newSubcategoryName.trim()}
                  data-testid={`save-subcategory-${original.category}`}
                  className="hover-scale"
                >
                  ✓
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancelAddSubcategory}
                  data-testid={`cancel-subcategory-${original.category}`}
                  className="hover-scale"
                >
                  ✕
                </Button>
              </div>
            ) : (
              // 🎨 Professional Add Button
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingSubcategory(original.category)}
                className={cn(
                  gridInteractive({ variant: "addButton", size: "auto" }),
                  flex({ align: "center", gap: "sm" })
                )}
                data-testid={`add-subcategory-${original.category}`}
              >
                <Plus size={14} className="text-professional-primary" />
                <span className="text-professional-body font-medium">{BUTTONS.ADD_SUBCATEGORY}</span>
              </Button>
            )}
          </td>
          {/* 🎨 Professional Empty Cells */}
          {table.getFlatHeaders().slice(1).map((header: any) => (
            <td 
              key={`add-subcategory-${header.id}`} 
              className={cn(gridCell({ type: "value", state: "readonly" }))}
            >
              {/* Empty cell cu subtle styling */}
            </td>
          ))}
        </tr>
      )}
    </React.Fragment>
  );
};

export default LunarGridTableRow; 