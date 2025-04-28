import { create } from 'zustand';
import { INITIAL_FORM_STATE, MESAJE, FORM_DEFAULTS } from '@shared-constants';

import type { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';
import type { TransactionFormWithNumberAmount } from '../types/transaction';
import { TransactionType } from '@shared-constants';
import { TransactionService } from '../services';
import { useTransactionStore } from '../stores/transactionStore';

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
  handleSubmit: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getForm: () => TransactionFormData;
  getError: () => string;
  getSuccess: () => string;
  getLoading: () => boolean;
  setTransactionService: (service: TransactionService) => void;
}

export const createTransactionFormStore = (initialForm: TransactionFormData = INITIAL_FORM_STATE): TransactionFormStoreState => {
  let form = { ...initialForm };
  let error = '';
  let success = '';
  let loading = false;
  let transactionService: TransactionService = new TransactionService();

  const setForm = (newForm: TransactionFormData) => { form = { ...newForm }; };
  const setField = (name: keyof TransactionFormData, value: any) => { form = { ...form, [name]: value }; };
  const setError = (msg: string) => { error = msg; };
  const setSuccess = (msg: string) => { success = msg; };
  const setLoading = (val: boolean) => { loading = val; };
  const resetForm = () => { form = { ...INITIAL_FORM_STATE }; error = ''; success = ''; };

  // Setter pentru service (folosit în teste)
  const setTransactionService = (service: TransactionService) => { transactionService = service; };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setField(name as keyof TransactionFormData, checked);
    } else {
      setField(name as keyof TransactionFormData, value);
    }
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      loading = false;
      return;
    }
    loading = true;
    error = '';
    try {
      const formWithNumberAmount: TransactionFormWithNumberAmount = {
        ...form,
        amount: Number(form.amount),
        currency: FORM_DEFAULTS.CURRENCY
      };
      await transactionService.saveTransaction(formWithNumberAmount);
      setSuccess(MESAJE.SUCCES_ADAUGARE);
      const txStore = useTransactionStore.getState();
      await txStore.refresh();
    } catch {
      setError(MESAJE.EROARE_ADAUGARE);
    } finally {
      setLoading(false);
    }
  };

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
    setTransactionService,
    validateForm,
    handleSubmit,
    handleChange,
    getForm,
    getError,
    getSuccess,
    getLoading,
  };
};

export const useTransactionFormStore = create<TransactionFormStoreState>(() => createTransactionFormStore());
