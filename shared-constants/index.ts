// index barrel pentru shared-constants
export { TransactionType, CategoryType, FrequencyType, AccountType, BalanceImpactType } from './enums';
export * from './messages';
export { MESAJE, LUNAR_GRID_MESSAGES, EXPORT_MESSAGES, URL_PERSISTENCE } from './messages';
export { 
  LABELS, TITLES, PLACEHOLDERS, BUTTONS, TABLE, LOADER, EXCEL_GRID, OPTIONS, UI, FLAGS, INFO, LUNAR_GRID, TEST_CONSTANTS,
  // 🆕 Balance System Constants 
  ACCOUNT_MANAGEMENT, BALANCE_DISPLAY, BALANCE_MODALS, BALANCE_LABELS,
  // 🚀 Phase 2 Template Systems
  LOADING_MESSAGES, EMPTY_STATE_MESSAGES, DESIGN_TOKENS,
  LUNAR_GRID_ACTIONS,
  // 🎨 Supporting UI Components - Task 8.5
  TOOLTIP, PROGRESS, BADGE, EXPORT_UI,
  // 🍞 Toast Notifications - Task 9.1
  TOAST,
  // 🧭 Navigation System - Task 10.1
  NAVIGATION
} from './ui';
export * from './transaction.schema';
export * from './defaults';
export * from './enums';
export * from './categories';
export { getCategoriesForTransactionType } from './category-mapping';
export * from './queryParams';
export * from './validation';
export * from './api';
