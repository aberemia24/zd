import { useMemo, useRef, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  Table,
} from "@tanstack/react-table";

// Import stores (doar cele necesare)
import { useCategoryStore } from "../../../../stores/categoryStore";
import { useAuthStore } from "../../../../stores/authStore";
// Folosim direct noul hook specializat pentru încărcarea lunară
import { useMonthlyTransactions } from "../../../../services/hooks/useMonthlyTransactions";

// Import-uri pentru tipurile de tranzacții
import type { TransactionValidated } from "@shared-constants/transaction.schema";

// Import-uri utilitare din @utils/lunarGrid (via barrel file) - doar cele folosite
import {
  getDaysInMonth,
  getBalanceStyleClass,
  getCategoryStyleClass,
  generateTableColumns,
  formatCurrencyCompact,
  formatMonthYear,
} from "../../../../utils/lunarGrid";
import { MESAJE, LUNAR_GRID_MESSAGES } from "@shared-constants";

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

// Tip pentru maparea tranzacțiilor individuale
export type TransactionMap = Map<string, string>; // key: "category-subcategory-day", value: transactionId

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
  transactionMap: TransactionMap;
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

  // 🔍 DEBUG: Tracking categories changes
  console.log('🔍 [STORE-BASIC-DEBUG] Basic store values:', {
    categoriesExists: !!categories,
    categoriesLength: categories?.length || 0,
    userExists: !!user,
    userId: user?.id
  });

  useEffect(() => {
    console.log('🔍 [CATEGORIES-DEBUG] Categories updated from store:', {
      count: categories?.length || 0,
      timestamp: new Date().toISOString(),
      categories: categories?.map(cat => ({
        name: cat.name,
        subcategoriesCount: cat.subcategories?.length || 0,
        subcategories: cat.subcategories?.map(sub => ({
          name: sub.name,
          isCustom: sub.isCustom
        })) || []
      }))
    });
  }, [categories]);

  // Folosim direct noul hook specializat pentru încărcarea lunară
  const {
    transactions: validTransactions,
    isLoading: isLoadingTransactions,
    error: queryError,
  } = useMonthlyTransactions(year, month, user?.id, {
    includeAdjacentDays: true,
  });

  // 🐞 DEBUG: Verificăm dacă datele se actualizează după cache sync
  useEffect(() => {
    console.log('🔍 [COMPONENT-DEBUG] validTransactions updated:', {
      count: validTransactions?.length || 0,
      timestamp: new Date().toISOString(),
      sampleTransactions: validTransactions?.slice(0, 3)?.map(t => ({
        id: t.id,
        amount: t.amount,
        date: t.date,
        category: t.category,
        subcategory: t.subcategory
      }))
    });
  }, [validTransactions]);

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
    console.log('🔍 [RAWTABLE-DEBUG] Starting data transformation with:', {
      categoriesCount: categories?.length || 0,
      transactionsCount: validTransactions?.length || 0,
      categories: categories?.map(cat => cat.name) || []
    });

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
      
      console.log(`🔍 [SUBROWS-DEBUG] Building subRows for category "${cat}":`, {
        subcategoriesFromDef: subcategories?.map(sub => ({
          name: sub.name,
          isCustom: sub.isCustom
        })) || [],
        fallbackRows: fallbackRows?.map(fb => fb.subcategory) || [],
        categoryDef: categoryDef ? 'Found' : 'Not found'
      });
      
      // Construim subRows UNICE
      const subRows = buildUniqueSubRows(cat, subcategories, fallbackRows);
      categoriesMap[cat].subRows = subRows;
      
      console.log(`🔍 [SUBROWS-DEBUG] Built ${subRows.length} subRows for "${cat}":`, 
        subRows.map(sr => sr.subcategory)
      );
    });

    // 4. Aplicăm aceeași strategie de selecție ca în transactionMap pentru consistență
    // Grupăm tranzacțiile per cheie și selectăm tranzacția principală (cea mai mare sumă)
    const transactionGroups = new Map<string, TransactionValidated[]>();
    
    // Construiește grupări pentru selecție
    validTransactions.forEach((t) => {
      const cat = t.category;
      const subcat = typeof t.subcategory === "string" ? t.subcategory : "";
      const day = new Date(t.date).getDate();
      const key = `${cat}-${subcat}-${day}`;
      
      if (!transactionGroups.has(key)) {
        transactionGroups.set(key, []);
      }
      transactionGroups.get(key)!.push(t);
    });
    
    // Pentru fiecare grupă, selectează tranzacția cu cea mai mare sumă
    const selectedTransactions: TransactionValidated[] = [];
    for (const [key, transactions] of transactionGroups) {
      // 🔥 NEW STRATEGY: Selectează tranzacția cea mai recentă (ultima modificată/creată)
      const primaryTransaction = transactions.reduce((latest, current) => {
        // Folosește updated_at dacă există, altfel created_at, altfel fallback pe amount
        const latestTime = new Date(latest.updated_at || latest.created_at || '1970-01-01').getTime();
        const currentTime = new Date(current.updated_at || current.created_at || '1970-01-01').getTime();
        
        return currentTime > latestTime ? current : latest;
      });
      selectedTransactions.push(primaryTransaction);
    }
    
    // Acum procesează doar tranzacțiile selectate pentru a evita dubla agregare
    selectedTransactions.forEach((t) => {
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
        // Setează direct amount-ul tranzacției principale
        subRow[`day-${day}`] = amount;
        subRow.total = (subRow.total || 0) + amount;
      }
      // Categorie (agregare totală) - acum fără dublă agregare
      if (!categoriesMap[cat])
        categoriesMap[cat] = {
          id: cat,
          category: cat,
          isCategory: true,
          total: 0,
          subRows: [],
        };
      categoriesMap[cat][`day-${day}`] = (categoriesMap[cat][`day-${day}`] || 0) + amount;
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

  // Calculez dailyBalances ÎNAINTE de generarea coloanelor
  const dailyBalances = useMemo(() => {
    const balances: Record<number, number> = {};
    
    // Inițializăm cu 0 pentru toate zilele
    days.forEach((day) => {
      balances[day] = 0;
    });
    
    // Agregăm sumele din toate categoriile de top-level pentru fiecare zi
    rawTableData.forEach((categoryRow) => {
      if (categoryRow.isCategory) {
        days.forEach((day) => {
          const dayKey = `day-${day}` as keyof DailyAmount;
          const dayValue = categoryRow[dayKey] || 0;
          balances[day] += dayValue;
        });
      }
    });
    
    return balances;
  }, [rawTableData, days]);

  // Generare coloane pentru tabel
  const columns = useMemo<ColumnDef<TransformedTableDataRow>[]>(() => {
    const generatedCols = generateTableColumns(year, month); // Din @utils/lunarGrid/dataTransformers

    return generatedCols.map((colConfig) => {
      if (colConfig.accessorKey === "category") {
        return {
          id: "category",
          header: ({ column }) => (
            <div className="text-center">
              {colConfig.header}
            </div>
          ),
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
          header: ({ column }) => (
            <div className={`text-center ${colConfig.headerStyle || ""}`}>
              <div className="font-medium">{colConfig.header}</div>
            </div>
          ),
          accessorKey: colConfig.accessorKey,
          cell: ({ getValue, row }) => {
            const value = getValue<number>();
            const original = row.original as TransformedTableDataRow;
            const colorClass = getCategoryStyleClass(original.category, value);
            const valueDisplay =
              typeof value === "number" && !isNaN(value) && value !== 0
                ? formatCurrencyCompact(value)
                : "—";

            // Adăugăm click handlers doar pentru subcategorii (nu pentru categorii)
            const isSubcategory = !original.isCategory && original.subcategory;

            if (isSubcategory && stableClickHandlers) {
              return (
                <div
                  className={`text-center ${colorClass} cursor-pointer hover:bg-gray-50 p-2 transition-colors duration-150`}
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
                className={`text-center ${colorClass} p-2`}
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
          header: ({ column }) => (
            <div className="text-center">
              {colConfig.header}
            </div>
          ),
          accessorKey: colConfig.accessorKey,
          cell: ({ getValue }) => {
            const value = getValue<number>();
            const colorClass = getBalanceStyleClass(value);
            return (
              <div className={`text-center ${colorClass}`}>
                {typeof value === "number" && !isNaN(value) && value !== 0
                  ? formatCurrencyCompact(value)
                  : "—"}
              </div>
            );
          },
          size: 100,
        };
      }
      return colConfig as ColumnDef<TransformedTableDataRow>; // Fallback, ar trebui acoperite toate cazurile
    });
  }, [year, month, stableClickHandlers]);

  const table = useReactTable({
    data: rawTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.subRows || [],
    autoResetExpanded: false,
    getRowId: (row) => row.id,
  });

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

  // Tip pentru maparea tranzacțiilor individuale (modificat pentru a agrega duplicate keys)
  const transactionMap = useMemo((): TransactionMap => {
    const map = new Map<string, string>();
    
    if (!validTransactions?.length) {
      console.log('🔍 [TRANSACTIONMAP-DEBUG] No validTransactions available');
      return map;
    }
    
    console.log('🔍 [TRANSACTIONMAP-DEBUG] Building transactionMap:', {
      transactionCount: validTransactions.length,
      timestamp: new Date().toISOString()
    });
    
    // 🔥 FIX: Grupează tranzacțiile per cheie pentru a agrega duplicate keys
    const transactionGroups = new Map<string, TransactionValidated[]>();
    
    // Construiește grupări
    for (const t of validTransactions) {
      const parsedDate = new Date(t.date);
      const extractedDay = parsedDate.getDate();
      const key = `${t.category}-${t.subcategory || ''}-${extractedDay}`;
      
      if (!transactionGroups.has(key)) {
        transactionGroups.set(key, []);
      }
      transactionGroups.get(key)!.push(t);
    }
    
    // Pentru fiecare cheie, folosește tranzacția cu cea mai mare sumă (principală)
    for (const [key, transactions] of transactionGroups) {
      if (transactions.length > 1) {
        console.log(`🔍 [TRANSACTIONMAP-DEBUG] Multiple transactions for key ${key}:`, {
          count: transactions.length,
          amounts: transactions.map(t => t.amount),
          ids: transactions.map(t => t.id.substring(0, 8))
        });
      }
      
      // 🔥 NEW STRATEGY: Selectează tranzacția cea mai recentă (ultima modificată/creată)
      const primaryTransaction = transactions.reduce((latest, current) => {
        // Folosește updated_at dacă există, altfel created_at, altfel fallback pe amount
        const latestTime = new Date(latest.updated_at || latest.created_at || '1970-01-01').getTime();
        const currentTime = new Date(current.updated_at || current.created_at || '1970-01-01').getTime();
        
        return currentTime > latestTime ? current : latest;
      });
      
      // Extrage ziua din primul element pentru debug
      const parsedDate = new Date(primaryTransaction.date);
      const extractedDay = parsedDate.getDate();
      
      map.set(key, primaryTransaction.id);
      
      // Debug pentru zilele 1-10
      if (extractedDay <= 10) {
        console.log('🔍 [TRANSACTIONMAP-DEBUG] Selected primary transaction for early days:', {
          key,
          selectedId: primaryTransaction.id.substring(0, 8),
          selectedAmount: primaryTransaction.amount,
          totalTransactionsForKey: transactions.length,
          originalDate: primaryTransaction.date,
          updated_at: primaryTransaction.updated_at,
          extractedDay
        });
      }
    }
    
    console.log('🔍 [TRANSACTIONMAP-DEBUG] TransactionMap built:', {
      size: map.size,
      keysample: Array.from(map.keys()).slice(0, 5)
    });
    
    return map;
  }, [validTransactions, year, month]);

  return {
    table,
    columns,
    days,
    tableContainerRef,
    dailyBalances,
    isLoading: isLoadingTransactions,
    error: queryError,
    getCellId, // Adăugat pentru suport editare inline
    transactionMap,
  } as UseLunarGridTableResult;
}
