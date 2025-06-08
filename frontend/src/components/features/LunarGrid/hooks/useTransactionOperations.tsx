import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TransactionType, FrequencyType } from '@budget-app/shared-constants';
import { LUNAR_GRID_ACTIONS } from '@budget-app/shared-constants/ui';
import { getTransactionTypeForCategory } from '@budget-app/shared-constants/category-mapping';
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

  // Query client pentru debugging și cache invalidation
  const queryClient = useQueryClient();

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
      console.log('🔄 [TRANSACTION-OPS] Starting handleEditableCellSave:', {
        category,
        subcategory,
        day,
        value,
        transactionId: transactionId ? transactionId.substring(0, 8) + '...' : null,
        year,
        month,
        userId: userId ? userId.substring(0, 8) + '...' : null
      });

      const numValue = typeof value === "string" ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        console.error('❌ [TRANSACTION-OPS] Invalid value:', value);
        throw new Error("Valoare invalidă");
      }

      // 🔧 FIX: Tratează 0 ca ștergere de tranzacție
      if (numValue === 0) {
        if (transactionId) {
          console.log('🔄 [TRANSACTION-OPS] Value is 0 - DELETING transaction...');
          try {
            await deleteTransactionMutation.mutateAsync(transactionId);
            console.log('✅ [TRANSACTION-OPS] DELETE completed for transaction:', transactionId.substring(0, 8) + '...');
            toast.success('Tranzacție ștearsă cu succes');
          } catch (error) {
            console.error('❌ [TRANSACTION-OPS] DELETE failed:', error);
            toast.error('Eroare la ștergerea tranzacției. Încercați din nou.');
            throw error;
          }
        } else {
          console.log('🔄 [TRANSACTION-OPS] Value is 0 but no transaction exists - nothing to delete');
          // Nu e nevoie să facem nimic dacă nu există tranzacție și valoarea e 0
        }
        return;
      }

      const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      // Determină tipul de tranzacție pe baza categoriei
      const transactionType = getTransactionTypeForCategory(category) || TransactionType.EXPENSE;

      try {
        if (transactionId) {
          // UPDATE: Modifică tranzacția existentă
          console.log('🔄 [TRANSACTION-OPS] Running UPDATE mutation...');
          const result = await updateTransactionMutation.mutateAsync({
            id: transactionId,
            transactionData: {
              amount: numValue,
              date: isoDate,
              category,
              subcategory: subcategory || undefined,
              type: transactionType,
            }
          });
          console.log('✅ [TRANSACTION-OPS] UPDATE completed:', {
            id: result.id.substring(0, 8) + '...',
            amount: result.amount,
            category: result.category,
            subcategory: result.subcategory
          });
        } else {
          // CREATE: Creează o tranzacție nouă
          console.log('🔄 [TRANSACTION-OPS] Running CREATE mutation...');
          const result = await createTransactionMutation.mutateAsync({
            amount: numValue,
            date: isoDate,
            category,
            subcategory: subcategory || undefined,
            type: transactionType,
            description: `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
          });
          console.log('✅ [TRANSACTION-OPS] CREATE completed:', {
            id: result.id.substring(0, 8) + '...',
            amount: result.amount,
            category: result.category,
            subcategory: result.subcategory
          });
        }

        // Debug cache state după mutation
        const monthlyQueryKey = ['transactions', 'monthly', year, month, userId];
        const cacheData = queryClient.getQueryData(monthlyQueryKey);
        console.log('🔍 [TRANSACTION-OPS] Cache data after mutation:', {
          queryKey: monthlyQueryKey,
          cacheExists: !!cacheData,
          cacheSize: cacheData ? (cacheData as any)?.data?.length || 0 : 0,
          timestamp: new Date().toISOString()
        });

        // 🔍 DEBUG: Să vedem ce conține cache-ul
        if (cacheData) {
          const data = (cacheData as any)?.data || [];
          console.log('🔍 [TRANSACTION-OPS] Sample cache transactions:', 
            data.slice(0, 3).map((tx: any) => ({
              id: tx.id?.substring(0, 8) + '...',
              amount: tx.amount,
              category: tx.category,
              subcategory: tx.subcategory,
              date: tx.date
            }))
          );
        }

        // Success message
        toast.success('Tranzacție salvată cu succes');

      } catch (error) {
        console.error('❌ [TRANSACTION-OPS] Mutation failed:', error);
        toast.error('Eroare la salvarea tranzacției. Încercați din nou.');
        throw error;
      }
    },
    [year, month, userId, updateTransactionMutation, createTransactionMutation, queryClient],
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
    handleEditableCellSave,
    handleSavePopover,
    handleSaveModal,
    handleDeleteFromModal,
  };
}; 
