import { useState, useCallback, useMemo } from 'react';

// Types imports
import { type PopoverState, type ModalState } from "./useLunarGridTransactionHandlers";

// Hook pentru management al tuturor state-urilor de modal în LunarGrid
export const useLunarGridModalState = () => {
  // State pentru popover (păstrat doar pentru modal advanced)
  const [popover, setPopover] = useState<PopoverState | null>(null);

  // State pentru modal single click
  const [modalState, setModalState] = useState<ModalState | null>(null);

  // State pentru highlight-ul celulei în editare în modal
  const [highlightedCell, setHighlightedCell] = useState<{
    category: string;
    subcategory: string | undefined;
    day: number;
  } | null>(null);

  // Calculează stilul pentru popover
  const popoverStyle = useMemo(() => {
    if (!popover?.anchorEl) return {};

    const rect = popover.anchorEl.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    return {
      position: 'fixed' as const,
      top: rect.bottom + scrollY + 8,
      left: rect.left + scrollX,
      zIndex: 50,
    };
  }, [popover?.anchorEl]);

  // Handlers pentru modal management
  const handleCloseModal = useCallback(() => {
    setModalState(null);
    setHighlightedCell(null);
  }, []);

  const handleSaveModal = useCallback(async (
    formData: { amount: string; recurring: boolean; frequency?: any },
    handleEditableCellSave: (
      category: string,
      subcategory: string | undefined,
      day: number,
      value: string | number,
      transactionId: string | null | undefined,
    ) => Promise<void>
  ) => {
    if (!modalState) return;

    try {
      await handleEditableCellSave(
        modalState.category,
        modalState.subcategory,
        modalState.day,
        formData.amount,
        modalState.transactionId,
      );
      handleCloseModal();
    } catch (error) {
      console.error('Eroare la salvarea din modal:', error);
      throw error;
    }
  }, [modalState, handleCloseModal]);

  const handleDeleteFromModal = useCallback(async (
    deleteTransactionMutation: any
  ) => {
    if (!modalState?.transactionId) return;

    try {
      await deleteTransactionMutation.mutateAsync(modalState.transactionId);
      handleCloseModal();
    } catch (error) {
      console.error('Eroare la ștergerea din modal:', error);
      throw error;
    }
  }, [modalState, handleCloseModal]);

  return {
    // State
    popover,
    setPopover,
    modalState,
    setModalState,
    highlightedCell,
    setHighlightedCell,
    
    // Computed
    popoverStyle,
    
    // Handlers
    handleCloseModal,
    handleSaveModal,
    handleDeleteFromModal,
  };
}; 