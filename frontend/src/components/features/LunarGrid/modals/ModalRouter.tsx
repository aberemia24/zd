import React, { Suspense, lazy, useCallback } from 'react';
import Spinner from '../../../primitives/Spinner/Spinner';
import { useModalManager, ModalType } from './hooks/useModalManager';

// Lazy loaded modal components pentru optimizare bundle
const QuickAddModal = lazy(() => import('./QuickAddModal').then(module => ({ default: module.QuickAddModal })));
const AdvancedEditModal = lazy(() => import('./AdvancedEditModal').then(module => ({ default: module.AdvancedEditModal })));
const RecurringSetupModal = lazy(() => import('./RecurringSetupModal').then(module => ({ default: module.RecurringSetupModal })));
const BulkOperationsModal = lazy(() => import('./BulkOperationsModal').then(module => ({ default: module.BulkOperationsModal })));
const FinancialPreviewModal = lazy(() => import('./FinancialPreviewModal').then(module => ({ default: module.FinancialPreviewModal })));

// Loading fallback component
const ModalLoadingFallback: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex items-center space-x-3">
        <Spinner size="md" />
        <span className="text-slate-700 font-medium">Se încarcă...</span>
      </div>
    </div>
  </div>
);

// Modal Router Props
export interface ModalRouterProps {
  // Transaction handlers
  onQuickAdd?: (data: any) => Promise<void>;
  onAdvancedEdit?: (data: any) => Promise<void>;
  onRecurringSetup?: (data: any) => Promise<void>;
  onBulkOperations?: (data: any) => Promise<void>;
  onFinancialExport?: (format: 'csv' | 'pdf' | 'json') => Promise<void>;
  
  // Transaction delete handler
  onTransactionDelete?: (transactionId: string) => Promise<void>;
  
  // Additional props pentru specific modals
  transactions?: any[];
  existingTransaction?: any;
  selectedCells?: any[];
}

// Modal Router Component
export const ModalRouter: React.FC<ModalRouterProps> = ({
  onQuickAdd,
  onAdvancedEdit,
  onRecurringSetup,
  onBulkOperations,
  onFinancialExport,
  onTransactionDelete,
  transactions = [],
  existingTransaction,
  selectedCells = []
}) => {
  const { state, actions } = useModalManager();
  
  // Generic close handler
  const handleClose = useCallback(() => {
    actions.closeModal();
  }, [actions]);

  // Quick Add Modal Handler
  const handleQuickAdd = useCallback(async (data: any) => {
    if (onQuickAdd) {
      actions.setLoading(true);
      try {
        await onQuickAdd(data);
        actions.closeModal();
      } catch (error) {
        console.error('Quick add failed:', error);
        // Error handling este gestionat în modal
      } finally {
        actions.setLoading(false);
      }
    }
  }, [onQuickAdd, actions]);

  // Advanced Edit Modal Handler
  const handleAdvancedEdit = useCallback(async (data: any) => {
    if (onAdvancedEdit) {
      actions.setLoading(true);
      try {
        await onAdvancedEdit(data);
        actions.closeModal();
      } catch (error) {
        console.error('Advanced edit failed:', error);
      } finally {
        actions.setLoading(false);
      }
    }
  }, [onAdvancedEdit, actions]);

  // Recurring Setup Modal Handler  
  const handleRecurringSetup = useCallback(async (data: any) => {
    if (onRecurringSetup) {
      actions.setLoading(true);
      try {
        await onRecurringSetup(data);
        actions.closeModal();
      } catch (error) {
        console.error('Recurring setup failed:', error);
      } finally {
        actions.setLoading(false);
      }
    }
  }, [onRecurringSetup, actions]);

  // Bulk Operations Modal Handler
  const handleBulkOperations = useCallback(async (data: any) => {
    if (onBulkOperations) {
      actions.setLoading(true);
      try {
        await onBulkOperations(data);
        actions.closeModal();
      } catch (error) {
        console.error('Bulk operations failed:', error);
      } finally {
        actions.setLoading(false);
      }
    }
  }, [onBulkOperations, actions]);

  // Transaction Delete Handler
  const handleTransactionDelete = useCallback(async (transactionId: string) => {
    if (onTransactionDelete) {
      actions.setLoading(true);
      try {
        await onTransactionDelete(transactionId);
        actions.closeModal();
      } catch (error) {
        console.error('Transaction delete failed:', error);
      } finally {
        actions.setLoading(false);
      }
    }
  }, [onTransactionDelete, actions]);

  // Financial Export Handler
  const handleFinancialExport = useCallback(async (format: 'csv' | 'pdf' | 'json') => {
    if (onFinancialExport) {
      try {
        await onFinancialExport(format);
      } catch (error) {
        console.error('Financial export failed:', error);
      }
    }
  }, [onFinancialExport]);

  // Render modal based pe currentModal
  const renderModal = (): React.ReactNode => {
    if (!state.currentModal || !state.cellContext) {
      return null;
    }

    const { currentModal, modalProps, cellContext } = state;

    switch (currentModal) {
      case 'quick-add':
        return (
          <QuickAddModal
            cellContext={cellContext}
            prefillAmount={modalProps?.prefillAmount}
            onSave={handleQuickAdd}
            onCancel={handleClose}
          />
        );

      case 'advanced-edit':
        return (
          <AdvancedEditModal
            cellContext={cellContext}
            transaction={modalProps?.transaction || existingTransaction}
            onSave={handleAdvancedEdit}
            onDelete={onTransactionDelete ? handleTransactionDelete : undefined}
            onCancel={handleClose}
          />
        );

      case 'recurring-setup':
        return (
          <RecurringSetupModal
            cellContext={cellContext}
            existingTemplate={modalProps?.existingTemplate}
            prefillAmount={modalProps?.prefillAmount}
            onSave={handleRecurringSetup}
            onCancel={handleClose}
          />
        );

      case 'bulk-operations':
        return (
          <BulkOperationsModal
            cellContext={cellContext}
            operation={modalProps?.operation}
            selectedCells={modalProps?.selectedCells || selectedCells}
            onSave={handleBulkOperations}
            onCancel={handleClose}
          />
        );

      case 'financial-preview':
        return (
          <FinancialPreviewModal
            cellContext={cellContext}
            transactions={modalProps?.transactions || transactions}
            onExport={onFinancialExport ? handleFinancialExport : undefined}
            onClose={handleClose}
          />
        );

      default:
        return null;
    }
  };

  // Nu renderez nimic dacă nu e modal activ
  if (!state.currentModal) {
    return null;
  }

  return (
    <Suspense fallback={<ModalLoadingFallback />}>
      {renderModal()}
    </Suspense>
  );
};

// Hook pentru utilizare facilitată a ModalRouter
export const useModalRouter = () => {
  const { state, actions } = useModalManager();
  
  return {
    // State access
    isModalOpen: !!state.currentModal,
    currentModal: state.currentModal,
    isLoading: state.isLoading,
    
    // Quick access methods
    openQuickAdd: (cellContext: any, prefillAmount?: string) => 
      actions.openModal('quick-add', { prefillAmount }, cellContext),
    
    openAdvancedEdit: (cellContext: any, transaction: any) => 
      actions.openModal('advanced-edit', { transaction }, cellContext),
    
    openRecurringSetup: (cellContext: any, existingTemplate?: any, prefillAmount?: string) => 
      actions.openModal('recurring-setup', { existingTemplate, prefillAmount }, cellContext),
    
    openBulkOperations: (cellContext: any, operation: any, selectedCells: any[]) => 
      actions.openModal('bulk-operations', { operation, selectedCells }, cellContext),
    
    openFinancialPreview: (cellContext: any, transactions: any[]) => 
      actions.openModal('financial-preview', { transactions }, cellContext),
    
    // Navigation
    closeModal: actions.closeModal,
    switchModal: actions.switchModal,
    goBack: actions.goBack
  };
}; 