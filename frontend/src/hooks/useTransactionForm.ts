import { useState, useCallback } from 'react';
import { INITIAL_FORM_STATE } from '../constants/defaults';
import { MESAJE } from '../constants/messages';
import { TransactionFormData } from '../components/features/TransactionForm/TransactionForm';

export type UseTransactionFormProps = {
  onSubmit: (formData: TransactionFormWithNumberAmount) => void;
  initialValues?: TransactionFormData;
};

// Acest tip extinde TransactionFormData cu amount ca număr pentru API
export type TransactionFormWithNumberAmount = Omit<TransactionFormData, 'amount'> & {
  amount: number;
};

/**
 * Hook pentru gestionarea stării și comportamentului formularului de tranzacții
 * 
 * Responsabilități:
 * - Gestionarea stării formularului
 * - Validarea datelor introduse
 * - Resetarea formularului după submit
 * - Gestionarea mesajelor de eroare și succes
 */
export const useTransactionForm = ({ onSubmit, initialValues = INITIAL_FORM_STATE }: UseTransactionFormProps) => {
  // Starea formularului
  const [form, setForm] = useState<TransactionFormData>(initialValues);
  
  // Starea pentru mesaje de eroare și succes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Starea pentru indicator de încărcare
  const [loading, setLoading] = useState(false);

  /**
   * Handler pentru schimbări în formular
   * - Pentru inputs normale: actualizează valoarea în stare
   * - Pentru checkboxes: actualizează checked în stare
   * - Resetează mesajele de eroare și succes
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Resetăm mesajele la orice schimbare
    setError('');
    setSuccess('');

    const { name, value, type: inputType } = e.target;
    const isCheckbox = inputType === 'checkbox';
    const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
      // Resetăm frequency la debifarea recurring
      ...(name === 'recurring' && isCheckbox && checkedValue === false && { frequency: '' })
    }));
  }, []);

  /**
   * Validează formularul
   * - Verifică câmpurile obligatorii
   * - Verifică regulile specifice (ex: necesită frecvență pentru tranzacții recurente)
   * 
   * @returns boolean - true dacă formularul este valid, false altfel
   */
  const validateForm = useCallback(() => {
    // Verifică câmpurile obligatorii
    if (!form.type || !form.amount || !form.category || !form.date) {
      setError(MESAJE.CAMPURI_OBLIGATORII);
      return false;
    }

    // Verifică dacă tranzacțiile recurente au frecvență
    if (form.recurring && !form.frequency) {
      setError(MESAJE.FRECV_RECURENTA);
      return false;
    }

    return true;
  }, [form]);

  /**
   * Handler pentru submiterea formularului
   * - Validează formularul
   * - Apelează callback-ul onSubmit cu datele formularului
   * - Gestionează stările de eroare, succes și loading
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validăm formularul
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convertim amount la number pentru API
      const formWithNumberAmount: TransactionFormWithNumberAmount = {
        ...form,
        amount: Number(form.amount)
      };

      // Apelăm callback-ul de submit
      onSubmit(formWithNumberAmount);
      
      // Setăm succesul (eventual va fi setat din exterior)
      setSuccess(MESAJE.SUCCES_ADAUGARE);
    } catch (err) {
      console.error('Eroare la submit:', err);
      setError(MESAJE.EROARE_ADAUGARE);
    } finally {
      setLoading(false);
    }
  }, [form, validateForm, onSubmit]);

  /**
   * Resetează formularul la valorile inițiale
   */
  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setError('');
    setSuccess('');
  }, []);

  // Returnăm starea și handlerii
  return {
    form,
    error,
    success,
    loading,
    handleChange,
    handleSubmit,
    resetForm,
    setError,
    setSuccess,
    setLoading
  };
};
