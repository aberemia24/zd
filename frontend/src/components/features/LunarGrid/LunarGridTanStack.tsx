import React, { useCallback, useState, useMemo, CSSProperties, memo } from 'react';
import { flexRender, Row } from "@tanstack/react-table";
import {
  useLunarGridTable,
  TransformedTableDataRow,
} from "./hooks/useLunarGridTable";

// 🎯 Step 1.6: Import toast pentru UX feedback
import toast from 'react-hot-toast';

// Importuri din stores
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// React Query și hooks pentru tranzacții
import {
  useCreateTransactionMonthly,
  useUpdateTransactionMonthly,
  type CreateTransactionHookPayload,
  type UpdateTransactionHookPayload
} from '../../../services/hooks/transactionMutations';

// 🎯 PHASE 1: Import useMonthlyTransactions pentru a avea acces direct la validTransactions
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';

// Importăm tipuri și constante din shared-constants (sursa de adevăr)
import { TransactionType, FrequencyType, LUNAR_GRID_MESSAGES, MESAJE } from "@shared-constants";
import { LUNAR_GRID } from "@shared-constants";

// Import componentele UI
import Button from "../../primitives/Button/Button";
import CellTransactionPopover from "./CellTransactionPopover";
import { EditableCell } from "./inline-editing/EditableCell";

// 🎯 Step 3.3: Import singleton formatters pentru performanță
import { formatCurrency, getBalanceStyleClass } from "../../../utils/lunarGrid";

// Import CVA styling system
import { cn } from "../../../styles/cva/shared/utils";
import {
  dataTable,
  tableHeader,
  tableCell,
  tableRow,
} from "../../../styles/cva/data";
import {
  flex as flexContainer,
  container as gridContainer,
  } from "../../../styles/cva/components/layout";

// Interfață pentru categoria din store
interface CategoryStoreItem {
  name: string;
  type: TransactionType;
  subcategories: Array<{ name: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

// Interfață pentru starea popover-ului de tranzacții
interface PopoverState {
  isOpen: boolean;
  category: string;
  subcategory: string | undefined;
  day: number;
  amount: string;
  type: TransactionType;
  element: HTMLElement | null;
  anchorEl?: HTMLElement;
}

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(
  ({ year, month }) => {
    // State pentru popover (păstrat doar pentru modal advanced)
    const [popover, setPopover] = useState<PopoverState | null>(null);

    // State pentru expanded rows (să nu se colapșeze după salvare)
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
      {},
    );

    // Import userId from auth store pentru hooks monthly
    const { user } = useAuthStore();

    // 🎯 PHASE 1: Hook pentru tranzacțiile reale cu datele corecte pentru Financial Projections
    const { transactions: validTransactions } = useMonthlyTransactions(year, month, user?.id, {
      includeAdjacentDays: true,
    });

    // FAZA 1: Hooks pentru mutații de tranzacții cu cache optimization  
    const createTransactionMutation = useCreateTransactionMonthly(year, month, user?.id);
    const updateTransactionMutation = useUpdateTransactionMonthly(year, month, user?.id);

    // Funcție pentru determinarea tipului de tranzacție
    const determineTransactionType = useCallback(
      (category: string): TransactionType => {
        const categories = useCategoryStore.getState().categories as CategoryStoreItem[];
        const foundCategory = categories.find((c) => c.name === category);
        return (foundCategory?.type || TransactionType.EXPENSE) as TransactionType;
      },
      [],
    );

    // Handler pentru salvarea din EditableCell (folosit direct de fiecare celulă)
    const handleEditableCellSave = useCallback(
      async (
        category: string,
        subcategory: string | undefined,
        day: number,
        value: string | number,
        transactionId: string | null,
      ): Promise<void> => {
        const numValue = typeof value === "string" ? parseFloat(value) : value;

        if (isNaN(numValue)) {
          throw new Error("Valoare invalidă");
        }

        const date = new Date(year, month - 1, day);
        const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if (transactionId) {
          // UPDATE: Modifică tranzacția existentă
          await updateTransactionMutation.mutateAsync({
            id: transactionId,
            transactionData: {
              amount: numValue,
              date: isoDate,
              category,
              subcategory: subcategory || undefined,
              type: TransactionType.EXPENSE,
            }
          });
        } else {
          // CREATE: Creează o tranzacție nouă
          await createTransactionMutation.mutateAsync({
            amount: numValue,
            date: isoDate,
            category,
            subcategory: subcategory || undefined,
            type: TransactionType.EXPENSE,
            description: `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
          });
        }
      },
      [
        year,
        month,
        updateTransactionMutation,
        createTransactionMutation,
      ],
    );

    // Handler pentru click pe celulă (doar pentru modal advanced - Shift+Click)
    const handleCellClick = useCallback(
      (
        e: React.MouseEvent,
        category: string,
        subcategory: string | undefined,
        day: number,
        amount: string,
      ) => {
        e.stopPropagation();

        // Doar deschide modal-ul dacă se ține Shift (pentru advanced editing)
        if (!e.shiftKey) return;

        // Verifică dacă currentTarget este valid
        const anchorEl = e.currentTarget as HTMLElement;
        if (!anchorEl) {
          console.warn("No currentTarget available for popover anchor");
          return;
        }

        setPopover({
          category,
          subcategory,
          day,
          type: determineTransactionType(category),
          amount,
          isOpen: true,
          element: null,
          anchorEl,
        });
      },
      [determineTransactionType],
    );

    // Handler pentru salvarea tranzacției din popover
    const handleSavePopover = useCallback(
      async (formData: {
        amount: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }) => {
        if (!popover) {
          return;
        }

        const {
          category,
          subcategory,
          day,
          type: transactionTypeFromPopover,
        } = popover;

        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const commonPayload = {
          amount: Number(formData.amount),
          category,
          subcategory: subcategory || undefined,
          type: transactionTypeFromPopover,
          date,
          recurring: formData.recurring,
          frequency: formData.recurring ? formData.frequency : undefined,
        };

        createTransactionMutation.mutate(commonPayload, {
          onSuccess: () => {
            setPopover(null);
          },
          onError: () => {
            setPopover(null);
          },
        });
      },
      [popover, year, month, createTransactionMutation],
    );

    // Interogare tabel optimizată (fără handleri de click/double-click)
    const { table, isLoading, error, days, dailyBalances, tableContainerRef, transactionMap } =
      useLunarGridTable(year, month, expandedRows, handleCellClick);

    // Render pentru celula editabilă folosind EditableCell component
    const renderEditableCell = useCallback(
      (
        category: string,
        subcategory: string | undefined,
        day: number,
        currentValue: string | number,
      ) => {
        const cellId = `${category}-${subcategory || "null"}-${day}`;
        
        // 🔍 Step 1.1: Identifică transactionId pentru diferențierea CREATE vs UPDATE
        const transactionKey = `${category}-${subcategory || ''}-${day}`;
        const transactionId = transactionMap.get(transactionKey) || null;

        // Parseaza valoarea existentă corect pentru display
        let displayValue = "";
        if (currentValue && currentValue !== "-" && currentValue !== "—") {
          if (typeof currentValue === "string") {
            // Elimină formatarea pentru editing
            displayValue = currentValue
              .replace(/[^\d,.-]/g, "")
              .replace(/\./g, "")
              .replace(",", ".");
          } else {
            displayValue = String(currentValue);
          }
        }

        return (
          <EditableCell
            cellId={cellId}
            value={displayValue}
            onSave={async (value) => {
              try {
                // 🎯 Step 1.1: Transmite transactionId la handleEditableCellSave
                await handleEditableCellSave(category, subcategory, day, value, transactionId);
              } catch (error) {
                console.error("Eroare la salvarea celulei:", error);
                throw error; // Re-throw pentru EditableCell să gestioneze eroarea
              }
            }}
            validationType="amount"
            className={cn(
              "w-full h-full min-h-[40px]",
              // 🎯 Visual feedback: diferențiere CREATE vs UPDATE
              transactionId 
                ? "ring-1 ring-blue-200 bg-blue-50/30" // Existing transaction (UPDATE)
                : "ring-1 ring-green-200 bg-green-50/30" // New transaction (CREATE)
            )}
            data-testid={`editable-cell-${cellId}`}
            placeholder={transactionId ? "Editează..." : "Adaugă..."}
          />
        );
      },
      [handleEditableCellSave, transactionMap],
    );

    // Helper pentru stiluri de valori
    const getBalanceStyle = useCallback((value: number): string => {
      if (!value) return "text-gray-400";
      return value > 0
        ? "text-emerald-600 font-medium"
        : "text-red-600 font-medium";
    }, []);

    // Gestionarea poziției popover-ului
    const popoverStyle = useMemo((): CSSProperties => {
      if (!popover || !popover.anchorEl) return {};

      // Verifică dacă elementul este încă în DOM
      try {
        const rect = popover.anchorEl.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        return {
          position: "absolute",
          top: `${rect.top + scrollY}px`,
          left: `${rect.left + scrollX}px`,
        };
      } catch (error) {
        console.warn(
          "Could not get bounding rect for popover anchor element:",
          error,
        );
        return {};
      }
    }, [popover]);

    // Funcție helper pentru randarea recursivă a rândurilor
    const renderRow = useCallback(
      (
        row: Row<TransformedTableDataRow>,
        level: number = 0,
      ): React.ReactNode => {
        const { original } = row;
        const isCategory = original.isCategory;
        const isSubcategory = !isCategory && original.subcategory;

        return (
          <React.Fragment key={row.id}>
            <tr
              className={cn(
                tableRow({
                  editability: isCategory ? "readonly" : "editable",
                }),
                row.getIsExpanded() ? "border-b border-gray-200" : "",
              )}
            >
              {row.getVisibleCells().map((cell, cellIdx) => {
                const isFirstCell = cellIdx === 0;
                const isDayCell = cell.column.id.startsWith("day-");

                // Determine cell editability
                const cellEditability = isCategory
                  ? "category"
                  : isDayCell && isSubcategory
                    ? "editable"
                    : "readonly";

                return (
                  <td
                    key={cell.id}
                    className={cn(
                      tableCell({
                        variant: isDayCell ? "numeric" : "default",
                        editability: cellEditability,
                      }),
                      isFirstCell && level > 0 ? "pl-8" : "",
                      isFirstCell ? "sticky left-0 bg-white z-5" : "",
                    )}
                    title={
                      isCategory && isDayCell
                        ? "Suma calculată automată din subcategorii"
                        : undefined
                    }
                  >
                    {isFirstCell && isCategory ? (
                      // Celula de categorie clickable pentru expand/collapse (folosește iconițele existente din hook)
                      <div 
                        className="flex items-center cursor-pointer hover:bg-gray-50 rounded px-1 py-1 transition-colors duration-150"
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                      </div>
                    ) : isDayCell && isSubcategory ? (
                      renderEditableCell(
                        original.category,
                        original.subcategory,
                        parseInt(cell.column.id.split("-")[1]),
                        cell.getValue() as string | number,
                      )
                    ) : (
                      flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      ) as React.ReactNode
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Rânduri expandate */}
            {row.getIsExpanded() &&
              row.subRows &&
              row.subRows.length > 0 &&
              row.subRows.map((subRow) => renderRow(subRow, level + 1))}
          </React.Fragment>
        );
      },
      [renderEditableCell],
    );

    // Renderizare (layout principal)
    return (
      <>
        <div className={cn(flexContainer({ direction: "row", justify: "start", gap: "md" }), "mb-4")}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const isCurrentlyExpanded = table.getIsAllRowsExpanded();
              const newExpandedState: Record<string, boolean> = {};
              
              if (!isCurrentlyExpanded) {
                // Expandează toate
                table.getRowModel().rows.forEach(row => {
                  if (row.getCanExpand()) {
                    newExpandedState[row.id] = true;
                  }
                });
              }
              // Dacă se colapsează, lăsăm newExpandedState gol (toate false)
              
              setExpandedRows(newExpandedState);
              table.toggleAllRowsExpanded(!isCurrentlyExpanded);
            }}
            dataTestId="toggle-expand-all"
          >
            {table.getIsAllRowsExpanded() ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setExpandedRows({});
              table.resetExpanded();
            }}
            dataTestId="reset-expanded"
          >
            {LUNAR_GRID.RESET_EXPANSION}
          </Button>
        </div>

        <div 
          ref={tableContainerRef}
          className={cn(
            "w-full",
            "relative overflow-auto border border-gray-200",
            "max-h-[70vh] min-h-[400px]", // Înălțime fixă pentru scroll vertical
            isLoading ? "opacity-60" : "",
            "transition-all duration-150"
          )}
          data-testid="lunar-grid-container"
          onSubmit={(e) => {
            // Previne form submission care cauzează page refresh
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            // Previne click-uri nedorite care pot cauza navigație
            e.stopPropagation();
          }}
          onWheel={(e) => {
            // Capturează mouse wheel pentru scroll natural în tabel
            e.stopPropagation();
            // Permite scroll-ul natural al browser-ului în container
          }}
          tabIndex={0} // Face container-ul focusable pentru keyboard navigation
          style={{
            scrollBehavior: 'smooth' // Smooth scrolling pentru o experiență mai plăcută
          }}
        >
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-gray-600" data-testid="loading-indicator">
              {LUNAR_GRID.LOADING}
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 rounded-md" data-testid="error-indicator">
              {LUNAR_GRID_MESSAGES.EROARE_INCARCARE}
            </div>
          )}
          
          {!isLoading && !error && table.getRowModel().rows.length === 0 && (
            <div className="flex items-center justify-center p-4 text-gray-600" data-testid="no-data-indicator">
              {LUNAR_GRID.NO_DATA}
            </div>
          )}
          
          {!isLoading && !error && table.getRowModel().rows.length > 0 && (
            <table 
              className={cn(dataTable({ variant: "striped" }), "w-full")}
              data-testid="lunar-grid-table"
            >
              <thead className="bg-gray-50 sticky top-0 z-20">
                <tr>
                  {table.getFlatHeaders().map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        tableHeader(),
                        header.id === "category" 
                          ? "sticky left-0 z-30 text-center bg-gray-50" 
                          : "text-center"
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                    </th>
                  ))}
                </tr>
                {/* Rând separat pentru balanțele zilnice */}
                <tr className="bg-blue-50 border-b-2 border-blue-200">
                  {table.getFlatHeaders().map((header) => {
                    if (header.id === "category") {
                      return (
                        <th
                          key={`balance-${header.id}`}
                          className={cn(
                            "sticky left-0 z-30 px-4 py-2 text-center font-medium text-gray-700 bg-blue-50"
                          )}
                        >
                          Balanțe zilnice
                        </th>
                      );
                    }
                    
                    if (header.id.startsWith("day-")) {
                      const dayNumber = parseInt(header.id.split("-")[1], 10);
                      const dailyBalance = dailyBalances[dayNumber] || 0;
                      
                      return (
                        <th
                          key={`balance-${header.id}`}
                          className={cn(
                            "px-2 py-2 text-center text-sm font-medium",
                            getBalanceStyleClass(dailyBalance)
                          )}
                        >
                          {dailyBalance !== 0 ? formatCurrency(dailyBalance) : "—"}
                        </th>
                      );
                    }
                    
                    if (header.id === "total") {
                      const monthTotal = Object.values(dailyBalances).reduce((sum, val) => sum + val, 0);
                      return (
                        <th
                          key={`balance-${header.id}`}
                          className={cn(
                            "px-2 py-2 text-center text-sm font-bold",
                            getBalanceStyleClass(monthTotal)
                          )}
                        >
                          {monthTotal !== 0 ? formatCurrency(monthTotal) : "—"}
                        </th>
                      );
                    }
                    
                    return (
                      <th
                        key={`balance-${header.id}`}
                        className="px-2 py-2"
                      >
                        —
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => renderRow(row))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Popover pentru editare tranzacție */}
        {popover && (
          <div 
            className={cn(
              "fixed z-50 shadow-lg rounded-lg",
              "animate-fadeIn transition-all duration-150"
            )}
            style={popoverStyle}
            data-testid="transaction-popover"
          >
            <CellTransactionPopover
              initialAmount={popover.amount || ""}
              day={popover.day}
              month={month}
              year={year}
              category={popover.category}
              subcategory={popover.subcategory || ""}
              type={popover.type}
              onSave={handleSavePopover}
              onCancel={() => setPopover(null)}
            />
          </div>
        )}
      </>
    );
  },
);

// Adăugăm displayName pentru debugging mai ușor
LunarGridTanStack.displayName = "LunarGridTanStack";

export default LunarGridTanStack;
