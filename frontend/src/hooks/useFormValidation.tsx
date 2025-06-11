import { useForm, UseFormProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { VALIDATION_MESSAGES, VALIDATION } from '@budget-app/shared-constants';

/**
 * Proprietăți pentru hookul de validare formular
 */
export interface UseFormValidationProps<TFieldValues extends FieldValues> extends UseFormProps<TFieldValues> {
  schema?: z.ZodSchema<TFieldValues>;
  onSubmitSuccess?: (data: TFieldValues) => Promise<void> | void;
  onSubmitError?: (error: Error) => void;
}

/**
 * Rezultatul hookului de validare formular
 */
export interface UseFormValidationReturn<TFieldValues extends FieldValues> extends UseFormReturn<TFieldValues> {
  /**
   * Handler pentru submit cu error handling integrat
   */
  handleFormSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  
  /**
   * Helper pentru a obține props pentru Input component
   */
  getInputProps: (name: Path<TFieldValues>) => {
    error?: string;
    success?: string;
    hint?: string;
  };
  
  /**
   * Helper pentru a obține props pentru Select component
   */
  getSelectProps: (name: Path<TFieldValues>) => {
    error?: string;
    success?: string;
    hint?: string;
  };
  
  /**
   * Helper pentru a obține props pentru Checkbox component
   */
  getCheckboxProps: (name: Path<TFieldValues>) => {
    error?: string;
    success?: string;
    hint?: string;
  };
  
  /**
   * Helper pentru a obține props pentru Textarea component
   */
  getTextareaProps: (name: Path<TFieldValues>) => {
    error?: string;
    success?: string;
    hint?: string;
  };
  
  /**
   * Determină dacă formularul este valid pentru submit
   */
  isFormValid: boolean;
  
  /**
   * Determină dacă formularul se află în proces de submit
   */
  isSubmitting: boolean;
}

/**
 * Schema de validare pentru tranzacții
 */
export const transactionSchema = z.object({
  type: z.string().min(1, VALIDATION_MESSAGES.EMPTY_VALUE),
  amount: z.string()
    .min(1, VALIDATION_MESSAGES.AMOUNT_REQUIRED)
    .refine((val) => !isNaN(parseFloat(val)), VALIDATION_MESSAGES.AMOUNT_MUST_BE_NUMBER)
    .refine((val) => parseFloat(val) > 0, VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE)
    .refine((val) => parseFloat(val) >= VALIDATION.AMOUNT_MIN, VALIDATION_MESSAGES.AMOUNT_TOO_SMALL)
    .refine((val) => parseFloat(val) <= VALIDATION.AMOUNT_MAX, VALIDATION_MESSAGES.AMOUNT_TOO_LARGE),
  category: z.string().min(1, VALIDATION_MESSAGES.EMPTY_VALUE),
  subcategory: z.string().optional(),
  date: z.string()
    .min(1, VALIDATION_MESSAGES.EMPTY_VALUE)
    .refine((val) => VALIDATION.DATE_REGEX.test(val), 'Data introdusă nu este validă. Folosiți formatul YYYY-MM-DD'),
  description: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.string().optional(),
}).refine((data) => {
  // Dacă este recurring, frequency este obligatoriu
  if (data.recurring && !data.frequency) {
    return false;
  }
  return true;
}, {
  message: 'Frecvența este obligatorie pentru tranzacțiile recurente',
  path: ['frequency']
});

/**
 * Schema de validare pentru autentificare
 */
export const authSchema = z.object({
  email: z.string()
    .min(1, 'Email-ul este obligatoriu')
    .email('Format email invalid'),
  password: z.string()
    .min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Verifică dacă parolele se potrivesc (pentru register)
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Parolele nu se potrivesc',
  path: ['confirmPassword']
});

/**
 * Hook pentru integrarea React Hook Form cu componentele CVA v2
 * 
 * @param props - Configurație pentru formular
 * @returns Obiect cu funcții și state pentru gestionarea formularului
 */
export function useFormValidation<TFieldValues extends FieldValues = FieldValues>(
  props: UseFormValidationProps<TFieldValues>
): UseFormValidationReturn<TFieldValues> {
  const {
    schema,
    onSubmitSuccess,
    onSubmitError,
    ...formProps
  } = props;

  // Configurăm React Hook Form
  const form = useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onChange', // Validare în timp real
    reValidateMode: 'onChange',
    ...formProps,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    clearErrors,
  } = form;

  // Helper pentru props de validare pentru Input
  const getInputProps = useCallback((name: Path<TFieldValues>) => {
    const error = errors[name];
    return {
      error: error?.message as string | undefined,
      success: !error && isDirty ? undefined : undefined, // Se poate customiza pentru success states
      hint: undefined, // Se poate customiza pentru hints
    };
  }, [errors, isDirty]);

  // Helper pentru props de validare pentru Select
  const getSelectProps = useCallback((name: Path<TFieldValues>) => {
    return getInputProps(name);
  }, [getInputProps]);

  // Helper pentru props de validare pentru Checkbox
  const getCheckboxProps = useCallback((name: Path<TFieldValues>) => {
    return getInputProps(name);
  }, [getInputProps]);

  // Helper pentru props de validare pentru Textarea
  const getTextareaProps = useCallback((name: Path<TFieldValues>) => {
    return getInputProps(name);
  }, [getInputProps]);

  // Handler pentru submit cu error handling
  const handleFormSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    
    try {
      await handleSubmit(async (data) => {
        try {
          await onSubmitSuccess?.(data);
          // Opțional: clearează erorile după submit reușit
          clearErrors();
        } catch (error) {
          const submitError = error instanceof Error ? error : new Error('Eroare la salvarea datelor');
          onSubmitError?.(submitError);
          throw submitError;
        }
      })();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [handleSubmit, onSubmitSuccess, onSubmitError, clearErrors]);

  // Determină validitatea formularului
  const isFormValid = useMemo(() => {
    return isValid && isDirty;
  }, [isValid, isDirty]);

  return {
    ...form,
    handleFormSubmit,
    getInputProps,
    getSelectProps,
    getCheckboxProps,
    getTextareaProps,
    isFormValid,
    isSubmitting,
  };
}

/**
 * Type-safe hooks pentru scheme specifice
 */
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type AuthFormData = z.infer<typeof authSchema>;

export const useTransactionForm = (props?: Omit<UseFormValidationProps<TransactionFormData>, 'schema'>) => {
  return useFormValidation<TransactionFormData>({
    ...props,
    schema: transactionSchema,
  });
};

export const useAuthForm = (props?: Omit<UseFormValidationProps<AuthFormData>, 'schema'>) => {
  return useFormValidation<AuthFormData>({
    ...props,
    schema: authSchema,
  });
}; 
