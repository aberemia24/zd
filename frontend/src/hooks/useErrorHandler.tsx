import { useCallback, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  errorHandler, 
  ErrorType, 
  ErrorSeverity, 
  ErrorContext, 
  EnhancedError,
  withErrorHandling
} from '../utils/errorHandling';

/**
 * Opțiuni pentru error handling în hook
 */
interface UseErrorHandlerOptions {
  componentName?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  defaultToastDuration?: number;
}

/**
 * Return type pentru useErrorHandler hook
 */
interface UseErrorHandlerReturn {
  /**
   * Procesează și afișează o eroare cu context automat
   */
  handleError: (
    error: Error | unknown,
    operation: string,
    additionalContext?: Partial<ErrorContext>
  ) => EnhancedError;

  /**
   * Creează rapid o eroare de validare
   */
  createValidationError: (
    message: string,
    operation: string,
    fieldName?: string
  ) => EnhancedError;

  /**
   * Creează rapid o eroare business logic
   */
  createBusinessError: (
    message: string,
    operation: string,
    additionalData?: Record<string, unknown>
  ) => EnhancedError;

  /**
   * Wrapper pentru funcții async cu error handling automat
   */
  withErrorHandling: <T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    operation: string
  ) => (...args: T) => Promise<R>;

  /**
   * Handler specific pentru mutation errors
   */
  handleMutationError: (
    error: Error | unknown,
    mutationType: 'create' | 'update' | 'delete',
    entityType: string
  ) => EnhancedError;

  /**
   * Handler specific pentru query errors
   */
  handleQueryError: (
    error: Error | unknown,
    queryType: string,
    entityType: string
  ) => EnhancedError;

  /**
   * Procesează multiple erori (ex: validări de formular)
   */
  handleMultipleErrors: (
    errors: Array<{ error: Error | unknown; operation: string; field?: string }>,
    groupOperation: string
  ) => EnhancedError[];
}

/**
 * Hook React pentru error handling centralizat
 * 
 * FEATURES:
 * - Context automat cu user ID și component name
 * - Helper-e specializate pentru mutations și queries  
 * - Toast integration configurabilă
 * - Logging structurat automat
 * - Wrapper pentru funcții async
 * 
 * @param options - Configurare pentru comportamentul error handler-ului
 * @returns Obiect cu funcții pentru error handling
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const { user } = useAuthStore();
  const optionsRef = useRef(options);
  
  // Update options ref pentru optimizare
  optionsRef.current = options;

  /**
   * Procesează și afișează o eroare cu context automat
   */
  const handleError = useCallback((
    error: Error | unknown,
    operation: string,
    additionalContext?: Partial<ErrorContext>
  ): EnhancedError => {
    const context: Partial<ErrorContext> = {
      operation,
      component: optionsRef.current.componentName,
      userId: user?.id,
      ...additionalContext
    };

    const errorOptions = {
      showToast: optionsRef.current.showToast ?? true,
      logToConsole: optionsRef.current.logToConsole ?? true,
      duration: optionsRef.current.defaultToastDuration ?? 4000
    };

    return errorHandler.handleError(error, context, errorOptions);
  }, [user?.id]);

  /**
   * Creează rapid o eroare de validare
   */
  const createValidationError = useCallback((
    message: string,
    operation: string,
    fieldName?: string
  ): EnhancedError => {
    return errorHandler.createValidationError(
      message, 
      operation, 
      optionsRef.current.componentName,
      fieldName
    );
  }, []);

  /**
   * Creează rapid o eroare business logic
   */
  const createBusinessError = useCallback((
    message: string,
    operation: string,
    additionalData?: Record<string, unknown>
  ): EnhancedError => {
    return errorHandler.createBusinessError(
      message,
      operation,
      optionsRef.current.componentName,
      additionalData
    );
  }, []);

  /**
   * Wrapper pentru funcții async cu error handling automat
   */
  const wrappedWithErrorHandling = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    operation: string
  ) => {
    return withErrorHandling(fn, {
      operation,
      component: optionsRef.current.componentName,
      userId: user?.id
    });
  }, [user?.id]);

  /**
   * Handler specific pentru mutation errors
   */
  const handleMutationError = useCallback((
    error: Error | unknown,
    mutationType: 'create' | 'update' | 'delete',
    entityType: string
  ): EnhancedError => {
    return handleError(error, `${mutationType}_${entityType}`, {
      additionalData: {
        mutationType,
        entityType,
        isMutation: true
      }
    });
  }, [handleError]);

  /**
   * Handler specific pentru query errors
   */
  const handleQueryError = useCallback((
    error: Error | unknown,
    queryType: string,
    entityType: string
  ): EnhancedError => {
    return handleError(error, `query_${queryType}_${entityType}`, {
      additionalData: {
        queryType,
        entityType,
        isQuery: true
      }
    });
  }, [handleError]);

  /**
   * Procesează multiple erori (ex: validări de formular)
   */
  const handleMultipleErrors = useCallback((
    errors: Array<{ error: Error | unknown; operation: string; field?: string }>,
    groupOperation: string
  ): EnhancedError[] => {
    const enhancedErrors = errors.map((errorItem, index) => {
      return handleError(errorItem.error, errorItem.operation, {
        additionalData: {
          groupOperation,
          errorIndex: index,
          field: errorItem.field,
          isMultipleErrors: true,
          totalErrors: errors.length
        }
      });
    });

    // Log summary pentru multiple errors
    if (optionsRef.current.logToConsole !== false) {
      console.group(`📋 [MULTIPLE ERRORS] ${groupOperation}`);
      console.info(`Total errors: ${enhancedErrors.length}`);
      enhancedErrors.forEach((err, index) => {
        console.info(`${index + 1}. ${err.type}: ${err.message}`);
      });
      console.groupEnd();
    }

    return enhancedErrors;
  }, [handleError]);

  return {
    handleError,
    createValidationError,
    createBusinessError,
    withErrorHandling: wrappedWithErrorHandling,
    handleMutationError,
    handleQueryError,
    handleMultipleErrors
  };
}

/**
 * Hook specialized pentru React Query mutations cu error handling automat
 */
export function useMutationErrorHandler(
  mutationType: 'create' | 'update' | 'delete',
  entityType: string,
  componentName?: string
) {
  const { handleMutationError } = useErrorHandler({ componentName });

  return useCallback((error: Error | unknown) => {
    return handleMutationError(error, mutationType, entityType);
  }, [handleMutationError, mutationType, entityType]);
}

/**
 * Hook specialized pentru React Query queries cu error handling automat
 */
export function useQueryErrorHandler(
  queryType: string,
  entityType: string,
  componentName?: string
) {
  const { handleQueryError } = useErrorHandler({ componentName });

  return useCallback((error: Error | unknown) => {
    return handleQueryError(error, queryType, entityType);
  }, [handleQueryError, queryType, entityType]);
} 
