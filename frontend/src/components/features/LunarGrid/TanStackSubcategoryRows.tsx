import React, { useMemo, useCallback } from "react";
import { TanStackSubcategoryRowsProps } from "./types";
import { TransactionType } from "@shared-constants/enums";
import { cn } from "../../../styles/cva/shared/utils";
import { tableRow, tableCell } from "../../../styles/cva/data";
import { button } from "../../../styles/cva/components/forms";

/**
 * Componentă pentru afișarea rândurilor de subcategorii în cadrul grilei TanStack Table
 * Această componentă este optimizată pentru re-render-uri independente de categoria părinte
 * Folosește memoizare pentru a preveni re-renderări inutile
 * Migrated la CVA styling system pentru consistență
 */
const TanStackSubcategoryRows: React.FC<TanStackSubcategoryRowsProps> = ({
  categoryKey,
  subcategories,
  days,
  transactions,
  formatCurrency,
  getBalanceStyle,
  getSumForCell,
  handleCellClick,
  handleCellDoubleClick,
  handleEditSubcategory,
  handleDeleteSubcategory,
  isCustomSubcategory,
  getTransactionTypeForCategory,
}) => {
  // Memoizarea subcategoriilor pentru a preveni re-renderări inutile
  const memoizedSubcategories = useMemo(() => {
    return subcategories.map((subcategory) => {
      const isCustom = isCustomSubcategory(categoryKey, subcategory.name);
      return { subcategory, isCustom };
    });
  }, [subcategories, categoryKey, isCustomSubcategory]);

  return (
    <>
      {memoizedSubcategories.map(({ subcategory, isCustom }) => {
        // isCustom este acum calculat în memoizedSubcategories
        return (
          <tr
            key={`${categoryKey}-${subcategory.name}`}
            className={cn(
              tableRow({ variant: "hoverable" }),
              "group transition-colors duration-150",
            )}
            data-testid={`subcat-row-${categoryKey}-${subcategory.name}`}
          >
            {/* Prima celulă: numele subcategoriei */}
            <td
              className={cn(
                tableCell({ variant: "default" }),
                "sticky left-0 bg-white z-10 pl-8",
                "flex justify-between items-center",
              )}
              data-testid={`subcategory-${categoryKey}-${subcategory.name}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {subcategory.name}
                </span>
                {isCustom && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5",
                      "text-xs font-medium",
                      "bg-emerald-100 text-emerald-700",
                    )}
                  >
                    custom
                  </span>
                )}
              </div>

              {/* Butoane acțiuni pentru subcategorii (doar afișate la hover) */}
              <div
                className={cn(
                  "flex items-center space-x-1 opacity-0",
                  "group-hover:opacity-100 transition-opacity duration-150",
                )}
              >
                {handleEditSubcategory && (
                  <button
                    onClick={() =>
                      handleEditSubcategory(categoryKey, subcategory.name)
                    }
                    className={cn(
                      "inline-flex items-center justify-center",
                      "w-6 h-6 rounded-md",
                      "text-gray-400 hover:text-gray-600",
                      "hover:bg-gray-100 transition-colors duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                    )}
                    data-testid={`edit-subcategory-${categoryKey}-${subcategory.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                )}

                {isCustom && handleDeleteSubcategory && (
                  <button
                    onClick={() =>
                      handleDeleteSubcategory(categoryKey, subcategory.name)
                    }
                    className={cn(
                      "inline-flex items-center justify-center",
                      "w-6 h-6 rounded-md",
                      "text-gray-400 hover:text-red-600",
                      "hover:bg-red-50 transition-colors duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
                    )}
                    data-testid={`delete-subcategory-${categoryKey}-${subcategory.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                )}
              </div>
            </td>

            {/* Celule pentru fiecare zi din lună */}
            {days.map((day) => {
              const amount = getSumForCell(categoryKey, subcategory.name, day);
              const formattedAmount =
                amount !== 0 ? formatCurrency(amount) : "—";
              const type = getTransactionTypeForCategory(categoryKey);

              return (
                <td
                  key={day}
                  className={cn(
                    tableCell({ variant: "clickable" }),
                    "text-right cursor-pointer",
                    getBalanceStyle(amount),
                    "transition-colors duration-150",
                  )}
                  onClick={(e) =>
                    handleCellClick(
                      e,
                      categoryKey,
                      subcategory.name,
                      day,
                      formattedAmount,
                      type,
                    )
                  }
                  onDoubleClick={
                    handleCellDoubleClick
                      ? (e) =>
                          handleCellDoubleClick(
                            e,
                            categoryKey,
                            subcategory.name,
                            day,
                            formattedAmount,
                          )
                      : undefined
                  }
                  data-testid={`cell-${categoryKey}-${subcategory.name}-${day}`}
                >
                  {formattedAmount}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

// Folosim React.memo pentru a optimiza și preveni re-renderări inutile când props nu se schimbă
export default React.memo(TanStackSubcategoryRows, (prevProps, nextProps) => {
  // Comparare custom pentru a determina dacă componenta trebuie re-renderată
  // Returnăm true dacă props sunt identice (deci NU trebuie re-renderată)
  return (
    prevProps.categoryKey === nextProps.categoryKey &&
    prevProps.subcategories.length === nextProps.subcategories.length &&
    prevProps.days.length === nextProps.days.length &&
    prevProps.transactions === nextProps.transactions && // Referință la același array
    JSON.stringify(prevProps.subcategories) ===
      JSON.stringify(nextProps.subcategories)
    // Nu verificăm funcțiile deoarece sunt puse în referințe stabile deja prin useCallback în componenta părinte
  );
});
