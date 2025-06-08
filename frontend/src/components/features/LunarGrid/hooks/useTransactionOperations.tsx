import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TransactionType, FrequencyType } from '@budget-app/shared-constants';
import { LUNAR_GRID_ACTIONS } from '@budget-app/shared-constants/ui';
import { getTransactionTypeForCategory } from '@budget-app/shared-constants/category-mapping';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransactionMonthly
} from '../../../../services/hooks/transactionMutations';
import { TransactionData } from '../modals'; // Asigură-te că TransactionData este exportat din modals

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

interface UseTransactionOperationsProps {
  year: number;
  month: number;
  userId?: string;
}

export interface UseTransactionOperationsReturn {
  handleSaveTransaction: (transaction: Omit<TransactionData, "id">, existingId?: string) => Promise<void>;
  handleEditableCellSave: (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null) => Promise<void>;
  isSaving: boolean;
}
export type TransformedDataForPopover = TransactionData;

/**
 * Hook pentru gestionarea operațiilor CRUD pe tranzacții în LunarGrid
 * Separă business logic-ul de operații pe tranzacții de componentele UI
 */
export const useTransactionOperations = ({
  year,
  month,
  userId
}: UseTransactionOperationsProps): UseTransactionOperationsReturn => {

  // Query client pentru debugging și cache invalidation
  const queryClient = useQueryClient();

  // Hooks pentru mutații de tranzacții
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, userId);

  const isSaving = createTransactionMutation.isPending || updateTransactionMutation.isPending;

  const handleSaveTransaction = async (transaction: Omit<TransactionData, "id">, existingId?: string) => {
    // Obiectul complet pentru mutație
    const mutationData = {
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      subcategory: transaction.subcategory,
      recurring: transaction.isRecurring,
      // ... (alte câmpuri dacă sunt necesare, ex: frequency)
    };

    if (existingId) {
      await updateTransactionMutation.mutateAsync({ id: existingId, transactionData: mutationData });
    } else {
      await createTransactionMutation.mutateAsync(mutationData);
    }
    queryClient.invalidateQueries({ queryKey: ['transactions', year, month] });
  };

  // Handler pentru salvarea din EditableCell (inline editing)
  const handleEditableCellSave = async (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    const type = getTransactionTypeForCategory(category);
    
    const transactionData: Omit<TransactionData, "id"> = {
      amount,
      type,
      date,
      category,
      subcategory,
      description: '', // EditableCell nu are descriere
      isRecurring: false,
    };

    await handleSaveTransaction(transactionData, transactionId || undefined);
  };

  // Handler pentru salvarea tranzacției din popover (Shift+Click)
  const handleSavePopover = useCallback(
    async (
      popover: PopoverState | null,
      formData: {
        amount: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }
    ): Promise<void> => {
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
        type: transactionTypeFromPopover as TransactionType,
        date,
        recurring: formData.recurring,
        frequency: formData.recurring ? (formData.frequency as FrequencyType) : undefined,
      };

      await createTransactionMutation.mutateAsync(commonPayload);
    },
    [year, month, createTransactionMutation],
  );

  // Handler pentru salvarea din modal (Single Click)
  const handleSaveModal = useCallback(
    async (
      modalState: ModalState | null,
      data: {
        amount: string;
        description: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }
    ): Promise<void> => {
      if (!modalState) return;

      const { category, subcategory, day, transactionId, mode } = modalState;
      const numValue = parseFloat(data.amount);
      
      if (isNaN(numValue)) {
        throw new Error("Valoare invalidă");
      }

      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Determină tipul de tranzacție pe baza categoriei
      const transactionType = getTransactionTypeForCategory(category) || TransactionType.EXPENSE;

      if (mode === 'edit' && transactionId) {
        // UPDATE: Modifică tranzacția existentă
        await updateTransactionMutation.mutateAsync({
          id: transactionId,
          transactionData: {
            amount: numValue,
            date,
            category,
            subcategory: subcategory || undefined,
            type: transactionType,
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
          type: transactionType,
          description: data.description || `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
        });
      }
    },
    [year, month, updateTransactionMutation, createTransactionMutation],
  );

  // Handler pentru delete transaction din modal
  const handleDeleteFromModal = useCallback(
    async (modalState: ModalState | null): Promise<void> => {
      if (!modalState || !modalState.transactionId) return;

      try {
        await deleteTransactionMutation.mutateAsync(modalState.transactionId);
        toast.success(LUNAR_GRID_ACTIONS.DELETE_SUCCESS_SINGLE);
      } catch (error) {
        toast.error("Eroare la ștergerea tranzacției. Încercați din nou.");
        throw error; // Re-throw pentru ca componenta să poată gestiona
      }
    },
    [deleteTransactionMutation],
  );

  return {
    handleSaveTransaction,
    handleEditableCellSave,
    isSaving,
  };
}; 
