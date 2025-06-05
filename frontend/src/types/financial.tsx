/**
 * 💰 FINANCIAL DATA TYPES - Task 8.2
 * Tipuri TypeScript pentru datele financiare optimizate pentru desktop-first Budget App
 */

import { TransactionType, FrequencyType } from '@shared-constants';

// =============================================================================
// CORE FINANCIAL TYPES
// =============================================================================

export interface FinancialTransaction {
  id: string;
  amount: number;
  currency: string;
  type: TransactionType;
  category: string;
  subcategory?: string;
  description?: string;
  date: Date;
  recurring: boolean;
  frequency?: FrequencyType;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  averageTransaction: number;
  transactionCount: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface RunningBalance {
  date: Date;
  balance: number;
  dailyChange: number;
  transactionId: string;
}

// =============================================================================
// TABLE-SPECIFIC TYPES
// =============================================================================

export interface FinancialTableRow extends FinancialTransaction {
  runningBalance?: number;
  formattedAmount: string;
  formattedDate: string;
  typeDisplay: string;
  categoryPath: string; // "category > subcategory"
}

export interface TableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  hideable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
  sticky?: boolean;
}

// =============================================================================
// PAGINATION & FILTERING TYPES
// =============================================================================

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SortingState {
  columnId: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  categories: string[];
  subcategories: string[];
  types: TransactionType[];
  amountRange: {
    min: number | null;
    max: number | null;
  };
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface SearchState {
  query: string;
  caseSensitive: boolean;
  useRegex: boolean;
  searchFields: Array<keyof FinancialTransaction>;
}

export interface QuickFilterPeriod {
  key: string;
  label: string;
  days: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState[];
  sorting: SortingState[];
  searchState?: SearchState;
  created_at: Date;
}

// =============================================================================
// SELECTION & BULK OPERATIONS
// =============================================================================

export interface SelectionState {
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isPageSelected: boolean;
}

export type BulkOperation = 
  | 'delete'
  | 'export'
  | 'changeCategory'
  | 'changeType'
  | 'duplicate'
  | 'markRecurring';

export interface BulkOperationPayload {
  operation: BulkOperation;
  selectedIds: string[];
  params?: Record<string, unknown>;
}

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type ExportFormat = 'csv' | 'pdf' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  includeHeaders: boolean;
  includeFiltered: boolean;
  includeSelected: boolean;
  columns: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// =============================================================================
// CURRENCY & FORMATTING
// =============================================================================

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export const RON_CURRENCY: CurrencyConfig = {
  code: 'RON',
  symbol: 'lei',
  locale: 'ro-RO',
  decimalPlaces: 2,
  thousandsSeparator: '.',
  decimalSeparator: ',',
};

// =============================================================================
// CONTEXT MENU TYPES
// =============================================================================

export interface ContextMenuOption {
  id: string;
  label: string;
  icon?: React.ComponentType;
  shortcut?: string;
  separator?: boolean;
  disabled?: boolean;
  onClick: (rowData: FinancialTableRow) => void;
}

export interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  targetRow?: FinancialTableRow;
}

// =============================================================================
// KEYBOARD NAVIGATION
// =============================================================================

export interface CellPosition {
  rowIndex: number;
  columnIndex: number;
}

export interface KeyboardNavigationState {
  focusedCell: CellPosition | null;
  editingCell: CellPosition | null;
  selectionMode: 'single' | 'multi' | 'range';
}

// =============================================================================
// TABLE CONFIGURATION
// =============================================================================

export interface TableConfiguration {
  columns: TableColumn<FinancialTableRow>[];
  defaultSorting: SortingState[];
  defaultPageSize: number;
  enableVirtualization: boolean;
  enableStickyHeader: boolean;
  enableRunningBalance: boolean;
  enableContextMenu: boolean;
  enableKeyboardNavigation: boolean;
  enableBulkOperations: boolean;
  enableColumnReordering: boolean;
  enableColumnResizing: boolean;
  enableColumnHiding: boolean;
  compactMode: boolean;
  showSummaryFooter: boolean;
}

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

export interface TablePerformanceMetrics {
  renderTime: number;
  dataProcessingTime: number;
  totalRows: number;
  visibleRows: number;
  memoryUsage?: number;
}

export interface VirtualizationConfig {
  enabled: boolean;
  rowHeight: number;
  overscan: number;
  estimatedRowHeight?: number;
}

// =============================================================================
// CARD COMPONENT TYPES
// =============================================================================

export interface FinancialCardData {
  id: string;
  title: string;
  value: number | string;
  description?: string;
  type: 'amount' | 'percentage' | 'count' | 'text';
  variant?: 'default' | 'success' | 'warning' | 'error';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
    label: string;
  };
  icon?: string;
  onClick?: () => void;
}

export interface FinancialSummaryCard {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
  period: {
    start: Date;
    end: Date;
  };
}

// =============================================================================
// LIST COMPONENT TYPES
// =============================================================================

export interface FinancialListItem {
  id: string;
  title: string;
  subtitle?: string;
  amount?: number;
  description?: string;
  date?: Date;
  type?: TransactionType;
  category?: string;
  subcategory?: string;
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
  actions?: {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
  };
}

export interface CategoryListItem {
  id: string;
  name: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
  subcategories?: {
    id: string;
    name: string;
    amount: number;
    count: number;
  }[];
}

// =============================================================================
// DASHBOARD WIDGETS TYPES
// =============================================================================

export interface BudgetProgress {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'on-track' | 'warning' | 'over-budget';
}

export interface MonthlyOverview {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetGoals: BudgetProgress[];
  topCategories: CategoryListItem[];
} 