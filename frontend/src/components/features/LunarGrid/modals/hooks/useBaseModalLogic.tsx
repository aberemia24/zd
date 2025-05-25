import { useState, useCallback } from 'react';

// Types pentru modal context
export interface CellContext {
  category: string;
  subcategory?: string;
  day: number;
  month: number;
  year: number;
}

export interface ValidationErrors {
  amount?: string;
  description?: string;
  frequency?: string;
  endDate?: string;
  general?: string;
}

// Helper function pentru formatare currency
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Base modal logic hook (simplified pentru PHASE 2.1)
export const useBaseModalLogic = (cellContext: CellContext) => {
  // Form validation și error handling
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recurring: false,
    frequency: undefined as string | undefined
  });

  // Validation functions
  const validateAmount = useCallback((amount: string): string | undefined => {
    if (!amount || amount.trim() === '') {
      return 'Suma este obligatorie';
    }
    
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return 'Suma trebuie să fie un număr valid';
    }
    
    if (numericAmount <= 0) {
      return 'Suma trebuie să fie pozitivă';
    }
    
    return undefined;
  }, []);

  const validateDescription = useCallback((description: string): string | undefined => {
    if (description && description.length > 255) {
      return 'Descrierea nu poate depăși 255 de caractere';
    }
    return undefined;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    
    const amountError = validateAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) newErrors.description = descriptionError;
    
    if (formData.recurring && !formData.frequency) {
      newErrors.frequency = 'Frecvența este obligatorie pentru tranzacții recurente';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateAmount, validateDescription]);

  // Update form data helper
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Clear related errors when updating
    setErrors(prev => {
      const newErrors = { ...prev };
      
      if (updates.amount !== undefined && newErrors.amount) {
        delete newErrors.amount;
      }
      if (updates.description !== undefined && newErrors.description) {
        delete newErrors.description;
      }
      if (updates.frequency !== undefined && newErrors.frequency) {
        delete newErrors.frequency;
      }
      
      return newErrors;
    });
  }, []);

  // Financial impact calculation (simplified)
  const calculateFinancialImpact = useCallback((transactionAmount: number) => {
    const currentDate = new Date(cellContext.year, cellContext.month - 1, cellContext.day);
    
    // Basic impact calculation
    const formattedAmount = formatMoney(transactionAmount);
    
    return {
      amount: formattedAmount,
      date: currentDate,
      isPositive: transactionAmount > 0
    };
  }, [cellContext]);

  return {
    // Form state management
    form: {
      data: formData,
      updateData: updateFormData,
      validate: validateForm
    },
    
    // Validation și error handling
    validation: { 
      errors, 
      setErrors,
      validateAmount,
      validateDescription
    },
    
    // Loading state
    loading: { 
      isLoading, 
      setIsLoading 
    },
    
    // Basic calculations
    calculations: {
      formatMoney,
      calculateFinancialImpact
    }
  };
}; 