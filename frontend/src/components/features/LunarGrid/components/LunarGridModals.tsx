import React, { CSSProperties } from 'react';
import CellTransactionPopover from "../CellTransactionPopover";
import { QuickAddModal } from "../modals/QuickAddModal";
import { FrequencyType, TransactionType } from "@shared-constants";
import { cn } from "../../../../styles/cva/shared/utils";

interface PopoverState {
  isOpen: boolean;
  category: string;
  subcategory: string | undefined;
  day: number;
  amount: string;
  type: TransactionType;
  element: HTMLElement | null;
  anchorEl?: HTMLElement;
}

interface ModalState {
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

interface LunarGridModalsProps {
  // Popover props
  popover: PopoverState | null;
  popoverStyle: CSSProperties;
  year: number;
  month: number;
  onSavePopover: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancelPopover: () => void;
  
  // Modal props
  modalState: ModalState | null;
  onSaveModal: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancelModal: () => void;
  onDeleteFromModal?: () => Promise<void>;
}

const LunarGridModals: React.FC<LunarGridModalsProps> = (props) => {
  return (
    <>
      {/* Popover pentru editare tranzacție */}
      {props.popover && (
        <div 
          className={cn(
            "fixed z-50 shadow-lg rounded-lg",
            "animate-fadeIn transition-all duration-150"
          )}
          style={props.popoverStyle}
          data-testid="transaction-popover"
        >
          <CellTransactionPopover
            initialAmount={props.popover.amount || ""}
            day={props.popover.day}
            month={props.month}
            year={props.year}
            category={props.popover.category}
            subcategory={props.popover.subcategory || ""}
            type={props.popover.type}
            onSave={props.onSavePopover}
            onCancel={props.onCancelPopover}
          />
        </div>
      )}

      {/* LGI TASK 5: QuickAddModal pentru single click */}
      {props.modalState && (
        <QuickAddModal
          cellContext={{
            category: props.modalState.category,
            subcategory: props.modalState.subcategory,
            day: props.modalState.day,
            month: props.month,
            year: props.year,
          }}
          prefillAmount={props.modalState.existingValue ? String(props.modalState.existingValue) : ""}
          mode={props.modalState.mode}
          position={props.modalState.position}
          onSave={props.onSaveModal}
          onCancel={props.onCancelModal}
          onDelete={props.modalState.mode === 'edit' ? props.onDeleteFromModal : undefined}
        />
      )}
    </>
  );
};

export default LunarGridModals; 