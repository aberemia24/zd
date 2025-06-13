/**
 * Shared types for TransactionForm functionality
 * Created to break circular dependency between TransactionForm.tsx and transactionFormStore.tsx
 */

// Tipul datelor pentru formularul de tranzacție
export type TransactionFormData = {
  type: string;
  amount: string;
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency: string;
  description?: string; // Descriere opțională pentru tranzacție (necesar pentru React Query)
  // currency nu este vizibilă în formular, se folosește valoarea implicită RON în store
};

// Props pentru componenta TransactionForm
export interface TransactionFormProps {
  onSave?: (form: TransactionFormData) => void;
  onCancel?: () => void;
} 