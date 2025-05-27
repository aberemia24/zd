import { useMemo, useRef, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  Table,
} from "@tanstack/react-table";

import { TransactionValidated } from "@shared-constants/transaction.schema";
import { EXCEL_GRID } from "@shared-constants";

// Import stores (doar cele necesare)
import { useCategoryStore } from "../../../../stores/categoryStore";
import { useAuthStore } from "../../../../stores/authStore";
// Folosim direct noul hook specializat pentru încărcarea lunară
import { useMonthlyTransactions } from "../../../../services/hooks/useMonthlyTransactions";

import type { LunarGridRowData } from "../types";

// Import-uri utilitare din @utils/lunarGrid (via barrel file)
import {
  getDaysInMonth,
  formatCurrency,
  getBalanceStyleClass,
  transformTransactionsToRowData,
  generateTableColumns,
  transformToTableData,
} from "../../../../utils/lunarGrid";

// Interfaces pentru structuri de date
interface SubcategoryDefinition {
  name: string;
  source?: string;
}

interface FallbackRow {
  subcategory: string;
}

interface DailyAmount {
  [dayKey: `day-${number}`]: number;
}

// Tip pentru datele transformate pentru TanStack Table
export type TransformedTableDataRow = {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  total: number;
  subRows?: TransformedTableDataRow[]; // Adăugat pentru subrows native
} & DailyAmount;

/**
 * Hook pentru gestionarea datelor și stării pentru LunarGrid bazat pe TanStack Table.
 * Abstractizează logica de procesare a datelor și construcția tabelului.
 */
// Interfață pentru rezultatul hook-ului useLunarGridTable
export interface UseLunarGridTableResult {
  table: Table<TransformedTableDataRow>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: Error | null;
  getCellId: (
    category: string,
    subcategory: string | undefined,
    day: number,
  ) => string;
  columns: ColumnDef<TransformedTableDataRow>[];
  days: number[];
  dailyBalances: Record<number, number>;
}

// Helper robust pentru generare subRows UNICE cu indexare globală pe subcategory goală
function buildUniqueSubRows(
  categoryName: string,
  subcategories: SubcategoryDefinition[],
  fallbackRows: FallbackRow[],
) {
  // Combină toate subRows (din definiție și fallback)
  const all = [
    ...subcategories.map((sub) => ({
      subcategory: sub.name || "",
      source: "def",
    })),
    ...fallbackRows.map((sub) => ({
      subcategory: sub.subcategory || "",
      source: "fallback",
    })),
  ];
  const seen = new Set<string>();
  let emptyCount = 0;
  return all.map((sub, idx) => {
    let id;
    if (sub.subcategory) {
      id = `${categoryName}-${sub.subcategory}`;
    } else {
      id = `${categoryName}-__empty-${emptyCount}`;
      emptyCount++;
    }
    while (seen.has(id)) {
      id = `${categoryName}-__empty-${emptyCount}-${Math.random().toString(36).slice(2, 6)}`;
      emptyCount++;
    }
    seen.add(id);
    return {
      id,
      category: categoryName,
      subcategory: sub.subcategory,
      isCategory: false,
      total: 0,
    };
  });
}

// Validare pentru duplicate (doar în dev)
function warnIfDuplicateIds(rows: TransformedTableDataRow[], context: string) {
  const ids = rows.map((r) => r.id);
  const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  if (duplicates.length > 0 && import.meta.env.NODE_ENV !== "production") {

    console.warn(
      `[LunarGrid] Chei duplicate detectate în ${context}:`,
      duplicates,
    );
  }
}

export function useLunarGridTable(
  year: number,
  month: number,
  expandedCategories: Record<string, boolean>,
  onCellClick?: (
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string,
  ) => void,
  onCellDoubleClick?: (
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string,
  ) => void,
): UseLunarGridTableResult {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Store hooks
  const categories = useCategoryStore((state) => state.categories);
  const user = useAuthStore((state) => state.user);

  // Folosim direct noul hook specializat pentru încărcarea lunară
  const {
    transactions: validTransactions,
    isLoading: isLoadingTransactions,
    error: queryError,
    totalCount,
  } = useMonthlyTransactions(year, month, user?.id, {
    includeAdjacentDays: true,
  });

  // Gestionare erori de la React Query
  useEffect(() => {
    if (queryError) {
      console.error("Error fetching transactions:", queryError.message);
    }
  }, [queryError]);

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Pipeline de transformare a datelor

  // Transformăm în formatul necesar pentru tabel cu subrows native
  const rawTableData = useMemo(() => {
    // 1. Grupăm tranzacțiile pe categorii și subcategorii
    const categoriesMap: Record<string, TransformedTableDataRow> = {};
    const fallbackRowsMap: Record<string, FallbackRow[]> = {};

    categories.forEach((category) => {
      categoriesMap[category.name] = {
        id: category.name,
        category: category.name,
        isCategory: true,
        total: 0,
        subRows: [], // va fi completat ulterior
      };
      fallbackRowsMap[category.name] = [];
    });

    // 2. Parcurgem tranzacțiile și agregăm sumele pe subcategorii
    validTransactions.forEach((t) => {
      const cat = t.category;
      const subcat = typeof t.subcategory === "string" ? t.subcategory : "";
      const day = new Date(t.date).getDate();
      const amount =
        t.status === "COMPLETED" && typeof t.actualAmount === "number"
          ? t.actualAmount
          : t.amount;
      if (!cat) return;
      // Caută dacă subcategoria există deja în definiție
      const categoryDef = categories.find((c) => c.name === cat);
      const existsInDef =
        categoryDef &&
        categoryDef.subcategories.some((s) => (s.name || "") === subcat);
      if (!existsInDef) {
        // Adaugă la fallbackRows pentru această categorie
        fallbackRowsMap[cat] = fallbackRowsMap[cat] || [];
        // Nu adăuga duplicate fallback
        if (!fallbackRowsMap[cat].some((s) => s.subcategory === subcat)) {
          fallbackRowsMap[cat].push({ subcategory: subcat });
        }
      }
    });

    // 3. Construim subRows UNICE pentru fiecare categorie
    Object.keys(categoriesMap).forEach((cat) => {
      const categoryDef = categories.find((c) => c.name === cat);
      const subcategories = categoryDef ? categoryDef.subcategories : [];
      const fallbackRows = fallbackRowsMap[cat] || [];
      // Construim subRows UNICE
      const subRows = buildUniqueSubRows(cat, subcategories, fallbackRows);
      categoriesMap[cat].subRows = subRows;
    });

    // 4. Parcurgem tranzacțiile și agregăm sumele pe subRows
    validTransactions.forEach((t) => {
      const cat = t.category;
      const subcat = typeof t.subcategory === "string" ? t.subcategory : "";
      const day = new Date(t.date).getDate();
      const amount =
        t.status === "COMPLETED" && typeof t.actualAmount === "number"
          ? t.actualAmount
          : t.amount;
      if (!cat) return;
      const subRows = categoriesMap[cat]?.subRows || [];
      let subRow = subRows.find(
        (s: TransformedTableDataRow) => s.subcategory === subcat,
      );
      if (subRow) {
        subRow[`day-${day}`] = (subRow[`day-${day}`] || 0) + amount;
        subRow.total = (subRow.total || 0) + amount;
      }
      // Categorie (agregare totală)
      if (!categoriesMap[cat])
        categoriesMap[cat] = {
          id: cat,
          category: cat,
          isCategory: true,
          total: 0,
          subRows: [],
        };
      categoriesMap[cat][`day-${day}`] =
        (categoriesMap[cat][`day-${day}`] || 0) + amount;
      categoriesMap[cat].total = (categoriesMap[cat].total || 0) + amount;
    });

    // 5. Validare pentru duplicate la nivel de subRows
    Object.keys(categoriesMap).forEach((cat) => {
      warnIfDuplicateIds(
        categoriesMap[cat].subRows!,
        `subRows pentru categoria ${cat}`,
      );
    });
    warnIfDuplicateIds(Object.values(categoriesMap), "categorii principale");

    // 6. Returnăm array-ul de categorii (fără sold)
    return Object.values(categoriesMap);
  }, [validTransactions, categories]);

  // Click handler strategy SIMPLIFICATĂ - fără setTimeout pentru performance
  const stableClickHandlers = useMemo(() => {
    if (!onCellClick && !onCellDoubleClick) return null;

    return {
      handleSingleClick: (
        e: React.MouseEvent,
        category: string,
        subcategory: string | undefined,
        dayNumber: number,
        valueDisplay: string,
      ) => {
        e.stopPropagation();

        if (onCellClick) {
          onCellClick(e, category, subcategory, dayNumber, valueDisplay);
        }
      },

      handleDoubleClick: (
        e: React.MouseEvent,
        category: string,
        subcategory: string | undefined,
        dayNumber: number,
        valueDisplay: string,
      ) => {
        e.stopPropagation();
        e.preventDefault();

        if (onCellDoubleClick) {
          onCellDoubleClick(e, category, subcategory, dayNumber, valueDisplay);
        }
      },
    };
  }, [onCellClick, onCellDoubleClick]);

  // Generare coloane pentru tabel
  const columns = useMemo<ColumnDef<TransformedTableDataRow>[]>(() => {
    const generatedCols = generateTableColumns(year, month); // Din @utils/lunarGrid/dataTransformers

    return generatedCols.map((colConfig) => {
      if (colConfig.accessorKey === "category") {
        return {
          id: "category",
          header: colConfig.header,
          accessorFn: (row: TransformedTableDataRow) =>
            row.isCategory ? row.category : row.subcategory,
          cell: ({ row, getValue }) => {
            const displayValue = getValue<string>();
            const original = row.original as TransformedTableDataRow;
            return (
              <div className="flex items-center">
                {row.getCanExpand && row.getCanExpand() ? (
                  <span
                    className="mr-1"
                    data-testid={`expand-btn-${original.category}`}
                  >
                    {row.getIsExpanded() ? "▼" : "▶"}
                  </span>
                ) : null}
                <span className={original.isCategory ? "font-semibold" : ""}>
                  {displayValue}
                </span>
              </div>
            );
          },
          size: 200,
        };
      }

      if (colConfig.accessorKey?.startsWith("day-")) {
        const dayNumber = parseInt(colConfig.accessorKey.split("-")[1], 10);
        return {
          id: colConfig.accessorKey,
          header: colConfig.header,
          accessorKey: colConfig.accessorKey,
          cell: ({ getValue, row }) => {
            const value = getValue<number>();
            const original = row.original as TransformedTableDataRow;
            const colorClass = getBalanceStyleClass(value);
            const valueDisplay =
              typeof value === "number" && !isNaN(value) && value !== 0
                ? formatCurrency(value)
                : "—";

            // Adăugăm click handlers doar pentru subcategorii (nu pentru categorii)
            const isSubcategory = !original.isCategory && original.subcategory;

            if (isSubcategory && stableClickHandlers) {
              return (
                <div
                  className={`text-right ${colorClass} cursor-pointer hover:bg-blue-50 p-2 transition-colors duration-150`}
                  onClick={(e) =>
                    stableClickHandlers.handleSingleClick(
                      e,
                      original.category,
                      original.subcategory,
                      dayNumber,
                      valueDisplay,
                    )
                  }
                  onDoubleClick={(e) =>
                    stableClickHandlers.handleDoubleClick(
                      e,
                      original.category,
                      original.subcategory,
                      dayNumber,
                      valueDisplay,
                    )
                  }
                  title="Click: Quick Add | Double-click: Advanced Edit"
                  data-testid={`cell-${original.category}-${original.subcategory}-${dayNumber}`}
                >
                  {valueDisplay}
                </div>
              );
            }

            // Pentru categorii (readonly)
            return (
              <div
                className={`text-right ${colorClass} p-2`}
                title="Suma calculată automată din subcategorii"
              >
                {valueDisplay}
              </div>
            );
          },
          size: 80,
        };
      }

      if (colConfig.accessorKey === "total") {
        return {
          id: "total",
          header: colConfig.header,
          accessorKey: colConfig.accessorKey,
          cell: ({ getValue }) => {
            const value = getValue<number>();
            const colorClass = getBalanceStyleClass(value);
            return (
              <div className={`text-right ${colorClass}`}>
                {typeof value === "number" && !isNaN(value) && value !== 0
                  ? formatCurrency(value)
                  : "—"}
              </div>
            );
          },
          size: 100,
        };
      }
      return colConfig as ColumnDef<TransformedTableDataRow>; // Fallback, ar trebui acoperite toate cazurile
    });
  }, [year, month, stableClickHandlers, formatCurrency, getBalanceStyleClass]);

  const table = useReactTable({
    data: rawTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.subRows || [],
    autoResetExpanded: false,
    getRowId: (row) => row.id,
  });

  const dailyBalances = useMemo(() => ({}), [rawTableData]);

  // Funcția getSumForCell originală se baza pe LunarGridRowData.
  // O adaptăm sau o eliminăm dacă nu mai e necesară extern.
  // Pentru moment, o comentăm, deoarece LunarGridTanStack nu pare să o folosească direct.
  /*
  const getSumForCell = useCallback((category: string, subcategory: string | undefined, day: number) => {
    const row = rawTableData.find((r: LunarGridRowData) => 
      r.category === category && 
      (subcategory ? r.subcategory === subcategory : r.isCategory)
    );
    return row ? row.dailyAmounts[day] || 0 : 0;
  }, [rawTableData]);
  */

  // Funcție pentru a genera un ID unic pentru celule (folosit pentru identificarea celulei în editare)
  const getCellId = useCallback(
    (
      category: string,
      subcategory: string | undefined,
      day: number,
    ): string => {
      return `${category}-${subcategory || "null"}-${day}`;
    },
    [],
  );

  return {
    table,
    columns,
    days,
    tableContainerRef,
    dailyBalances,
    isLoading: isLoadingTransactions,
    error: queryError,
    getCellId, // Adăugat pentru suport editare inline
  } as UseLunarGridTableResult;
}
