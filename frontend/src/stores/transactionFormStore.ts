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
import { useAuthStore } from './authStore';

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
        
        // Obținem userId din AuthStore
        const user = useAuthStore.getState().user;
        
        if (!user || !user.id) {
          set({ error: 'Trebuie să fiți autentificat pentru a adăuga tranzacții.' });
          set({ loading: false });
          return;
        }
        
        // Construim payload-ul pentru API conform CreateTransaction
        const transactionData: CreateTransaction & { userId: string } = {
          type: form.type as TransactionType,
          amount: Number(form.amount),
          date: form.date,
          category: form.category,
          subcategory: form.subcategory || '',
          description: form.description || '',
          recurring: form.recurring || false,
          frequency: form.recurring && form.frequency ? form.frequency as FrequencyType : undefined,
          status: TransactionStatus.COMPLETED,
          // Adăugăm userId la payload
          userId: user.id
        };
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Trimit tranzacție cu payload:', transactionData);
        }
        
        // Adăugăm token-ul de autentificare la header
        const token = localStorage.getItem('supabase.auth.token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Adăugăm tranzacția folosind fetch API
        const response = await fetch(API.ROUTES.TRANSACTIONS, {
          method: 'POST',
          headers,
          body: JSON.stringify(transactionData),
        });
        
        // Verificăm dacă răspunsul este ok
        if (!response.ok) {
          // Încercăm să extragem mesajul de eroare din răspuns
          let errorMessage = MESAJE.EROARE_ADAUGARE;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || MESAJE.EROARE_ADAUGARE;
          } catch (parseError) {
            // Dacă nu putem parsa răspunsul, folosim mesajul generic
            console.error('Eroare la parsarea răspunsului de eroare:', parseError);
          }
          throw new Error(errorMessage);
        }
        
        // Parsăm răspunsul pentru a confirma succesul
        const responseData = await response.json();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Răspuns după adăugare tranzacție:', responseData);
        }
        
        set({ success: MESAJE.SUCCES_ADAUGARE });
        // Resetăm formularul după adăugare reușită
        get().resetForm();
        
        // Pentru a notifica alte componente despre schimbare, putem emite un eveniment
        const event = new CustomEvent('transaction:created', { 
          detail: responseData 
        });
        window.dispatchEvent(event);
        
      } catch (error) {
        console.error('Eroare la adăugarea tranzacției:', error);
        
        // Gestionăm mai robustă erorile
        let errorMessage = MESAJE.EROARE_ADAUGARE;
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error && 'message' in error) {
          errorMessage = (error as any).message || MESAJE.EROARE_ADAUGARE;
        }
        
        set({ error: errorMessage });
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
