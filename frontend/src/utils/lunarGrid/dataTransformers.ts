import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants';
import { LunarGridRowData } from '../../components/features/LunarGrid/types';
import { 
  calculateAmountsForCategory, 
  calculateAmountsForSubcategory, 
  calculateDailyBalances,
  getDaysInMonth,
  calculateTotal 
} from './calculations'; 

// Extrage doar câmpurile necesare din EXCEL_GRID
const { HEADERS } = EXCEL_GRID;

/**
 * Transformă categoriile și tranzacțiile în structura de date pentru tabel
 * @param transactions Lista de tranzacții
 * @param categories Lista de categorii
 * @param expandedCategories Starea categoriilor expandate/colapsate
 * @returns Array cu rândurile pentru tabel
 */
export function transformTransactionsToRowData(
  transactions: TransactionValidated[],
  categories: { name: string; subcategories: { name: string }[] }[],
  expandedCategories: Record<string, boolean>
): LunarGridRowData[] {
  const rows: LunarGridRowData[] = [];
  
  // Procesăm fiecare categorie
  categories.forEach(category => {
    const categoryTransactions = transactions.filter(t => t.category === category.name);
    const dailyAmounts = calculateAmountsForCategory(category.name, transactions);
    
    // Adăugăm rândul pentru categorie
    rows.push({
      id: `category-${category.name}`,
      category: category.name,
      isCategory: true,
      isExpanded: expandedCategories[category.name],
      dailyAmounts,
      transactions: categoryTransactions
    });
    
    // Dacă categoria este expandată, adăugăm subcategoriile
    if (expandedCategories[category.name]) {
      category.subcategories.forEach(subcategory => {
        const subcategoryTransactions = categoryTransactions.filter(
          t => t.subcategory === subcategory.name
        );
        const subcatDailyAmounts = calculateAmountsForSubcategory(
          category.name, 
          subcategory.name, 
          transactions
        );
        
        rows.push({
          id: `subcategory-${category.name}-${subcategory.name}`,
          category: category.name,
          subcategory: subcategory.name,
          isCategory: false,
          dailyAmounts: subcatDailyAmounts,
          transactions: subcategoryTransactions
        });
      });
    }
  });
  
  // Adăugăm rândul pentru sold
  const soldRow: LunarGridRowData = {
    id: 'balance-row',
    category: EXCEL_GRID.HEADERS.SOLD,
    isCategory: true,
    dailyAmounts: calculateDailyBalances(transactions),
    transactions: []
  };
  
  rows.push(soldRow);
  
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
  month: number
): { accessorKey: string; header: string }[] {
  const daysInMonth = getDaysInMonth(year, month);
  
  // Coloana pentru categorii
  const columns = [{
    accessorKey: 'category',
    header: HEADERS.CATEGORII,
  }];
  
  // Coloane pentru zile
  daysInMonth.forEach((day: number) => {
    columns.push({
      accessorKey: `day-${day}`,
      header: day.toString(),
    });
  });
  
  // Coloana pentru total
  columns.push({
    accessorKey: 'total',
    header: HEADERS.TOTAL,
  });
  
  return columns;
}

/**
 * Transformă datele pentru a fi folosite în TanStack Table
 * @param rowData Datele de intrare
 * @returns Datele transformate pentru tabel
 */
export function transformToTableData(rowData: LunarGridRowData[]) {
  return rowData.map(row => {
    const rowData: Record<string, any> = {
      id: row.id,
      category: row.category,
      isCategory: row.isCategory,
      ...(row.subcategory && { subcategory: row.subcategory }),
    };
    
    // Adăugăm sumele zilnice
    Object.entries(row.dailyAmounts || {}).forEach(([day, amount]) => {
      rowData[`day-${day}`] = amount;
    });
    
    // Calculăm totalul
    if (row.dailyAmounts) {
      rowData.total = Object.values(row.dailyAmounts).reduce(
        (sum, amount) => sum + amount, 0
      );
    } else {
      rowData.total = 0;
    }
    
    return rowData;
  });
}
