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

// Importăm tipuri și constante din shared-constants (sursa de adevăr)
import { TransactionType, FrequencyType, LUNAR_GRID_MESSAGES, MESAJE } from "@shared-constants";
import { LUNAR_GRID } from "@shared-constants";

// Import componentele UI
import Button from "../../primitives/Button/Button";
import CellTransactionPopover from "./CellTransactionPopover";
import { EditableCell } from "./inline-editing/EditableCell";

// 🎯 Step 3.3: Import singleton formatters pentru performanță
import { formatCurrency } from "../../../utils/lunarGrid";

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

        if (isNaN(numValue) || numValue <= 0) {
          const errorMsg = "Valoare invalidă - trebuie să fie un număr pozitiv";
          // 🎯 Step 1.6: Toast error pentru validare
          toast.error(errorMsg);
          throw new Error(errorMsg);
        }

        // 🐞 Step 1.5: FIX Bug UTC date shift - construim direct string YYYY-MM-DD
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // 🚧 Step 1.2: Logic pentru UPDATE vs CREATE (TO BE IMPLEMENTED)
        if (transactionId) {
          // 🔄 UPDATE existing transaction
          const updatePayload: UpdateTransactionHookPayload = {
            amount: numValue,
            // Nu actualizăm categoria/subcategoria/data în editarea simplă inline
            // doar valoarea
          };

          try {
            await new Promise<void>((resolve, reject) => {
              updateTransactionMutation.mutate({ id: transactionId, transactionData: updatePayload }, {
                onSuccess: () => {
                  // 🎯 Step 1.6: Toast success pentru UPDATE
                  toast.success(MESAJE.SUCCES_EDITARE);
                  resolve();
                },
                onError: (error: Error) => {
                  // 🎯 Step 1.6: Toast error pentru UPDATE
                  toast.error(`${MESAJE.EROARE_SALVARE_TRANZACTIE}: ${error.message}`);
                  reject(error);
                },
              });
            });
          } catch (error) {
            throw error;
          }
        } else {
          // ➕ CREATE new transaction (existing logic)
          const createPayload: CreateTransactionHookPayload = {
            amount: numValue,
            category,
            subcategory: subcategory || undefined,
            type: determineTransactionType(category),
            date,
            recurring: false,
            frequency: undefined,
          };

          try {
            // React Query mutation face cache invalidation automat - nu mai adăugăm manual
            await new Promise<void>((resolve, reject) => {
              createTransactionMutation.mutate(createPayload, {
                onSuccess: () => {
                  // 🎯 Step 1.6: Toast success pentru CREATE
                  toast.success(MESAJE.SUCCES_ADAUGARE);
                  resolve();
                },
                onError: (error: Error) => {
                  // 🎯 Step 1.6: Toast error pentru CREATE
                  toast.error(`${MESAJE.EROARE_ADAUGARE}: ${error.message}`);
                  reject(error);
                },
              });
            });

            // ELIMINAT: Cache invalidation manual - se face automat în mutation onSuccess
          } catch (error) {
            throw error;
          }
        }
      },
      [year, month, createTransactionMutation, determineTransactionType, updateTransactionMutation],
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
            className="w-full h-full min-h-[40px]"
            data-testid={`editable-cell-${cellId}`}
          />
        );
      },
      [handleEditableCellSave, transactionMap],
    );

    // Funcție pentru calcularea sumei totale
    const monthTotal = useMemo(
      () => days.reduce((acc, day) => acc + (dailyBalances[day] || 0), 0),
      [days, dailyBalances],
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
                      isFirstCell ? "sticky left-0 bg-inherit z-10" : "",
                    )}
                    title={
                      isCategory && isDayCell
                        ? "Suma calculată automată din subcategorii"
                        : undefined
                    }
                  >
                    {isDayCell && isSubcategory
                      ? renderEditableCell(
                          original.category,
                          original.subcategory,
                          parseInt(cell.column.id.split("-")[1]),
                          cell.getValue() as string | number,
                        )
                      : (flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        ) as React.ReactNode)}
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
            gridContainer({ size: "full" }),
            "relative overflow-x-auto rounded-lg border border-gray-200",
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
              className={cn(dataTable({ variant: "striped" }))}
              data-testid="lunar-grid-table"
            >
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {table.getFlatHeaders().map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        tableHeader(),
                        header.id === "category" 
                          ? "sticky left-0 z-20 text-left" 
                          : "text-right"
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => renderRow(row))}
                
                {/* Rând de total */}
                <tr className={cn(
                  "bg-gray-100 font-bold border-t-2 border-gray-300",
                  "hover:bg-gray-200 transition-colors duration-150"
                )} data-testid="sold-row">
                  <td className={cn(
                    tableCell({ variant: "default" }),
                    "sticky left-0 bg-gray-100 z-10 font-bold"
                  )}>
                    {LUNAR_GRID.TOTAL_BALANCE}
                  </td>
                  {days.map((day) => {
                    const balance = dailyBalances[day] || 0;
                    return (
                      <td 
                        key={day} 
                        className={cn(
                          tableCell({ variant: "numeric" }),
                          getBalanceStyle(balance),
                          "transition-colors duration-150"
                        )}
                      >
                        {balance !== 0 ? formatCurrency(balance) : "-"}
                      </td>
                    );
                  })}
                  <td className={cn(
                    tableCell({ variant: "numeric" }),
                    getBalanceStyle(monthTotal),
                    "font-bold",
                    "transition-colors duration-150"
                  )}>
                    {formatCurrency(monthTotal)}
                  </td>
                </tr>
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
