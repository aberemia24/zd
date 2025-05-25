import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CellContext } from './useBaseModalLogic';

// Modal types pentru routing
export type ModalType = 
  | 'quick-add'
  | 'advanced-edit' 
  | 'recurring-setup'
  | 'bulk-operations'
  | 'financial-preview'
  | null;

// Modal state management
export interface ModalState {
  currentModal: ModalType;
  modalProps: any;
  cellContext?: CellContext;
  isLoading: boolean;
  history: ModalType[];
}

// Modal actions
export interface ModalActions {
  openModal: (modal: ModalType, props?: any, cellContext?: CellContext) => void;
  closeModal: () => void;
  switchModal: (modal: ModalType, props?: any) => void;
  goBack: () => void;
  setLoading: (loading: boolean) => void;
}

// Modal Manager Context
export interface ModalManagerContextType {
  state: ModalState;
  actions: ModalActions;
}

// Initial state
const initialState: ModalState = {
  currentModal: null,
  modalProps: null,
  cellContext: undefined,
  isLoading: false,
  history: []
};

// Context creation
const ModalManagerContext = createContext<ModalManagerContextType | null>(null);

// Modal Manager Provider Component
export interface ModalManagerProviderProps {
  children: ReactNode;
  onModalChange?: (modal: ModalType, props?: any) => void;
}

export const ModalManagerProvider: React.FC<ModalManagerProviderProps> = ({
  children,
  onModalChange
}) => {
  const [state, setState] = useState<ModalState>(initialState);

  // Open modal action
  const openModal = useCallback((
    modal: ModalType, 
    props: any = null, 
    cellContext?: CellContext
  ) => {
    setState(prevState => ({
      ...prevState,
      currentModal: modal,
      modalProps: props,
      cellContext: cellContext,
      history: modal ? [...prevState.history, modal] : prevState.history
    }));
    
    if (onModalChange) {
      onModalChange(modal, props);
    }
  }, [onModalChange]);

  // Close modal action
  const closeModal = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      currentModal: null,
      modalProps: null,
      cellContext: undefined,
      isLoading: false
    }));
    
    if (onModalChange) {
      onModalChange(null);
    }
  }, [onModalChange]);

  // Switch modal (pentru navigation între modals)
  const switchModal = useCallback((modal: ModalType, props: any = null) => {
    setState(prevState => ({
      ...prevState,
      currentModal: modal,
      modalProps: props,
      history: modal ? [...prevState.history, modal] : prevState.history
    }));
    
    if (onModalChange) {
      onModalChange(modal, props);
    }
  }, [onModalChange]);

  // Go back to previous modal
  const goBack = useCallback(() => {
    setState(prevState => {
      if (prevState.history.length <= 1) {
        return {
          ...prevState,
          currentModal: null,
          modalProps: null,
          cellContext: undefined,
          history: []
        };
      }
      
      const newHistory = [...prevState.history];
      newHistory.pop(); // Remove current
      const previousModal = newHistory[newHistory.length - 1];
      
      return {
        ...prevState,
        currentModal: previousModal,
        history: newHistory
      };
    });
  }, []);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prevState => ({
      ...prevState,
      isLoading: loading
    }));
  }, []);

  // Actions object
  const actions: ModalActions = {
    openModal,
    closeModal,
    switchModal,
    goBack,
    setLoading
  };

  const contextValue: ModalManagerContextType = {
    state,
    actions
  };

  return (
    <ModalManagerContext.Provider value={contextValue}>
      {children}
    </ModalManagerContext.Provider>
  );
};

// Hook pentru utilizarea contextului
export const useModalManager = (): ModalManagerContextType => {
  const context = useContext(ModalManagerContext);
  
  if (!context) {
    throw new Error('useModalManager must be used within a ModalManagerProvider');
  }
  
  return context;
};

// Specialized hooks pentru specific modal operations
export const useQuickAddModal = () => {
  const { actions } = useModalManager();
  
  return useCallback((cellContext: CellContext, prefillAmount?: string) => {
    actions.openModal('quick-add', { prefillAmount }, cellContext);
  }, [actions]);
};

export const useAdvancedEditModal = () => {
  const { actions } = useModalManager();
  
  return useCallback((cellContext: CellContext, transaction: any) => {
    actions.openModal('advanced-edit', { transaction }, cellContext);
  }, [actions]);
};

export const useRecurringSetupModal = () => {
  const { actions } = useModalManager();
  
  return useCallback((cellContext: CellContext, existingTemplate?: any, prefillAmount?: string) => {
    actions.openModal('recurring-setup', { existingTemplate, prefillAmount }, cellContext);
  }, [actions]);
};

export const useBulkOperationsModal = () => {
  const { actions } = useModalManager();
  
  return useCallback((cellContext: CellContext, operation: any, selectedCells: any[]) => {
    actions.openModal('bulk-operations', { operation, selectedCells }, cellContext);
  }, [actions]);
};

export const useFinancialPreviewModal = () => {
  const { actions } = useModalManager();
  
  return useCallback((cellContext: CellContext, transactions: any[]) => {
    actions.openModal('financial-preview', { transactions }, cellContext);
  }, [actions]);
};

// Modal navigation helpers
export const useModalNavigation = () => {
  const { actions, state } = useModalManager();
  
  return {
    canGoBack: state.history.length > 1,
    goBack: actions.goBack,
    closeAll: actions.closeModal,
    switchTo: actions.switchModal,
    currentModal: state.currentModal,
    modalHistory: state.history
  };
}; 