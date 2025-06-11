import { TransactionValidated } from "@budget-app/shared-constants/transaction.schema";
import { EXCEL_GRID } from "@budget-app/shared-constants";
import { LunarGridRowData } from "../../components/features/LunarGrid/types";
import {
  calculateAmountsForCategory,
  calculateAmountsForSubcategory,
  calculateDailyBalance,
  getDaysInMonth,
  resetCalculationsCache,
} from "./calculations";
import { formatDayMonth, getDayHeaderStyle } from "./formatters";

// Extrage doar câmpurile necesare din EXCEL_GRID
const { HEADERS } = EXCEL_GRID;

// Constante pentru identificatori
const ROW_ID = {
  CATEGORY_PREFIX: "category-",
  SUBCATEGORY_PREFIX: "subcategory-",
  BALANCE: "balance",
};

/**
 * Creează un rând de categorie pentru LunarGrid
 *
 * @param categoryName Numele categoriei
 * @param transactions Tranzacții pentru filtrate pentru această categorie
 * @param allTransactions Toate tranzacțiile pentru calcule
 * @returns Rând de date pentru categorie
 */
function createCategoryRow(
  categoryName: string,
  transactions: TransactionValidated[],
  allTransactions: TransactionValidated[],
): LunarGridRowData {
  return {
    id: `${ROW_ID.CATEGORY_PREFIX}${categoryName}`,
    category: categoryName,
    isCategory: true,
    dailyAmounts: calculateAmountsForCategory(categoryName, allTransactions),
    transactions,
  };
}

/**
 * Creează un rând de subcategorie pentru LunarGrid
 *
 * @param categoryName Numele categoriei părinte
 * @param subcategoryName Numele subcategoriei
 * @param transactions Tranzacții filtrate pentru această subcategorie
 * @param allTransactions Toate tranzacțiile pentru calcule
 * @returns Rând de date pentru subcategorie
 */
function createSubcategoryRow(
  categoryName: string,
  subcategoryName: string,
  transactions: TransactionValidated[],
  allTransactions: TransactionValidated[],
): LunarGridRowData {
  return {
    id: `${ROW_ID.SUBCATEGORY_PREFIX}${categoryName}-${subcategoryName}`,
    category: categoryName,
    subcategory: subcategoryName,
    isCategory: false,
    dailyAmounts: calculateAmountsForSubcategory(
      categoryName,
      subcategoryName,
      allTransactions,
    ),
    transactions,
  };
}

/**
 * Creează rândul de sold pentru LunarGrid
 *
 * @param transactions Toate tranzacțiile pentru calculul soldului
 * @returns Rând de date pentru sold
 */
function createBalanceRow(
  transactions: TransactionValidated[],
): LunarGridRowData {
  return {
    id: ROW_ID.BALANCE,
    category: EXCEL_GRID.HEADERS.SOLD,
    isCategory: true,
    dailyAmounts: calculateDailyBalance(transactions),
    transactions: [],
  };
}

/**
 * Transformă un set de tranzacții în date pentru grid cu optimizări de performanță
 *
 * @param transactions Lista de tranzacții
 * @param categories Lista de categorii cu subcategorii
 * @param expandedCategories Obiect care indică ce categorii sunt expandate
 * @returns Array de LunarGridRowData pentru tabel
 * @example
 * transformTransactionsToRowData(transactions, categories, { 'Cheltuieli': true })
 */
export function transformTransactionsToRowData(
  transactions: TransactionValidated[],
  categories: { name: string; subcategories: { name: string }[] }[],
  expandedCategories: Record<string, boolean>,
): LunarGridRowData[] {
  // Resetăm cache-ul pentru noul set de calcule
  resetCalculationsCache();

  const rows: LunarGridRowData[] = [];

  // Procesăm fiecare categorie
  categories.forEach((category) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category === category.name,
    );

    // Adăugăm rândul pentru categorie
    rows.push(
      createCategoryRow(category.name, categoryTransactions, transactions),
    );

    // Dacă categoria este expandată, adăugăm subcategoriile
    if (expandedCategories[category.name]) {
      category.subcategories.forEach((subcategory) => {
        const subcategoryTransactions = categoryTransactions.filter(
          (t) => t.subcategory === subcategory.name,
        );

        rows.push(
          createSubcategoryRow(
            category.name,
            subcategory.name,
            subcategoryTransactions,
            transactions,
          ),
        );
      });
    }
  });

  // Adăugăm rândul pentru sold
  rows.push(createBalanceRow(transactions));

  return rows;
}

/**
 * Generează coloanele pentru tabel pe baza zilelor din lună
 * @param year Anul
 * @param month Luna (1-12)
 * @returns Array cu definițiile coloanelor
 */
export function generateTableColumns(
  year: number,
  month: number,
): Array<{ accessorKey: string; header: string; headerStyle?: string }> {
  const daysInMonth = getDaysInMonth(year, month);

  // Coloana pentru categorii
  const columns: Array<{ accessorKey: string; header: string; headerStyle?: string }> = [
    {
      accessorKey: "category",
      header: HEADERS.CATEGORII,
    },
  ];

  // Coloane pentru zile
  daysInMonth.forEach((day: number) => {
    columns.push({
      accessorKey: `day-${day}`,
      header: formatDayMonth(day, month),
      headerStyle: getDayHeaderStyle(day, month, year),
    });
  });

  // Coloana pentru total
  columns.push({
    accessorKey: "total",
    header: HEADERS.TOTAL,
  });

  return columns;
}

/**
 * Transformă datele pentru a fi folosite în TanStack Table
 * @param rowData Datele de intrare
 * @returns Datele transformate pentru tabel
 */
export function transformToTableData(
  rowData: LunarGridRowData[],
  year: number,
  month: number,
) {
  return rowData.map((row) => {
    const daysInMonth = getDaysInMonth(year, month);
    const rowDataForTable: Record<string, any> = {
      id: row.id,
      category: row.category,
      isCategory: row.isCategory,
      ...(row.subcategory && { subcategory: row.subcategory }),
    };

    // Inițializăm toate zilele cu 0 și apoi suprascriem cu valorile existente
    daysInMonth.forEach((day) => {
      rowDataForTable[`day-${day}`] = 0;
    });

    // Adăugăm sumele zilnice existente
    Object.entries(row.dailyAmounts || {}).forEach(([day, amount]) => {
      rowDataForTable[`day-${day}`] = amount || 0; // Asigurăm că amount este un număr
    });

    // Calculăm totalul robust
    let calculatedTotal = 0;
    daysInMonth.forEach((day) => {
      calculatedTotal += (rowDataForTable[`day-${day}`] || 0) as number;
    });
    rowDataForTable.total = calculatedTotal;

    return rowDataForTable;
  });
}
