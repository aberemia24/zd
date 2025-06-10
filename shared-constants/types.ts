/**
 * 🎯 SHARED TYPE DEFINITIONS - Centralized Type Consolidation
 * 
 * Consolidates duplicate type definitions from multiple files:
 * - Export-related types (ExportOptions, ExportState, etc.)
 * - Transaction-related types (TransactionData, TransactionState, etc.)
 * - Common utility types (FilterOptions, PaginationParams, etc.)
 * 
 * This eliminates duplications and ensures type consistency across modules.
 */

import { TransactionType, FrequencyType } from './enums';

// =============================================================================
// TRANSACTION CORE TYPES
// =============================================================================

/**
 * Core Transaction interface - shared across all modules
 * Replaces multiple scattered Transaction type definitions
 */
export interface Transaction {
  // Identificatori
  id: string;
  _id?: string; // Pentru compatibilitate cu MongoDB
  userId: string;

  // Date de bază
  type: TransactionType;
  date: string | Date;

  // Valori numerice
  amount: number | string; // Suportă atât number (de la API) cât și string (pentru forms)
  actualAmount?: number; // Pentru tranzacții cu sumă efectivă diferită de cea planificată

  // Clasificare
  category: string;
  subcategory: string;

  // Opțiuni recurente
  recurring?: boolean;
  frequency?: FrequencyType;

  // Metadate și extensii
  status?: string;
  description?: string;
  currency?: string; // Opțional (ex: 'RON', 'EUR', 'USD')

  // Timestamp-uri
  createdAt?: string | Date;
  updatedAt?: string | Date;
  created_at?: string; // Pentru compatibilitate cu API legacy
  updated_at?: string; // Pentru compatibilitate cu API legacy
}

/**
 * Transaction data for forms and modals
 * Consolidates TransactionData definitions from LunarGrid modals and e2e tests
 */
export interface TransactionFormData {
  id?: string;
  amount: number;
  type: TransactionType;
  description: string;
  isRecurring: boolean;
  frequency?: FrequencyType;
  category: string;
  subcategory?: string;
  date: string;
}

/**
 * Transaction filters interface
 * Consolidates filter-related types from multiple stores and components
 */
export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  subcategory?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  recurring?: boolean;
  frequency?: FrequencyType;
}

/**
 * Pagination parameters
 * Consolidates pagination types from services and hooks
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Transaction query parameters
 * Consolidates query param types from services and API calls
 */
export interface TransactionQueryParams extends TransactionFilters, PaginationParams {
  userId?: string;
  month?: number;
  year?: number;
}

// =============================================================================
// EXPORT TYPES (Unified)
// =============================================================================

/**
 * Unified export options interface
 * Consolidates ExportOptions definitions from multiple files:
 * - shared/utils/exportUtils.ts
 * - hooks/useExport.tsx
 * - types/charts.tsx (ChartExportOptions)
 */
export interface UnifiedExportOptions {
  /** Output filename (without extension) */
  filename?: string;
  /** Export title/header */
  title?: string;
  /** Progress callback */
  onProgress?: (progress: number) => void;
  /** Include column headers */
  includeHeaders?: boolean;
  /** Date range filter */
  dateRange?: { from: string; to: string };
  /** Custom formatting options */
  formatting?: {
    dateFormat?: string;
    currencyFormat?: string;
    numberFormat?: string;
  };
  /** Quality settings for image exports */
  quality?: number;
}

/**
 * Export state interface
 * Consolidates export state definitions from hooks and components
 */
export interface ExportState {
  isExporting: boolean;
  progress: number;
  error: string | null;
  status?: string;
}

// =============================================================================
// FINANCIAL & CALCULATION TYPES
// =============================================================================

/**
 * Financial summary interface
 * Consolidates financial calculation types
 */
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  averageTransaction: number;
  periodStart: string;
  periodEnd: string;
}

/**
 * Running balance calculation
 * For transaction lists with balance tracking
 */
export interface RunningBalance {
  transactionId: string;
  balance: number;
  date: string;
  amount: number;
  type: TransactionType;
}

/**
 * Transaction breakdown for analytics
 * Consolidates breakdown types from LunarGrid and charts
 */
export interface TransactionBreakdown {
  category: string;
  subcategory?: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  averageAmount: number;
  trend?: 'up' | 'down' | 'stable';
}

// =============================================================================
// STORE STATE TYPES
// =============================================================================

/**
 * Base store state interface
 * Common properties for all Zustand stores
 */
export interface BaseStoreState {
  loading: boolean;
  error: string | null;
  lastUpdated?: string;
}

/**
 * Transaction store state
 * Consolidates state types from transaction-related stores
 */
export interface TransactionStoreState extends BaseStoreState {
  transactions: Transaction[];
  selectedTransactions: string[];
  filters: TransactionFilters;
  pagination: PaginationParams;
  totalCount: number;
}

/**
 * Form store state
 * Common interface for form-related stores
 */
export interface FormStoreState extends BaseStoreState {
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

// =============================================================================
// UI & COMPONENT TYPES
// =============================================================================

/**
 * Component size variants
 * Standardized size system across components
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Component variant types
 * Standardized variant system
 */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Loading state types
 * Standardized loading states across components
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Modal state interface
 * Common interface for modal components
 */
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

// =============================================================================
// VALIDATION & ERROR TYPES
// =============================================================================

/**
 * Validation result interface
 * Standardized validation across forms and inputs
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * API response interface
 * Standardized API response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Error details interface
 * Enhanced error information
 */
export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  stack?: string;
}

// =============================================================================
// LEGACY TYPE ALIASES (for backwards compatibility)
// =============================================================================

/**
 * @deprecated Use UnifiedExportOptions instead
 */
export type ExportOptions = UnifiedExportOptions;

/**
 * @deprecated Use TransactionFormData instead
 */
export type TransactionData = TransactionFormData; 