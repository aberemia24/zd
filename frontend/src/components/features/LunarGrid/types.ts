import { TransactionType } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { ColumnDef } from '@tanstack/react-table';

/**
 * Definirea tipurilor pentru LunarGrid cu TanStack Table
 * Aceste tipuri sunt folosite în hook-ul useLunarGridTable și componente
 */

// Structura de bază pentru datele de rând în TanStack Table
export interface LunarGridRowData {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  isExpanded?: boolean;
  dailyAmounts: Record<number, number>;
  transactions: TransactionValidated[];
}

// Definiție de coloană cu informații despre ziua asociată
export type DayColumnDef = ColumnDef<LunarGridRowData> & {
  day: number;
};

// Structura pentru date rând categorie
export interface CategoryRow {
  categoryKey: string;
  isExpanded: boolean;
  subcategories: Array<{
    name: string;
    isCustom: boolean;
  }>;
  // Un obiect pentru sumele zilnice {1: suma, 2: suma, ...}
  dailySums: Record<number, number>;
}

// Structura pentru rând subcategorie
export interface SubcategoryRow {
  subcategoryKey: string;
  categoryKey: string;
  isCustom: boolean;
  // Un obiect pentru sumele zilnice {1: suma, 2: suma, ...}
  dailySums: Record<number, number>;
}

// Popover pentru editare tranzacții
export interface TransactionPopoverState {
  active: boolean;
  day: number;
  category: string;
  subcategory: string;
  anchorRect?: DOMRect;
  initialAmount?: string;
  type: string;
}

// State pentru editare subcategorii
export interface SubcategoryEditState {
  category: string;
  subcategory: string;
  mode: 'edit' | 'delete';
}

// Props pentru hook-ul useLunarGridTable
export interface UseLunarGridTableOptions {
  year: number;
  month: number;
  transactions: TransactionValidated[];
  expandedCategories: Record<string, boolean>;
  formatCurrency: (amount: number) => string;
  getBalanceStyle: (amount: number) => string;
  getTransactionTypeForCategory: (category: string) => TransactionType;
  onToggleCategory: (category: string) => void;
  onCellClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string
  ) => void;
  onCellDoubleClick?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    currentAmount: string
  ) => void;
}

// Rezultatul returnat de hook-ul useLunarGridTable
export interface UseLunarGridTableResult {
  table: any; // Tipul exact va fi din @tanstack/react-table
  days: number[];
  dailyBalances: Record<number, number>;
  getSumForCell: (category: string, subcategory: string, day: number) => number;
}

// Props pentru componenta TanStackSubcategoryRows
export interface TanStackSubcategoryRowsProps {
  categoryKey: string;
  subcategories: Array<{
    name: string;
    isCustom: boolean;
  }>;
  days: number[];
  transactions: TransactionValidated[];
  formatCurrency: (amount: number) => string;
  getBalanceStyle: (amount: number) => string;
  getSumForCell: (category: string, subcategory: string, day: number) => number;
  handleCellClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string
  ) => void;
  handleCellDoubleClick?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    currentAmount: string
  ) => void;
  handleEditSubcategory?: (category: string, subcategory: string, mode?: 'edit' | 'delete') => void;
  handleDeleteSubcategory?: (category: string, subcategory: string) => void;
  isCustomSubcategory: (category: string, subcategory: string) => boolean;
  getTransactionTypeForCategory: (category: string) => TransactionType;
}
