import { create } from 'zustand';
import { INITIAL_FORM_STATE, MESAJE, FORM_DEFAULTS } from '@shared-constants';
import { VALIDATION, VALIDATION_MESSAGES } from '@shared-constants/validation';

import type { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';
import type { TransactionFormWithNumberAmount } from '../types/transaction';
import { TransactionType } from '../../../shared-constants/enums';
import { FrequencyType } from '@shared-constants/enums';
import { supabaseService } from '../services/supabaseService';
import { useTransactionStore } from '../stores/transactionStore';

export interface TransactionFormStoreState {
  form: TransactionFormData;
  error: string;
  success: string;
  loading: boolean;
  setForm: (form: TransactionFormData) => void;
  setField: (name: keyof TransactionFormData, value: any) => void;
  setError: (msg: string) => void;
  setSuccess: (msg: string) => void;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getForm: () => TransactionFormData;
  getError: () => string;
  getSuccess: () => string;
  getLoading: () => boolean;
  setTransactionService: () => void; // compatibilitate UI/teste vechi
}

export const useTransactionFormStore = create<TransactionFormStoreState>((set, get) => {
  // Eliminat transactionService: TransactionService


  return {
    form: { ...INITIAL_FORM_STATE },
    error: '',
    success: '',
    loading: false,
    setForm: (form) => set({ form: { ...form } }),
    setField: (name, value) => set(state => ({ form: { ...state.form, [name]: value } })),
    setError: (msg) => set({ error: msg }),
    setSuccess: (msg) => set({ success: msg }),
    setLoading: (val) => set({ loading: val }),
    resetForm: () => set({ form: { ...INITIAL_FORM_STATE }, error: '', success: '' }),
    setTransactionService: () => {}, // noop (pentru compatibilitate cu UI/teste vechi)
    handleChange: (e) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        get().setField(name as keyof TransactionFormData, checked);
      } else {
        get().setField(name as keyof TransactionFormData, value);
      }
    },
    validateForm: () => {
      const { form } = get();
      if (!form.type || !form.amount || !form.category || !form.date) {
        set({ error: VALIDATION_MESSAGES.REQUIRED_FIELDS || VALIDATION_MESSAGES.INVALID_AMOUNT });
        return false;
      }
      if (form.recurring && !form.frequency) {
        set({ error: VALIDATION_MESSAGES.REQUIRED_FREQUENCY || VALIDATION_MESSAGES.INVALID_DATE });
        return false;
      }
      // Validare sumă
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount < VALIDATION.AMOUNT_MIN || amount > VALIDATION.AMOUNT_MAX) {
        set({ error: VALIDATION_MESSAGES.INVALID_AMOUNT });
        return false;
      }
      // Validare dată
      if (!VALIDATION.DATE_REGEX.test(form.date)) {
        set({ error: VALIDATION_MESSAGES.INVALID_DATE });
        return false;
      }
      set({ error: '' });
      return true;
    },
    handleSubmit: async (e) => {
      e?.preventDefault();
      if (!get().validateForm()) {
        set({ loading: false });
        return;
      }
      set({ loading: true, error: '' });
      try {
        const { form } = get();
        const formWithNumberAmount: TransactionFormWithNumberAmount = {
          ...form,
          type: form.type as TransactionType,
          amount: Number(form.amount),
          frequency: form.frequency ? form.frequency as FrequencyType : undefined,
          currency: FORM_DEFAULTS.CURRENCY
        };
        await supabaseService.createTransaction(formWithNumberAmount);
        set({ success: MESAJE.SUCCES_ADAUGARE });
        const txStore = useTransactionStore.getState();
        await txStore.refresh();
      } catch {
        set({ error: MESAJE.EROARE_ADAUGARE });
      } finally {
        set({ loading: false });
      }
    },
    getForm: () => get().form,
    getError: () => get().error,
    getSuccess: () => get().success,
    getLoading: () => get().loading,
  };
});
