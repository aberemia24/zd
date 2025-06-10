import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TransactionType, FrequencyType } from '@budget-app/shared-constants';
import { LUNAR_GRID_ACTIONS, TOAST } from '@budget-app/shared-constants/ui';
import { getTransactionTypeForCategory } from '@budget-app/shared-constants/category-mapping';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransactionMonthly
} from '../../../../services/hooks/transactionMutations';
import { Transaction } from '../../../../types/Transaction';
import { TransactionData } from '../modals';
import { useConfirmationModal } from '../../../primitives/ConfirmationModal';
import { useLunarGridPreferences } from '../../../../hooks/useLunarGridPreferences';
import { toast as toastStyles, toastIcon, toastContent, toastTitle } from '../../../../styles/cva-v2/primitives/feedback';

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
  handleDeleteTransaction: (transactionId: string) => Promise<void>;
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

  // ✅ HOOK CALLS LA ÎNCEPUT - Rules of Hooks compliance
  const queryClient = useQueryClient();
  
  // Hooks pentru mutații de tranzacții
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, userId);
  
  // ✅ FIX CRITICAL: Hook pentru preferences apelat la început, nu în handler
  const { preferences } = useLunarGridPreferences();

  const [isSaving, setIsSaving] = useState(createTransactionMutation.isPending || updateTransactionMutation.isPending);

  // Add confirmation modal for Delete key
  const { modalProps, showConfirmation } = useConfirmationModal();

  // ✅ CTRL+Z UNDO STATE - track ultima operațiune de delete pentru Ctrl+Z
  const [lastDeletedTransaction, setLastDeletedTransaction] = useState<{
    data: any;
    timestamp: number;
  } | null>(null);

  // ✅ CTRL+Z KEYBOARD LISTENER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z (sau Cmd+Z pe Mac) pentru undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        
        if (lastDeletedTransaction) {
          // Verifică dacă undo-ul e încă valid (maxim 30 secunde)
          const timeSinceDelete = Date.now() - lastDeletedTransaction.timestamp;
          if (timeSinceDelete <= 30000) { // 30 secunde window
            handleCtrlZUndo();
          } else {
            toast.error(TOAST.TRANSACTION.UNDO.EXPIRED, { duration: 2000 });
            setLastDeletedTransaction(null);
          }
        } else {
          toast.error(TOAST.TRANSACTION.UNDO.NO_OPERATION, { duration: 1500 });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lastDeletedTransaction]);

  // ✅ CTRL+Z UNDO HANDLER
  const handleCtrlZUndo = async () => {
    if (!lastDeletedTransaction) return;

    try {
      const transactionData = lastDeletedTransaction.data;
      
      await createTransactionMutation.mutateAsync({
        amount: typeof transactionData.amount === 'string' ? parseFloat(transactionData.amount) : transactionData.amount,
        type: transactionData.type,
        date: typeof transactionData.date === 'string' ? transactionData.date : transactionData.date.toISOString(),
        category: transactionData.category,
        subcategory: transactionData.subcategory,
        description: transactionData.description || '',
        recurring: transactionData.recurring || false,
        frequency: transactionData.frequency
      });
      
      toast.success(TOAST.TRANSACTION.UNDO.SUCCESS_CTRL_Z, { duration: 2000 });
      setLastDeletedTransaction(null); // Clear undo state după restore
      console.log(`[TransactionOps] Ctrl+Z undo successful`);
    } catch (error) {
      console.error('[TransactionOps] Ctrl+Z undo failed:', error);
      toast.error(TOAST.TRANSACTION.UNDO.ERROR);
    }
  };

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
        const dontShowDeleteConfirm = !preferences.deleteConfirmationEnabled;
        
        if (!dontShowDeleteConfirm) {
          // ✅ STEP 1: Găsește și salvează transaction data pentru undo
          const monthlyQueryKey = ['transactions', 'monthly', year, month, userId];
          const monthlyData = queryClient.getQueryData<{data: Transaction[], count: number}>(monthlyQueryKey);
          const transactionToDelete = monthlyData?.data.find(tx => tx.id === transactionId);
          
          if (!transactionToDelete) {
            console.warn(`[TransactionOps] Transaction ${transactionId} not found in cache for undo`);
            // Fallback: direct delete fără undo
            await deleteTransactionMutation.mutateAsync(transactionId);
            toast.success(TOAST.TRANSACTION.DELETED);
            return;
          }
          
          // ✅ STEP 2: SALVEAZĂ PENTRU CTRL+Z UNDO
          setLastDeletedTransaction({
            data: transactionToDelete,
            timestamp: Date.now()
          });
          
          // ✅ STEP 3: OPTIMISTIC DELETE cu undo capability
          let undoPerformed = false;
          
          // Execute delete immediately (optimistic)
          console.log(`[TransactionOps] Optimistic delete - removing transaction ${transactionId} from UI`);
          await deleteTransactionMutation.mutateAsync(transactionId);
          
          // ✅ STEP 4: CVA STYLED UNDO TOAST
          const undoToast = toast((t) => (
            <div className={toastStyles({ variant: 'warning' })}>
              <div className={toastIcon({ variant: 'warning' })}>🗑️</div>
              <div className={toastContent()}>
                <div className={toastTitle()}>{TOAST.TRANSACTION.UNDO.TITLE}</div>
              </div>
              <button
                onClick={async () => {
                  // ✅ UNDO ACTION - restore transaction
                  undoPerformed = true;
                  toast.dismiss(t.id);
                  setLastDeletedTransaction(null); // Clear Ctrl+Z state când se face undo din toast
                  
                  try {
                                         // Recreate transaction cu datele salvate
                     await createTransactionMutation.mutateAsync({
                       amount: typeof transactionToDelete.amount === 'string' ? parseFloat(transactionToDelete.amount) : transactionToDelete.amount,
                       type: transactionToDelete.type,
                       date: typeof transactionToDelete.date === 'string' ? transactionToDelete.date : transactionToDelete.date.toISOString(),
                       category: transactionToDelete.category,
                       subcategory: transactionToDelete.subcategory,
                       description: transactionToDelete.description || '',
                       recurring: transactionToDelete.recurring || false,
                       frequency: transactionToDelete.frequency
                     });
                    
                    toast.success(TOAST.TRANSACTION.UNDO.SUCCESS_TOAST, { duration: 2000 });
                    console.log(`[TransactionOps] Undo successful - transaction restored`);
                  } catch (error) {
                    console.error('[TransactionOps] Undo failed:', error);
                    toast.error(TOAST.TRANSACTION.UNDO.ERROR);
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                {TOAST.TRANSACTION.UNDO.BUTTON_TEXT}
              </button>
            </div>
          ), {
            duration: 4000,
            position: 'top-right',
            // ✅ FIX: Override react-hot-toast default styling să elimine containerul alb
            style: {
              background: 'transparent', // Elimină background-ul alb default
              border: 'none',            // Elimină border-ul default  
              padding: '0',              // Elimină padding-ul default
              boxShadow: 'none',         // Elimină shadow-ul default
              margin: '0',               // Elimină margin-ul default
            },
          });
          
          // ✅ STEP 5: Auto-confirm after timeout
          setTimeout(() => {
            if (!undoPerformed) {
              console.log(`[TransactionOps] Auto-confirming delete after 4s timeout for transaction ${transactionId}`);
              toast.success(TOAST.TRANSACTION.DELETED_PERMANENT, { 
                duration: 2000,
                position: 'top-right'
              });
            }
          }, 4000);
        } else {
          // Direct delete fără confirmare (dacă user-ul a ales "don't show again")
          console.log(`[TransactionOps] Direct deleting transaction ${transactionId} (confirmation disabled)`);
          await deleteTransactionMutation.mutateAsync(transactionId);
          toast.success(TOAST.TRANSACTION.DELETED, {
            duration: 2000,
            position: 'top-right',
          });
        }
        return;
      } else {
        // Dacă nu există tranzacție și valoarea e goală, nu face nimic
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

  // NOU: Handler pentru ștergere simplă
  const handleDeleteTransaction = useCallback(
    async (transactionId: string): Promise<void> => {
      try {
        // Aici se poate adăuga logica de confirmare dacă e necesară
        await deleteTransactionMutation.mutateAsync(transactionId);
        toast.success(LUNAR_GRID_ACTIONS.DELETE_SUCCESS_SINGLE);
      } catch (error) {
        toast.error("Eroare la ștergerea tranzacției. Încercați din nou.");
        throw error;
      }
    },
    [deleteTransactionMutation]
  );

  return {
    handleSaveTransaction,
    handleEditableCellSave,
    handleDeleteTransaction,
    isSaving,
    confirmationModalProps: modalProps,
  };
}; 
