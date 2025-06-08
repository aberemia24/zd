import React, { CSSProperties } from 'react';

// Constants și shared
import { FrequencyType, TransactionType } from "@budget-app/shared-constants";
import { TransactionValidated } from '@budget-app/shared-constants/transaction.schema';

// Componente
import LunarGridModals from "./LunarGridModals";
import DeleteSubcategoryModal from "./DeleteSubcategoryModal";

// Types pentru modal și popover state - aliniați cu componentele existente
export interface PopoverState {
  isOpen: boolean;
  category: string;
  subcategory: string | undefined;
  day: number;
  amount: string;
  type: TransactionType;
  element: HTMLElement | null;
  anchorEl?: HTMLElement;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  category: string;
  subcategory: string | undefined;
  day: number;
  year: number;
  month: number;
  existingValue?: string | number;
  transactionId?: string | null;
  anchorEl?: HTMLElement;
  position?: { top: number; left: number };
}

export interface SubcategoryAction {
  type: 'edit' | 'delete';
  category: string;
  subcategory: string;
}

export interface LunarGridModalManagerProps {
  // Popover state și handlers
  popover: PopoverState | null;
  popoverStyle: CSSProperties;
  onSavePopover: (formData: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancelPopover: () => void;
  
  // Modal state și handlers
  modalState: ModalState | null;
  onSaveModal: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancelModal: () => void;
  onDeleteFromModal: () => Promise<void>;
  
  // Subcategory action state și handlers
  subcategoryAction: SubcategoryAction | null;
  validTransactions: (TransactionValidated & { userId?: string })[];
  onConfirmSubcategoryAction: () => void;
  onCancelSubcategoryAction: () => void;
  
  // Year și month pentru modal context
  year: number;
  month: number;
}

const LunarGridModalManager: React.FC<LunarGridModalManagerProps> = ({
  popover,
  popoverStyle,
  onSavePopover,
  onCancelPopover,
  modalState,
  onSaveModal,
  onCancelModal,
  onDeleteFromModal,
  subcategoryAction,
  validTransactions,
  onConfirmSubcategoryAction,
  onCancelSubcategoryAction,
  year,
  month
}) => {
  return (
    <>
      {/* Toate modal-urile și popover-urile consolidate */}
      <LunarGridModals
        popover={popover}
        popoverStyle={popoverStyle}
        year={year}
        month={month}
        onSavePopover={onSavePopover}
        onCancelPopover={onCancelPopover}
        modalState={modalState}
        onSaveModal={onSaveModal}
        onCancelModal={onCancelModal}
        onDeleteFromModal={onDeleteFromModal}
      />

      {/* DeleteSubcategoryModal pentru delete subcategory */}
      <DeleteSubcategoryModal
        subcategoryAction={subcategoryAction}
        validTransactions={validTransactions}
        onConfirm={onConfirmSubcategoryAction}
        onCancel={onCancelSubcategoryAction}
      />
    </>
  );
};

// Add display name for debugging
LunarGridModalManager.displayName = 'LunarGridModalManager';

export default LunarGridModalManager; 