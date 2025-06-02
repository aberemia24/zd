import React, { useState, useCallback } from "react";
import { QuickAddModal } from "../modals/QuickAddModal";
import CellTransactionPopover from "../CellTransactionPopover";
import { FrequencyType, TransactionType } from "@shared-constants";
import { LUNAR_GRID_ACTIONS } from "@shared-constants/ui";
import {
  useCreateTransactionMonthly,
  useUpdateTransactionMonthly,
  useDeleteTransactionMonthly,
} from '../../../../services/hooks/transactionMutations';
import { useAuthStore } from "../../../../stores/authStore";
import toast from "react-hot-toast";
import { cn } from "../../../../styles/cva/shared/utils";

// Interfață pentru starea popover-ului de tranzacții
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

// Interface pentru modal state
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
  // Poziționare relativă la element
  anchorEl?: HTMLElement;
  position?: { top: number; left: number };
}

// Props interface pentru LunarGridModals
interface LunarGridModalsProps {
  year: number;
  month: number;
  // Props pentru popover
  popover: PopoverState | null;
  setPopover: React.Dispatch<React.SetStateAction<PopoverState | null>>;
  popoverStyle: React.CSSProperties;
  handleSavePopover: (formData: {
    amount: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  
  // Props pentru Quick Add Modal
  onOpenModal?: (
    category: string,
    subcategory: string | undefined,
    day: number,
    mode: 'add' | 'edit',
    anchorElement?: HTMLElement,
    currentValue?: string | number,
    transactionId?: string | null,
  ) => void;

  // Props pentru exposing modal state către parent
  modalState?: ModalState | null;
  highlightedCell?: {
    category: string;
    subcategory: string | undefined;
    day: number;
  } | null;
  onModalStateChange?: (modalState: ModalState | null) => void;
  onHighlightedCellChange?: (highlightedCell: {
    category: string;
    subcategory: string | undefined;
    day: number;
  } | null) => void;
}

const LunarGridModals: React.FC<LunarGridModalsProps> = ({
  year,
  month,
  popover,
  setPopover,
  popoverStyle,
  handleSavePopover,
  onOpenModal,
  modalState,
  highlightedCell,
  onModalStateChange,
  onHighlightedCellChange,
}) => {
  // Import userId din auth store
  const { user } = useAuthStore();

  // Hooks pentru mutații de tranzacții
  const createTransactionMutation = useCreateTransactionMonthly(year, month, user?.id);
  const updateTransactionMutation = useUpdateTransactionMonthly(year, month, user?.id);
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

  // Handler pentru deschiderea modal-ului (expus către componenta părinte)
  const handleOpenModal = useCallback(
    (
      category: string,
      subcategory: string | undefined,
      day: number,
      mode: 'add' | 'edit',
      anchorElement?: HTMLElement,
      currentValue?: string | number,
      transactionId?: string | null,
    ) => {
      let position: { top: number; left: number } | undefined;

      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        const modalWidth = 320;
        const modalHeight = 400;
        
        let left = rect.left + rect.width / 2 - modalWidth / 2;
        let top = rect.bottom + scrollY + 8;
        
        // Verifică dacă modal-ul iese din viewport pe orizontală
        if (left < 16) {
          left = 16;
        } else if (left + modalWidth > window.innerWidth - 16) {
          left = window.innerWidth - modalWidth - 16;
        }
        
        // Verifică dacă modal-ul iese din viewport pe verticală
        if (top + modalHeight > scrollY + viewportHeight - 16) {
          // Încearcă să-l plaseze deasupra
          top = rect.top + scrollY - modalHeight - 8;
          
          // Dacă tot nu încape, plasează-l în centrul viewport-ului
          if (top < scrollY + 16) {
            top = scrollY + (viewportHeight - modalHeight) / 2;
          }
        }
        
        position = { top, left };
      }
      
      onModalStateChange?.({
        isOpen: true,
        mode,
        category,
        subcategory,
        day,
        year,
        month,
        existingValue: currentValue,
        transactionId,
        anchorEl: anchorElement,
        position,
      });

      // Setează highlight-ul pentru celula în editare
      onHighlightedCellChange?.({
        category,
        subcategory,
        day,
      });
    },
    [year, month, onModalStateChange, onHighlightedCellChange],
  );

  // Expune handler-ul către componenta părinte prin imperativă ref sau callback
  React.useEffect(() => {
    if (onOpenModal) {
      // Store the handler function in a way the parent can access it
      // This pattern will be refined when integrating with the main component
    }
  }, [onOpenModal, handleOpenModal]);

  // Handler pentru salvarea din modal
  const handleSaveModal = useCallback(
    async (data: {
      amount: string;
      description: string;
      recurring: boolean;
      frequency?: FrequencyType;
    }) => {
      if (!modalState) return;

      const { category, subcategory, day, transactionId, mode } = modalState;
      const numValue = parseFloat(data.amount);
      
      if (isNaN(numValue)) {
        throw new Error("Valoare invalidă");
      }

      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (mode === 'edit' && transactionId) {
        // UPDATE: Modifică tranzacția existentă
        await updateTransactionMutation.mutateAsync({
          id: transactionId,
          transactionData: {
            amount: numValue,
            date,
            category,
            subcategory: subcategory || undefined,
            type: TransactionType.EXPENSE,
            description: data.description,
          }
        });
      } else {
        // CREATE: Creează o tranzacție nouă  
        await createTransactionMutation.mutateAsync({
          amount: numValue,
          date,
          category,
          subcategory: subcategory || undefined,
          type: TransactionType.EXPENSE,
          description: data.description || `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
        });
      }

      // Închide modal-ul după salvare
      onModalStateChange?.(null);
      onHighlightedCellChange?.(null);
    },
    [modalState, year, month, updateTransactionMutation, createTransactionMutation, onModalStateChange, onHighlightedCellChange],
  );

  // Handler pentru închiderea modal-ului
  const handleCloseModal = useCallback(() => {
    onModalStateChange?.(null);
    onHighlightedCellChange?.(null);
  }, [onModalStateChange, onHighlightedCellChange]);

  // Handler pentru delete transaction din modal
  const handleDeleteFromModal = useCallback(
    async () => {
      if (!modalState || !modalState.transactionId) return;

      try {
        await deleteTransactionMutation.mutateAsync(modalState.transactionId);
        // Închide modal-ul după delete
        onModalStateChange?.(null);
        onHighlightedCellChange?.(null);
        toast.success(LUNAR_GRID_ACTIONS.DELETE_SUCCESS_SINGLE);
      } catch (error) {
        console.error("Eroare la ștergerea tranzacției:", error);
        toast.error("Eroare la ștergerea tranzacției. Încercați din nou.");
      }
    },
    [modalState, deleteTransactionMutation, onModalStateChange, onHighlightedCellChange],
  );

  return (
    <>
      {/* Popover pentru editare tranzacție */}
      {popover && (
        <div 
          className={cn(
            "fixed z-50 shadow-lg rounded-lg",
            "animate-fadeIn transition-all duration-150"
          )}
          style={popoverStyle}
          data-testid="transaction-popover"
        >
          <CellTransactionPopover
            initialAmount={popover.amount || ""}
            day={popover.day}
            month={month}
            year={year}
            category={popover.category}
            subcategory={popover.subcategory || ""}
            type={popover.type}
            onSave={handleSavePopover}
            onCancel={() => setPopover(null)}
          />
        </div>
      )}

      {/* QuickAddModal pentru single click */}
      {modalState && (
        <QuickAddModal
          cellContext={{
            category: modalState.category,
            subcategory: modalState.subcategory,
            day: modalState.day,
            month: modalState.month,
            year: modalState.year,
          }}
          prefillAmount={modalState.existingValue ? String(modalState.existingValue) : ""}
          mode={modalState.mode}
          position={modalState.position}
          onSave={handleSaveModal}
          onCancel={handleCloseModal}
          onDelete={modalState.mode === 'edit' ? handleDeleteFromModal : undefined}
        />
      )}
    </>
  );
};

export default LunarGridModals;

// Export hook pentru access la modal state din componenta principală
export const useLunarGridModals = (year: number, month: number) => {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<{
    category: string;
    subcategory: string | undefined;
    day: number;
  } | null>(null);

  const openModal = useCallback(
    (
      category: string,
      subcategory: string | undefined,
      day: number,
      mode: 'add' | 'edit',
      anchorElement?: HTMLElement,
      currentValue?: string | number,
      transactionId?: string | null,
    ) => {
      let position: { top: number; left: number } | undefined;

      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        const modalWidth = 320;
        const modalHeight = 400;
        
        let left = rect.left + rect.width / 2 - modalWidth / 2;
        let top = rect.bottom + scrollY + 8;
        
        // Verifică dacă modal-ul iese din viewport pe orizontală
        if (left < 16) {
          left = 16;
        } else if (left + modalWidth > window.innerWidth - 16) {
          left = window.innerWidth - modalWidth - 16;
        }
        
        // Verifică dacă modal-ul iese din viewport pe verticală
        if (top + modalHeight > scrollY + viewportHeight - 16) {
          // Încearcă să-l plaseze deasupra
          top = rect.top + scrollY - modalHeight - 8;
          
          // Dacă tot nu încape, plasează-l în centrul viewport-ului
          if (top < scrollY + 16) {
            top = scrollY + (viewportHeight - modalHeight) / 2;
          }
        }
        
        position = { top, left };
      }
      
      setModalState({
        isOpen: true,
        mode,
        category,
        subcategory,
        day,
        year,
        month,
        existingValue: currentValue,
        transactionId,
        anchorEl: anchorElement,
        position,
      });

      setHighlightedCell({
        category,
        subcategory,
        day,
      });
    },
    [year, month],
  );

  const closeModal = useCallback(() => {
    setModalState(null);
    setHighlightedCell(null);
  }, []);

  const isModalOpen = Boolean(modalState?.isOpen);

  return {
    modalState,
    highlightedCell,
    openModal,
    closeModal,
    isModalOpen,
  };
}; 