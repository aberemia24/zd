import { create } from 'zustand';
import { INITIAL_FORM_STATE, MESAJE, FORM_DEFAULTS } from '@shared-constants';
import { VALIDATION } from '@shared-constants/validation';
import { API } from '@shared-constants/api';

import type { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';
import type { TransactionFormWithNumberAmount } from '../types/Transaction';
import { TransactionType, TransactionStatus } from '@shared-constants/enums';
import { FrequencyType } from '@shared-constants/enums';
import type { CreateTransaction } from '@shared-constants/transaction.schema';
// Nu importăm useQueryClient direct în store pentru a evita încălcarea regulilor React Hooks

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
  // Utilizăm queryClient direct pentru a reuși invalidarea query-urilor
  // Acest approach este recomandat pentru integrarea React Query cu Zustand


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
        set({ error: MESAJE.CAMPURI_OBLIGATORII });
        return false;
      }
      if (form.recurring && !form.frequency) {
        set({ error: MESAJE.FRECV_RECURENTA });
        return false;
      }
      // Validare sumă
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount < VALIDATION.AMOUNT_MIN || amount > VALIDATION.AMOUNT_MAX) {
        set({ error: MESAJE.AVERTISMENT_DATE });
        return false;
      }
      // Validare dată
      if (!VALIDATION.DATE_REGEX.test(form.date)) {
        set({ error: MESAJE.AVERTISMENT_DATE });
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
        
        // Construim payload-ul pentru React Query conform CreateTransaction
        const transactionData: CreateTransaction = {
          type: form.type as TransactionType,
          amount: Number(form.amount),
          date: form.date,
          category: form.category,
          subcategory: form.subcategory || '',
          description: form.description || '',
          recurring: form.recurring || false,
          frequency: form.frequency ? form.frequency as FrequencyType : undefined,
          status: TransactionStatus.COMPLETED,
          // Nu mai includem currency conform schema.ts unde nu este folosit în FE
        };
        
        // Nu mai folosim queryClient direct în store pentru a evita încălcarea regulilor React Hooks
        // Invalidarea cache-ului se va face în componenta care folosește acest store
        
        // Observație: userId NU trebuie inclus explicit în payload
        // Conform notei din transaction.schema.ts: "user_id nu e expus în FE (doar pe backend)"
        // AuthToken-ul din Supabase va fi folosit pentru identificarea user-ului în backend
        
        // Adăugăm tranzacția folosind hook API direct
        // Această abordare poate fi îmbunătățită printr-un adapter dedicat pentru store+React Query
        await fetch(API.ROUTES.TRANSACTIONS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });
        
        // Invalidăm query-urile pentru a reîncărca datele actualizate
        // Această operație trebuie făcută în componenta care folosește acest store
        // Conform regulilor anti-pattern din memoria d7b6eb4b-0702-4b0a-b074-3915547a2544
        
        set({ success: MESAJE.SUCCES_ADAUGARE });
        // Resetăm formularul după adăugare reușită
        get().resetForm();
      } catch (error) {
        console.error('Eroare la adăugarea tranzacției:', error);
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
