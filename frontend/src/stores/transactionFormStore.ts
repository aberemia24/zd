import { create } from 'zustand';
import { INITIAL_FORM_STATE } from '../../constants/defaults';
import { MESAJE } from '../../constants/messages';

import type { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';
// Tip local pentru amount numeric
export type TransactionFormWithNumberAmount = Omit<TransactionFormData, 'amount'> & { amount: number };

interface TransactionFormStoreState {
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
  handleSubmit: (cb: (data: TransactionFormWithNumberAmount) => void) => void;
  // Selectors ca funcții pentru testabilitate
  getForm: () => TransactionFormData;
  getError: () => string;
  getSuccess: () => string;
  getLoading: () => boolean;
}

export const createTransactionFormStore = (initialForm: TransactionFormData = INITIAL_FORM_STATE): TransactionFormStoreState => {
  let form = { ...initialForm };
  let error = '';
  let success = '';
  let loading = false;

  const setForm = (newForm: TransactionFormData) => { form = { ...newForm }; };
  const setField = (name: keyof TransactionFormData, value: any) => { form = { ...form, [name]: value }; };
  const setError = (msg: string) => { error = msg; };
  const setSuccess = (msg: string) => { success = msg; };
  const setLoading = (val: boolean) => { loading = val; };
  const resetForm = () => { form = { ...INITIAL_FORM_STATE }; error = ''; success = ''; };

  const validateForm = (): boolean => {
    if (!form.type || !form.amount || !form.category || !form.date) {
      error = MESAJE.CAMPURI_OBLIGATORII;
      return false;
    }
    if (form.recurring && !form.frequency) {
      error = MESAJE.FRECV_RECURENTA;
      return false;
    }
    error = '';
    return true;
  };

  const handleSubmit = (cb: (data: TransactionFormWithNumberAmount) => void) => {
    if (!validateForm()) {
      loading = false;
      return;
    }
    loading = true;
    error = '';
    try {
      const formWithNumberAmount: TransactionFormWithNumberAmount = {
        ...form,
        amount: Number(form.amount)
      };
      cb(formWithNumberAmount);
      success = MESAJE.SUCCES_ADAUGARE;
    } catch {
      error = MESAJE.EROARE_ADAUGARE;
    } finally {
      loading = false;
    }
  };

  // Selectors ca funcții
  const getForm = () => form;
  const getError = () => error;
  const getSuccess = () => success;
  const getLoading = () => loading;

  return {
    form,
    error,
    success,
    loading,
    setForm,
    setField,
    setError,
    setSuccess,
    setLoading,
    resetForm,
    validateForm,
    handleSubmit,
    getForm,
    getError,
    getSuccess,
    getLoading,
  };
};

// Instanță globală Zustand pentru UI
export const useTransactionFormStore = create<TransactionFormStoreState>(() => createTransactionFormStore());

