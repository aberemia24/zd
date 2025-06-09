import { useCallback, useState, useRef } from 'react';
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
import { useConfirmationModal } from '../../../primitives/ConfirmationModal';
import { useLunarGridPreferences } from '../../../../hooks/useLunarGridPreferences';

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
  confirmationModalProps: any; // Import ConfirmationModalProps if needed for proper typing
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

  const [isSaving, setIsSaving] = useState(createTransactionMutation.isPending || updateTransactionMutation.isPending);

  // Add confirmation modal for Delete key
  const { modalProps, showConfirmation } = useConfirmationModal();

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
    
    // FIX CRITIC: Când Delete key se apasă și value este empty/0, șterge tranzacția în loc să salvezi amount NULL
    const isEmptyValue = value === "" || value === 0 || value === "0" || 
                        (typeof value === 'string' && (value.trim() === "" || parseFloat(value.trim()) === 0));
    
    if (isEmptyValue) {
      // Dacă există tranzacție, verifică dacă trebuie să afișeze confirmarea
      if (transactionId) {
        // Check preferences cu noul hook reutilizabil
        const { preferences } = useLunarGridPreferences();
        const dontShowDeleteConfirm = !preferences.deleteConfirmationEnabled;
        
        if (!dontShowDeleteConfirm) {
          // TOAST SUBTIL cu UNDO în loc de modal mare
          const deleteToast = toast((t) => (
            <div className="flex items-center gap-3 min-w-[300px]">
              <span className="text-amber-800">🗑️ Ștergi tranzacția?</span>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    // DELETE CONFIRMED
                    try {
                      console.log(`[TransactionOps] Deleting transaction ${transactionId} via toast confirm`);
                      await deleteTransactionMutation.mutateAsync(transactionId);
                      toast.dismiss(t.id);
                      toast.success('Tranzacție ștearsă', { duration: 2000 });
                    } catch (error) {
                      toast.error('Eroare la ștergere');
                      console.error('Delete error:', error);
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Șterge
                </button>
                <button
                  onClick={() => {
                    // CANCEL - doar dismiss toast-ul
                    toast.dismiss(t.id);
                    console.log(`[TransactionOps] Delete cancelled via toast for transaction ${transactionId}`);
                  }}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Anulează
                </button>
              </div>
            </div>
          ), {
            duration: 4000, // 4 secunde pentru undo - Excel/Sheets standard
            position: 'top-right',
            style: {
              background: '#fef3c7', // Yellow amber background
              border: '1px solid #f59e0b',
              color: '#92400e',
              minWidth: '350px',
              padding: '12px',
            },
          });
        } else {
          // Direct delete fără confirmare (dacă user-ul a ales "don't show again")
          console.log(`[TransactionOps] Direct deleting transaction ${transactionId} (confirmation disabled)`);
          await deleteTransactionMutation.mutateAsync(transactionId);
          toast.success('Tranzacție ștearsă', {
            duration: 2000,
            position: 'top-right',
          });
        }
        return;
      } else {
        // Dacă nu există tranzacție și valoarea e goală, nu face nimic
        console.log(`[TransactionOps] Ignoring empty value for non-existing transaction:`, { value, category, subcategory, day });
        return;
      }
    }
    
    // Pentru valori non-empty, salvează/update tranzacția normal
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(amount)) {
      throw new Error("Valoarea introdusă nu este un număr valid");
    }
    
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
    confirmationModalProps: modalProps,
  };
}; 
