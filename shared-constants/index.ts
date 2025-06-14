// index barrel pentru shared-constants
export * from './api';
export * from './categories';
export { getCategoriesForTransactionType } from './category-mapping';
export * from './defaults';
export * from './enums';
export { AccountType, BalanceImpactType, CategoryType, FrequencyType, TransactionType } from './enums';
export * from './export';
export * from './messages';
export { EXPORT_MESSAGES, LUNAR_GRID_MESSAGES, MESAJE, URL_PERSISTENCE } from './messages';
export * from './queryParams';
export * from './transaction.schema';
export * from './types';
export {
    // 🆕 Balance System Constants
    ACCOUNT_MANAGEMENT, BADGE, BALANCE_DISPLAY, BALANCE_LABELS, BALANCE_MODALS, BUTTONS, DESIGN_TOKENS, EMPTY_STATE_MESSAGES, EXCEL_GRID, EXPORT_UI, FLAGS, INFO, LABELS, LOADER,
    // 🚀 Phase 2 Template Systems
    LOADING_MESSAGES, LUNAR_GRID, LUNAR_GRID_ACTIONS,
    // 🧭 Navigation System - Task 10.1
    NAVIGATION, OPTIONS, PLACEHOLDERS,
    // 🎯 Popover System - Task 12.2
    POPOVER_CONSTANTS, PROGRESS, TABLE, TEST_CONSTANTS, TITLES,
    // 🍞 Toast Notifications - Task 9.1
    TOAST,
    // 🎨 Supporting UI Components - Task 8.5
    TOOLTIP, UI
} from './ui';
export * from './validation';

