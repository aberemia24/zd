import { useCallback, useState, useMemo } from 'react';
import { VALIDATION, VALIDATION_MESSAGES, VALIDATION_HELPERS } from '@budget-app/shared-constants/validation';
import { useErrorHandler } from './useErrorHandler';

/**
 * Tipuri de validare pentru identificarea contextului
 */
export type ValidationType = 
  | 'amount' 
  | 'text' 
  | 'percentage' 
  | 'date' 
  | 'description' 
  | 'category_name' 
  | 'subcategory_name';

/**
 * Rezultatul unei validări
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  hint?: string; // Pentru hint-uri de validare (ex: formaturi acceptate)
}

/**
 * Opțiuni pentru validatori personalizați
 */
export interface ValidationOptions {
  allowEmpty?: boolean;
  customMinLength?: number;
  customMaxLength?: number;
  customMin?: number;
  customMax?: number;
  allowZero?: boolean;
  context?: string; // Pentru logging enhanced
}

/**
 * State pentru validare cu feedback instant
 */
export interface ValidationState {
  errors: Record<string, string>;
  warnings: Record<string, string[]>;
  isValidating: boolean;
  hasErrors: boolean;
  touchedFields: Set<string>;
}

/**
 * Return type pentru useValidation hook
 */
export interface UseValidationReturn {
  /**
   * State-ul curent de validare
   */
  state: ValidationState;
  
  /**
   * Validează o singură valoare
   */
  validateField: (
    fieldName: string,
    value: string | number,
    type: ValidationType,
    options?: ValidationOptions
  ) => ValidationResult;
  
  /**
   * Validează multiple câmpuri simultan
   */
  validateForm: (
    fields: Array<{
      name: string;
      value: string | number;
      type: ValidationType;
      options?: ValidationOptions;
    }>
  ) => boolean;
  
  /**
   * Marchează un câmp ca fiind atins (pentru feedback instant)
   */
  touchField: (fieldName: string) => void;
  
  /**
   * Clearează erorile pentru un câmp specific
   */
  clearFieldError: (fieldName: string) => void;
  
  /**
   * Clearează toate erorile
   */
  clearAllErrors: () => void;
  
  /**
   * Resetează state-ul de validare
   */
  reset: () => void;
  
  /**
   * Setează o eroare customizată
   */
  setCustomError: (fieldName: string, error: string) => void;
  
  /**
   * Validatori specializați pentru tipuri comune
   */
  validators: {
    amount: (value: string | number, options?: ValidationOptions) => ValidationResult;
    text: (value: string, options?: ValidationOptions) => ValidationResult;
    percentage: (value: string | number, options?: ValidationOptions) => ValidationResult;
    date: (value: string, options?: ValidationOptions) => ValidationResult;
    description: (value: string, options?: ValidationOptions) => ValidationResult;
    categoryName: (value: string, options?: ValidationOptions) => ValidationResult;
  };
}

/**
 * Hook centralizat pentru validare cu feedback instant și error handling enhanced
 * 
 * FEATURES:
 * - Validatori pentru toate tipurile de date din aplicație
 * - Feedback instant cu state management optimizat
 * - Integration cu error handling enhanced
 * - Validări batch pentru formulare
 * - Suport pentru validări personalizate
 * - Warnings și contexte pentru UX îmbunătățit
 * 
 * @param componentName - Numele componentei pentru logging
 * @returns Obiect cu funcții și state pentru validare
 */
export function useValidation(componentName?: string): UseValidationReturn {
  const { handleError } = useErrorHandler({ componentName });

  // State pentru validare
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    warnings: {},
    isValidating: false,
    hasErrors: false,
    touchedFields: new Set(),
  });

  /**
   * Validator pentru sume monetare (amounts)
   */
  const validateAmount = useCallback((
    value: string | number, 
    options: ValidationOptions = {}
  ): ValidationResult => {
    const { 
      allowEmpty = false, 
      customMin, 
      customMax,
      allowZero = false
    } = options;
    
    const stringValue = String(value).trim();
    
    if (!stringValue) {
      return {
        isValid: allowEmpty,
        error: allowEmpty ? undefined : VALIDATION_MESSAGES.EMPTY_VALUE
      };
    }
    
    if (!VALIDATION_HELPERS.isValidNumber(stringValue)) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.INVALID_AMOUNT
      };
    }
    
    const numValue = parseFloat(stringValue);
    
    const minAllowed = allowZero ? 0 : 0.01;
    if (numValue < minAllowed) {
      return {
        isValid: false,
        error: allowZero 
          ? 'Suma nu poate fi negativă' 
          : VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE
      };
    }
    
    // Check custom or default min/max
    const minValue = customMin ?? VALIDATION.AMOUNT_MIN;
    const maxValue = customMax ?? VALIDATION.AMOUNT_MAX;
    
    if (numValue < minValue) {
      return {
        isValid: false,
        error: customMin 
          ? `Suma trebuie să fie cel puțin ${minValue} RON`
          : VALIDATION_MESSAGES.AMOUNT_TOO_SMALL
      };
    }
    
    if (numValue > maxValue) {
      return {
        isValid: false,
        error: customMax 
          ? `Suma nu poate depăși ${maxValue.toLocaleString('ro-RO')} RON`
          : VALIDATION_MESSAGES.AMOUNT_TOO_LARGE
      };
    }
    
    // Add warnings for very large amounts
    const warnings: string[] = [];
    if (numValue > 100000) {
      warnings.push('Sumă foarte mare - verifică dacă este corectă');
    }
    
    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }, []);

  /**
   * Validator pentru text general
   */
  const validateText = useCallback((
    value: string, 
    options: ValidationOptions = {}
  ): ValidationResult => {
    const { 
      allowEmpty = false, 
      customMinLength, 
      customMaxLength 
    } = options;
    
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      return {
        isValid: allowEmpty,
        error: allowEmpty ? undefined : VALIDATION_MESSAGES.EMPTY_VALUE
      };
    }
    
    const minLength = customMinLength ?? VALIDATION.TEXT_MIN_LENGTH;
    const maxLength = customMaxLength ?? VALIDATION.TEXT_MAX_LENGTH;
    
    if (trimmedValue.length < minLength) {
      return {
        isValid: false,
        error: customMinLength 
          ? `Textul trebuie să aibă minim ${minLength} caractere`
          : VALIDATION_MESSAGES.TEXT_TOO_SHORT
      };
    }
    
    if (trimmedValue.length > maxLength) {
      return {
        isValid: false,
        error: customMaxLength 
          ? `Textul nu poate depăși ${maxLength} caractere`
          : VALIDATION_MESSAGES.TEXT_TOO_LONG
      };
    }
    
    return { isValid: true };
  }, []);

  /**
   * Validator pentru procente
   */
  const validatePercentage = useCallback((
    value: string | number, 
    options: ValidationOptions = {}
  ): ValidationResult => {
    const { allowEmpty = false, customMin, customMax } = options;
    
    const stringValue = String(value).trim();
    
    if (!stringValue) {
      return {
        isValid: allowEmpty,
        error: allowEmpty ? undefined : VALIDATION_MESSAGES.EMPTY_VALUE
      };
    }
    
    if (!VALIDATION_HELPERS.isValidNumber(stringValue)) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.INVALID_PERCENTAGE
      };
    }
    
    const numValue = parseFloat(stringValue);
    const minValue = customMin ?? VALIDATION.PERCENTAGE_MIN;
    const maxValue = customMax ?? VALIDATION.PERCENTAGE_MAX;
    
    if (numValue < minValue || numValue > maxValue) {
      return {
        isValid: false,
        error: customMin || customMax
          ? `Procentul trebuie să fie între ${minValue} și ${maxValue}`
          : VALIDATION_MESSAGES.PERCENTAGE_OUT_OF_RANGE
      };
    }
    
    return { isValid: true };
  }, []);

  /**
   * Validator pentru date
   */
  const validateDate = useCallback((
    value: string, 
    options: ValidationOptions = {}
  ): ValidationResult => {
    const { allowEmpty = false } = options;
    
    if (!value.trim()) {
      return {
        isValid: allowEmpty,
        error: allowEmpty ? undefined : VALIDATION_MESSAGES.DATE_REQUIRED
      };
    }
    
    if (!VALIDATION_HELPERS.isValidDate(value)) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.INVALID_DATE
      };
    }
    
    // Check if date is not in the future (warning)
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const warnings: string[] = [];
    if (inputDate > today) {
      warnings.push('Data este în viitor - verifică dacă este corectă');
    }
    
    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }, []);

  /**
   * Validator pentru descrieri
   */
  const validateDescription = useCallback((
    value: string, 
    options: ValidationOptions = {}
  ): ValidationResult => {
    const { allowEmpty = true } = options; // Descriptions sunt opționale de obicei
    
    if (!value.trim()) {
      return {
        isValid: allowEmpty,
        error: allowEmpty ? undefined : VALIDATION_MESSAGES.EMPTY_VALUE
      };
    }
    
    // Verifică lungimea
    if (value.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG
      };
    }
    
    // Verifică caracterele interzise
    const hasForbiddenChars = VALIDATION.FORBIDDEN_DESCRIPTION_CHARS.some(char => 
      value.includes(char)
    );
    
    if (hasForbiddenChars) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.DESCRIPTION_INVALID_CHARS,
        hint: VALIDATION_MESSAGES.DESCRIPTION_VALIDATION_HINT
      };
    }
    
    // Pattern validation pentru caractere permise
    if (!VALIDATION.DESCRIPTION_PATTERN.test(value)) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.DESCRIPTION_INVALID_CHARS,
        hint: VALIDATION_MESSAGES.DESCRIPTION_VALIDATION_HINT
      };
    }
    
    // Warnings pentru descrieri foarte lungi (75% din limită)
    const warnings: string[] = [];
    const warningThreshold = Math.floor(VALIDATION.DESCRIPTION_MAX_LENGTH * 0.75);
    if (value.length > warningThreshold) {
      warnings.push(`Descrierea aproape de limită (${value.length}/${VALIDATION.DESCRIPTION_MAX_LENGTH} caractere)`);
    }
    
    return { 
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }, []);

  /**
   * Validator pentru nume categorii și subcategorii
   */
  const validateCategoryName = useCallback((
    value: string, 
    options: ValidationOptions = {}
  ): ValidationResult => {
    const { allowEmpty = false } = options;
    
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      return {
        isValid: allowEmpty,
        error: allowEmpty ? undefined : VALIDATION_MESSAGES.CATEGORY_NAME_REQUIRED
      };
    }
    
    if (trimmedValue.length < VALIDATION.CATEGORY_NAME_MIN_LENGTH) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.CATEGORY_NAME_TOO_SHORT
      };
    }
    
    if (trimmedValue.length > VALIDATION.CATEGORY_NAME_MAX_LENGTH) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.CATEGORY_NAME_TOO_LONG
      };
    }
    
    return { isValid: true };
  }, []);

  /**
   * Validatori specializați memoizați
   */
  const validators = useMemo(() => ({
    amount: validateAmount,
    text: validateText,
    percentage: validatePercentage,
    date: validateDate,
    description: validateDescription,
    categoryName: validateCategoryName,
  }), [validateAmount, validateText, validatePercentage, validateDate, validateDescription, validateCategoryName]);

  /**
   * Validează un singur câmp și actualizează state-ul
   */
  const validateField = useCallback((
    fieldName: string,
    value: string | number,
    type: ValidationType,
    options: ValidationOptions = {}
  ): ValidationResult => {
    let result: ValidationResult;
    
    try {
      // Selectează validatorul potrivit
      switch (type) {
        case 'amount':
          result = validators.amount(value, options);
          break;
        case 'text':
          result = validators.text(String(value), options);
          break;
        case 'percentage':
          result = validators.percentage(value, options);
          break;
        case 'date':
          result = validators.date(String(value), options);
          break;
        case 'description':
          result = validators.description(String(value), options);
          break;
        case 'category_name':
        case 'subcategory_name':
          result = validators.categoryName(String(value), options);
          break;
        default:
          result = { isValid: true };
      }
      
      // Actualizează state-ul
      setValidationState(prev => {
        const newErrors = { ...prev.errors };
        const newWarnings = { ...prev.warnings };
        
        if (result.error) {
          newErrors[fieldName] = result.error;
        } else {
          delete newErrors[fieldName];
        }
        
        if (result.warnings && result.warnings.length > 0) {
          newWarnings[fieldName] = result.warnings;
        } else {
          delete newWarnings[fieldName];
        }
        
        const hasErrors = Object.keys(newErrors).length > 0;
        
        return {
          ...prev,
          errors: newErrors,
          warnings: newWarnings,
          hasErrors,
        };
      });
      
    } catch (error) {
      // Error handling enhanced pentru probleme de validare
      handleError(error, `validate_field_${type}`, {
        additionalData: {
          fieldName,
          value,
          type,
          options
        }
      });
      
      result = {
        isValid: false,
        error: 'Eroare la validare. Încearcă din nou.'
      };
    }
    
    return result;
  }, [validators, handleError]);

  /**
   * Validează un formular complet
   */
  const validateForm = useCallback((
    fields: Array<{
      name: string;
      value: string | number;
      type: ValidationType;
      options?: ValidationOptions;
    }>
  ): boolean => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      let isFormValid = true;
      
      // Validează toate câmpurile
      fields.forEach(field => {
        const result = validateField(field.name, field.value, field.type, field.options);
        if (!result.isValid) {
          isFormValid = false;
        }
      });
      
      return isFormValid;
      
    } catch (error) {
      handleError(error, 'validate_form', {
        additionalData: { fieldsCount: fields.length }
      });
      return false;
    } finally {
      setValidationState(prev => ({ ...prev, isValidating: false }));
    }
  }, [validateField, handleError]);

  /**
   * Marchează un câmp ca fiind atins
   */
  const touchField = useCallback((fieldName: string) => {
    setValidationState(prev => ({
      ...prev,
      touchedFields: new Set([...prev.touchedFields, fieldName])
    }));
  }, []);

  /**
   * Clearează eroarea pentru un câmp specific
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setValidationState(prev => {
      const newErrors = { ...prev.errors };
      const newWarnings = { ...prev.warnings };
      delete newErrors[fieldName];
      delete newWarnings[fieldName];
      
      return {
        ...prev,
        errors: newErrors,
        warnings: newWarnings,
        hasErrors: Object.keys(newErrors).length > 0
      };
    });
  }, []);

  /**
   * Clearează toate erorile
   */
  const clearAllErrors = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      errors: {},
      warnings: {},
      hasErrors: false
    }));
  }, []);

  /**
   * Resetează complet state-ul de validare
   */
  const reset = useCallback(() => {
    setValidationState({
      errors: {},
      warnings: {},
      isValidating: false,
      hasErrors: false,
      touchedFields: new Set(),
    });
  }, []);

  /**
   * Setează o eroare customizată
   */
  const setCustomError = useCallback((fieldName: string, error: string) => {
    setValidationState(prev => ({
      ...prev,
      errors: { ...prev.errors, [fieldName]: error },
      hasErrors: true
    }));
  }, []);

  return {
    state: validationState,
    validateField,
    validateForm,
    touchField,
    clearFieldError,
    clearAllErrors,
    reset,
    setCustomError,
    validators,
  };
} 
