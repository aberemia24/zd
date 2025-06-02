import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// React Query hooks pentru tranzacții
import {
  useCreateTransactionMonthly,
  useUpdateTransactionMonthly,
  useDeleteTransactionMonthly,
} from '../../../../services/hooks/transactionMutations';

// Importuri din stores
import { useCategoryStore } from "../../../../stores/categoryStore";
import { useAuthStore } from "../../../../stores/authStore";

// Constante
import { TransactionType, FrequencyType, LUNAR_GRID_ACTIONS } from "@shared-constants";

// Types
import { type CategoryStoreItem } from "../../../../utils/lunarGrid/lunarGridHelpers";
import { type CellPosition } from "./useKeyboardNavigation";

// Types pentru hook
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

// Hook pentru management handlers de tranzacții în LunarGrid
export const useLunarGridTransactionHandlers = (
  year: number, 
  month: number, 
  validTransactions: any[]
) => {
  // Dependencies
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Hooks pentru mutații de tranzacții
  const createTransactionMutation = useCreateTransactionMonthly(year, month, user?.id);
  const updateTransactionMutation = useUpdateTransactionMonthly(year, month, user?.id);
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

  // Funcție pentru determinarea tipului de tranzacție
  const determineTransactionType = useCallback(
    (category: string): TransactionType => {
      const categories = useCategoryStore.getState().categories as CategoryStoreItem[];
      const foundCategory = categories.find((c) => c.name === category);
      return (foundCategory?.type || TransactionType.EXPENSE) as TransactionType;
    },
    [],
  );

  // Handler pentru salvarea din EditableCell
  const handleEditableCellSave = useCallback(
    async (
      category: string,
      subcategory: string | undefined,
      day: number,
      value: string | number,
      transactionId: string | null,
    ): Promise<void> => {
      const numValue = typeof value === "string" ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        throw new Error("Valoare invalidă");
      }

      const date = new Date(year, month - 1, day);
      const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      if (transactionId) {
        // UPDATE: Modifică tranzacția existentă
        await updateTransactionMutation.mutateAsync({
          id: transactionId,
          transactionData: {
            amount: numValue,
            date: isoDate,
            category,
            subcategory: subcategory || undefined,
            type: TransactionType.EXPENSE,
          }
        });
      } else {
        // CREATE: Creează o tranzacție nouă
        await createTransactionMutation.mutateAsync({
          amount: numValue,
          date: isoDate,
          category,
          subcategory: subcategory || undefined,
          type: TransactionType.EXPENSE,
          description: `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
        });
      }
    },
    [
      year,
      month,
      updateTransactionMutation,
      createTransactionMutation,
    ],
  );

  // Handler pentru click pe celulă (doar pentru modal advanced - Shift+Click)
  const handleCellClick = useCallback(
    (
      e: React.MouseEvent,
      category: string,
      subcategory: string | undefined,
      day: number,
      amount: string,
      setPopover: (popover: PopoverState | null) => void,
    ) => {
      e.stopPropagation();

      // Doar deschide modal-ul dacă se ține Shift (pentru advanced editing)
      if (!e.shiftKey) return;

      // Verifică dacă currentTarget este valid
      const anchorEl = e.currentTarget as HTMLElement;
      if (!anchorEl) {
        console.warn("No currentTarget available for popover anchor");
        return;
      }

      setPopover({
        category,
        subcategory,
        day,
        type: determineTransactionType(category),
        amount,
        isOpen: true,
        element: null,
        anchorEl,
      });
    },
    [determineTransactionType],
  );

  // Handler pentru salvarea tranzacției din popover
  const handleSavePopover = useCallback(
    async (
      popover: PopoverState | null,
      setPopover: (popover: PopoverState | null) => void,
      formData: {
        amount: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }
    ) => {
      if (!popover) {
        return;
      }

      const {
        category,
        subcategory,
        day,
        type: transactionTypeFromPopover,
      } = popover;

      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const commonPayload = {
        amount: Number(formData.amount),
        category,
        subcategory: subcategory || undefined,
        type: transactionTypeFromPopover,
        date,
        recurring: formData.recurring,
        frequency: formData.recurring ? formData.frequency : undefined,
      };

      createTransactionMutation.mutate(commonPayload, {
        onSuccess: () => {
          setPopover(null);
        },
        onError: () => {
          setPopover(null);
        },
      });
    },
    [year, month, createTransactionMutation],
  );

  // Handler pentru single click modal
  const handleSingleClickModal = useCallback(
    (
      category: string,
      subcategory: string | undefined,
      day: number,
      currentValue: string | number,
      transactionId: string | null,
      anchorElement: HTMLElement | undefined,
      setModalState: (state: ModalState | null) => void,
      setHighlightedCell: (cell: { category: string; subcategory: string | undefined; day: number } | null) => void,
    ) => {
      // Determină modul: edit dacă există tranzacție, add altfel
      const mode = transactionId ? 'edit' : 'add';
      
      // Calculează poziția pentru modal dacă avem elementul anchor
      let position: { top: number; left: number } | undefined;
      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        
        // Dimensiuni estimate ale modal-ului
        const modalWidth = 320; // 80 * 4 = 320px (w-80)
        const modalHeight = 384; // max-h-96 = ~384px
        
        // Verifică dacă modal-ul ar ieși din viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let top = rect.bottom + scrollY + 8; // 8px offset sub element
        let left = rect.left + scrollX;
        
        // Ajustează horizontal dacă ar ieși din viewport
        if (left + modalWidth > viewportWidth) {
          left = Math.max(16, viewportWidth - modalWidth - 16); // 16px margin
        }
        
        // Ajustează vertical dacă ar ieși din viewport
        if (top + modalHeight > viewportHeight + scrollY) {
          // Plasează modal-ul deasupra elementului
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

      // Setează highlight-ul pentru celula în editare
      setHighlightedCell({
        category,
        subcategory,
        day,
      });
    },
    [year, month],
  );

  // Handler pentru delete request din keyboard shortcuts
  const handleKeyboardDeleteRequest = useCallback(
    async (positions: CellPosition[]) => {
      if (!user?.id || positions.length === 0) return;

      try {
        // Găsește tranzacțiile care există pentru pozițiile selectate
        const transactionsToDelete: string[] = [];
        
        for (const pos of positions) {
          // Găsește tranzacția pentru această poziție
          // Convertește day la data completă
          const targetDate = `${year}-${month.toString().padStart(2, '0')}-${pos.day.toString().padStart(2, '0')}`;
          
          const existingTransaction = validTransactions.find(t => 
            t.category === pos.category &&
            t.subcategory === pos.subcategory &&
            t.date === targetDate
          );
          
          if (existingTransaction?.id) {
            transactionsToDelete.push(existingTransaction.id);
          }
        }

        if (transactionsToDelete.length === 0) {
          toast.error(LUNAR_GRID_ACTIONS.NO_TRANSACTIONS_TO_DELETE);
          return;
        }

        // Cerere de confirmare pentru ștergere
        const confirmMessage = transactionsToDelete.length === 1
          ? LUNAR_GRID_ACTIONS.DELETE_TRANSACTION_SINGLE
          : LUNAR_GRID_ACTIONS.DELETE_TRANSACTION_MULTIPLE.replace('{count}', transactionsToDelete.length.toString());

        if (!window.confirm(confirmMessage)) {
          return;
        }

        // Șterge tranzacțiile una câte una
        const deletePromises = transactionsToDelete.map(transactionId => 
          deleteTransactionMutation.mutateAsync(transactionId)
        );

        await Promise.all(deletePromises);

        // Success feedback
        toast.success(
          transactionsToDelete.length === 1
            ? LUNAR_GRID_ACTIONS.DELETE_SUCCESS_SINGLE
            : LUNAR_GRID_ACTIONS.DELETE_SUCCESS_MULTIPLE.replace('{count}', transactionsToDelete.length.toString())
        );

      } catch (error) {
        console.error('Eroare la ștergerea tranzacțiilor:', error);
        toast.error(LUNAR_GRID_ACTIONS.DELETE_ERROR);
      }
    },
    [user?.id, validTransactions, deleteTransactionMutation, year, month],
  );

  return {
    // Transaction mutations
    createTransactionMutation,
    updateTransactionMutation,
    deleteTransactionMutation,
    
    // Handlers
    handleEditableCellSave,
    handleCellClick,
    handleSavePopover,
    handleSingleClickModal,
    handleKeyboardDeleteRequest,
    
    // Utilities
    determineTransactionType,
  };
}; 