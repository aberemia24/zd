import { create } from 'zustand';
import { INITIAL_FORM_STATE, MESAJE, FORM_DEFAULTS } from '@shared-constants';

import type { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';
import type { TransactionFormWithNumberAmount } from '../types/transaction';
import { TransactionType } from '@shared-constants';
import { TransactionService } from '../services';

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
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setSubmitHandler: (handler: ((data: TransactionFormWithNumberAmount) => Promise<boolean> | boolean) | null) => void;
  // Metode pentru DI - permitând injectarea serviciilor și callback-urilor din componenta părinte
  setTransactionService: (service: TransactionService | null) => void;
  setRefreshCallback: (callback: (() => void) | null) => void;
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
  let submitHandler: ((data: TransactionFormWithNumberAmount) => Promise<boolean> | boolean) | null = null;
  // Pentru injectare dependency din App.tsx
  let transactionService: TransactionService | null = null;
  let refreshCallback: (() => void) | null = null;

  const setForm = (newForm: TransactionFormData) => { form = { ...newForm }; };
  const setField = (name: keyof TransactionFormData, value: any) => { form = { ...form, [name]: value }; };
  const setError = (msg: string) => { error = msg; };
  const setSuccess = (msg: string) => { success = msg; };
  const setLoading = (val: boolean) => { loading = val; };
  const resetForm = () => { form = { ...INITIAL_FORM_STATE }; error = ''; success = ''; };
  const setSubmitHandler = (handler: ((data: TransactionFormWithNumberAmount) => Promise<boolean> | boolean) | null) => {
    submitHandler = handler;
  };

  // Metode pentru injectarea dependențelor
  const setTransactionService = (service: TransactionService | null) => {
    transactionService = service;
  };

  const setRefreshCallback = (callback: (() => void) | null) => {
    refreshCallback = callback;
  };
  
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

  const handleSubmit = (cb: (data: TransactionFormWithNumberAmount) => void) => {
    if (!validateForm()) {
      loading = false;
      return;
    }
    loading = true;
    error = '';
    try {
      // Transformăm datele formularului în TransactionFormWithNumberAmount adăugând currency din constante
      const formWithNumberAmount: TransactionFormWithNumberAmount = {
        ...form,
        amount: Number(form.amount),
        currency: FORM_DEFAULTS.CURRENCY // Adăugăm currency obligatoriu din constante
      };
      
      // Verificăm dacă avem serviciul injectat - noua metodă preferabilă
      if (transactionService) {
        transactionService.saveTransaction(formWithNumberAmount)
          .then(() => {
            setSuccess(MESAJE.SUCCES_ADAUGARE);
            // Dacă avem și callback de refresh, îl apelăm
            if (refreshCallback) refreshCallback();
            setLoading(false);
          })
          .catch(() => {
            setError(MESAJE.EROARE_ADAUGARE);
            setLoading(false);
          });
        return;
      }
      // Folosim submitHandler dacă există (metoda anterioară), altfel cb
      else if (submitHandler) {
        const result = submitHandler(formWithNumberAmount);
        if (result instanceof Promise) {
          result.then(success => {
            if (success) {
              setSuccess(MESAJE.SUCCES_ADAUGARE);
            }
            setLoading(false);
          }).catch(() => {
            setError(MESAJE.EROARE_ADAUGARE);
            setLoading(false);
          });
          return;
        } else if (result) {
          success = MESAJE.SUCCES_ADAUGARE;
        } else {
          error = MESAJE.EROARE_ADAUGARE;
        }
      } else {
        cb(formWithNumberAmount);
        success = MESAJE.SUCCES_ADAUGARE;
      }
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
    handleChange,
    setSubmitHandler,
    setTransactionService,
    setRefreshCallback,
    getForm,
    getError,
    getSuccess,
    getLoading,
  };
};

// Instanță globală Zustand pentru UI
export const useTransactionFormStore = create<TransactionFormStoreState>(() => createTransactionFormStore());
