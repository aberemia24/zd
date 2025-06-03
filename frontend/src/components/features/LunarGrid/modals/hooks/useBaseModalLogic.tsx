import { useState, useCallback } from "react";
import { useValidation } from "../../../../../hooks/useValidation";

// Types pentru modal context
export interface CellContext {
  category: string;
  subcategory?: string;
  day: number;
  month: number;
  year: number;
}

// Helper function pentru formatare currency
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("ro-RO", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Enhanced Base modal logic hook cu validare centralizată
 * 
 * FEATURES:
 * - Validare centralizată folosind useValidation hook
 * - Error handling enhanced cu feedback instant
 * - Validări pentru amount, description, frequency
 * - UX îmbunătățit cu warnings și context
 */
export const useBaseModalLogic = (cellContext: CellContext) => {
  // Enhanced: Validare centralizată
  const validation = useValidation('useBaseModalLogic');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    recurring: false,
    frequency: undefined as string | undefined,
  });

  /**
   * Enhanced: Validare amount folosind validatorul centralizat
   */
  const validateAmount = useCallback((amount: string): string | undefined => {
    const result = validation.validators.amount(amount);
    return result.error;
  }, [validation.validators]);

  /**
   * Enhanced: Validare description folosind validatorul centralizat
   */
  const validateDescription = useCallback((description: string): string | undefined => {
    const result = validation.validators.description(description, { allowEmpty: true });
    return result.error;
  }, [validation.validators]);

  /**
   * Enhanced: Validare formular complet cu feedback instant
   */
  const validateForm = useCallback(() => {
    const fields = [
      {
        name: 'amount',
        value: formData.amount,
        type: 'amount' as const,
      },
      {
        name: 'description',
        value: formData.description,
        type: 'description' as const,
        options: { allowEmpty: true },
      },
    ];

    // Validare frecvență pentru tranzacții recurente
    if (formData.recurring && !formData.frequency) {
      validation.setCustomError('frequency', 'Frecvența este obligatorie pentru tranzacții recurente');
      return false;
    } else {
      validation.clearFieldError('frequency');
    }

    // Validare folosind sistemul centralizat
    const isValid = validation.validateForm(fields);
    
    return isValid;
  }, [formData, validation]);

  /**
   * Enhanced: Update form data cu cleararea erorilor automate
   */
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    // Clear related errors when updating (feedback instant)
    Object.keys(updates).forEach(field => {
      validation.clearFieldError(field);
    });
  }, [validation]);

  /**
   * Enhanced: Financial impact calculation cu format îmbunătățit
   */
  const calculateFinancialImpact = useCallback(
    (transactionAmount: number) => {
      const currentDate = new Date(
        cellContext.year,
        cellContext.month - 1,
        cellContext.day,
      );

      // Enhanced calculation cu context
      const formattedAmount = formatMoney(transactionAmount);
      const isLargeAmount = transactionAmount > 10000;
      const isVeryLargeAmount = transactionAmount > 100000;

      return {
        amount: formattedAmount,
        date: currentDate,
        isPositive: transactionAmount > 0,
        isLargeAmount,
        isVeryLargeAmount,
        warnings: isVeryLargeAmount 
          ? ['Sumă foarte mare - verifică dacă este corectă'] 
          : isLargeAmount 
          ? ['Sumă mare - verifică dacă este corectă'] 
          : [],
      };
    },
    [cellContext],
  );

  /**
   * Enhanced: Reset validation state la cleanup
   */
  const resetValidation = useCallback(() => {
    validation.reset();
  }, [validation]);

  return {
    // Form state management
    form: {
      data: formData,
      updateData: updateFormData,
      validate: validateForm,
      reset: resetValidation,
    },

    // Enhanced: Validare centralizată cu toate funcționalitățile
    validation: {
      errors: validation.state.errors,
      warnings: validation.state.warnings,
      hasErrors: validation.state.hasErrors,
      isValidating: validation.state.isValidating,
      setErrors: validation.setCustomError,
      clearError: validation.clearFieldError,
      clearAllErrors: validation.clearAllErrors,
      touchField: validation.touchField,
      validateAmount,
      validateDescription,
      validateField: validation.validateField,
    },

    // Loading state
    loading: {
      isLoading,
      setIsLoading,
    },

    // Enhanced calculations cu context
    calculations: {
      formatMoney,
      calculateFinancialImpact,
    },
  };
};
