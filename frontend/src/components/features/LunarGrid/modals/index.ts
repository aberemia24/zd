/**
 * LunarGrid Modals - Enhanced Modal Architecture
 * 
 * PHASE 2: Enhanced Modal System Implementation
 * Modular modal components pentru transaction management
 */

// Enhanced Modal Architecture Exports
export { QuickAddModal } from './QuickAddModal';
export type { QuickAddModalProps } from './QuickAddModal';

export { AdvancedEditModal } from './AdvancedEditModal';
export type { 
  AdvancedEditModalProps,
  Transaction,
  TransactionHistoryEntry 
} from './AdvancedEditModal';

export { RecurringSetupModal } from './RecurringSetupModal';
export type { 
  RecurringSetupModalProps,
  RecurringTemplate,
  GeneratedTransaction 
} from './RecurringSetupModal';

export { BulkOperationsModal } from './BulkOperationsModal';
export type { 
  BulkOperationsModalProps,
  BulkOperationType,
  BulkOperationData,
  CellSelection,
  OperationProgress 
} from './BulkOperationsModal';

export { FinancialPreviewModal } from './FinancialPreviewModal';
export type { 
  FinancialPreviewModalProps,
  FinancialAnalysis,
  CategoryBreakdown,
  MonthlyTrendData,
  ProjectedImpact,
  FinancialTransaction 
} from './FinancialPreviewModal';

// Base Modal Logic Hooks
export { useBaseModalLogic } from './hooks/useBaseModalLogic';
export type { CellContext } from './hooks/useBaseModalLogic';

// Modal Management System
export { 
  ModalManagerProvider, 
  useModalManager,
  useQuickAddModal,
  useAdvancedEditModal,
  useRecurringSetupModal,
  useBulkOperationsModal,
  useFinancialPreviewModal,
  useModalNavigation
} from './hooks/useModalManager';
export type { 
  ModalType,
  ModalState,
  ModalActions,
  ModalManagerContextType,
  ModalManagerProviderProps 
} from './hooks/useModalManager';

// Modal Router System
export { ModalRouter, useModalRouter } from './ModalRouter';
export type { ModalRouterProps } from './ModalRouter'; 