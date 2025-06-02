import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { TransactionType, FrequencyType } from '@shared-constants';
import { LUNAR_GRID_ACTIONS } from '@shared-constants/ui';
import {
  useCreateTransactionMonthly,
  useUpdateTransactionMonthly,
  useDeleteTransactionMonthly
} from '../../../../services/hooks/transactionMutations';

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
  userId: string | undefined;
}

interface UseTransactionOperationsReturn {
  handleEditableCellSave: (
    category: string,
    subcategory: string | undefined,
    day: number,
    value: string | number,
    transactionId: string | null,
  ) => Promise<void>;
  
  handleSavePopover: (
    popover: PopoverState | null,
    formData: {
      amount: string;
      recurring: boolean;
      frequency?: FrequencyType;
    }
  ) => Promise<void>;
  
  handleSaveModal: (
    modalState: ModalState | null,
    data: {
      amount: string;
      description: string;
      recurring: boolean;
      frequency?: FrequencyType;
    }
  ) => Promise<void>;
  
  handleDeleteFromModal: (
    modalState: ModalState | null
  ) => Promise<void>;
}

/**
 * Hook pentru gestionarea operațiilor CRUD pe tranzacții în LunarGrid
 * Separă business logic-ul de operații pe tranzacții de componentele UI
 */
export const useTransactionOperations = ({
  year,
  month,
  userId
}: UseTransactionOperationsProps): UseTransactionOperationsReturn => {

  // Hooks pentru mutații de tranzacții
  const createTransactionMutation = useCreateTransactionMonthly(year, month, userId);
  const updateTransactionMutation = useUpdateTransactionMonthly(year, month, userId);
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, userId);

  // Handler pentru salvarea din EditableCell (inline editing)
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
    [year, month, updateTransactionMutation, createTransactionMutation],
  );

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
    handleEditableCellSave,
    handleSavePopover,
    handleSaveModal,
    handleDeleteFromModal,
  };
}; 