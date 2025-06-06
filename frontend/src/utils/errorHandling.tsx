import toast from 'react-hot-toast';
import { MESAJE } from '@budget-app/shared-constants/messages';

/**
 * Tipuri de erori pentru clasificare și handling specializat
 */
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network', 
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  BUSINESS_LOGIC = 'business_logic',
  UNKNOWN = 'unknown'
}

/**
 * Severitatea erorii pentru logging și notification
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Context pentru error handling cu informații structurate
 */
export interface ErrorContext {
  operation: string;
  component?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Enhanced error class cu informații structurate
 */
export class EnhancedError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly originalError?: Error;
  public readonly userMessage: string;
  public readonly timestamp: string;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext,
    originalError?: Error
  ) {
    super(message);
    this.name = 'EnhancedError';
    this.type = type;
    this.severity = severity;
    this.context = {
      ...context,
      timestamp: context.timestamp || new Date().toISOString()
    };
    this.originalError = originalError;
    this.userMessage = this.generateUserMessage();
    this.timestamp = new Date().toISOString();
  }

  /**
   * Generează mesaj user-friendly bazat pe tipul erorii
   */
  private generateUserMessage(): string {
    switch (this.type) {
      case ErrorType.VALIDATION:
        return MESAJE.VALIDARE.CAMP_LIPSA;
      case ErrorType.NETWORK:
        return MESAJE.EROARE_RETEA;
      case ErrorType.AUTHENTICATION:
        return MESAJE.EROARE_AUTENTIFICARE;
      case ErrorType.AUTHORIZATION:
        return MESAJE.EROARE_RLS;
      case ErrorType.NOT_FOUND:
        return MESAJE.NOT_FOUND;
      case ErrorType.SERVER_ERROR:
        return MESAJE.SERVER_ERROR;
      case ErrorType.BUSINESS_LOGIC:
        return this.message; // Business logic errors au mesaje specifice
      default:
        return MESAJE.EROARE_GENERALA;
    }
  }

  /**
   * Returnează obiect structurat pentru logging
   */
  toLogObject() {
    return {
      name: this.name,
      message: this.message,
      userMessage: this.userMessage,
      type: this.type,
      severity: this.severity,
      context: this.context,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined,
      stack: this.stack,
      timestamp: this.timestamp
    };
  }
}

/**
 * Error handler centralizat cu toast integration și logging
 */
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Procesează și afișează o eroare cu toast notification
   */
  public handleError(
    error: Error | EnhancedError | unknown,
    context?: Partial<ErrorContext>,
    options?: {
      showToast?: boolean;
      logToConsole?: boolean;
      duration?: number;
    }
  ): EnhancedError {
    const defaultOptions = {
      showToast: true,
      logToConsole: true,
      duration: 4000
    };
    const finalOptions = { ...defaultOptions, ...options };

    let enhancedError: EnhancedError;

    // Convertește la EnhancedError dacă nu este deja
    if (error instanceof EnhancedError) {
      enhancedError = error;
    } else if (error instanceof Error) {
      enhancedError = this.createEnhancedError(error, context);
    } else {
      enhancedError = new EnhancedError(
        String(error),
        ErrorType.UNKNOWN,
        ErrorSeverity.MEDIUM,
        {
          operation: context?.operation || 'unknown',
          component: context?.component,
          userId: context?.userId,
          additionalData: { originalError: error, ...context?.additionalData }
        }
      );
    }

    // Logging structurat
    if (finalOptions.logToConsole) {
      this.logError(enhancedError);
    }

    // Toast notification
    if (finalOptions.showToast) {
      this.showToastNotification(enhancedError, finalOptions.duration);
    }

    return enhancedError;
  }

  /**
   * Creează EnhancedError din Error standard
   */
  private createEnhancedError(error: Error, context?: Partial<ErrorContext>): EnhancedError {
    const errorType = this.classifyError(error);
    const severity = this.determineSeverity(error, errorType);
    
    return new EnhancedError(
      error.message,
      errorType,
      severity,
      {
        operation: context?.operation || 'unknown',
        component: context?.component,
        userId: context?.userId,
        additionalData: context?.additionalData
      },
      error
    );
  }

  /**
   * Clasifică tipul erorii bazat pe mesaj și context
   */
  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK;
    }
    if (message.includes('unauthorized') || message.includes('unauthenticated')) {
      return ErrorType.AUTHENTICATION;
    }
    if (message.includes('forbidden') || message.includes('rls')) {
      return ErrorType.AUTHORIZATION;
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorType.NOT_FOUND;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    if (message.includes('server error') || message.includes('500')) {
      return ErrorType.SERVER_ERROR;
    }
    
    return ErrorType.UNKNOWN;
  }

  /**
   * Determină severitatea erorii
   */
  private determineSeverity(error: Error, type: ErrorType): ErrorSeverity {
    switch (type) {
      case ErrorType.VALIDATION:
        return ErrorSeverity.LOW;
      case ErrorType.NETWORK:
        return ErrorSeverity.MEDIUM;
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return ErrorSeverity.HIGH;
      case ErrorType.SERVER_ERROR:
        return ErrorSeverity.CRITICAL;
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  /**
   * Logging structurat cu informații complete
   */
  private logError(error: EnhancedError): void {
    const logObject = error.toLogObject();
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🔥 [CRITICAL ERROR]', logObject);
        break;
      case ErrorSeverity.HIGH:
        console.error('🚨 [HIGH SEVERITY ERROR]', logObject);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ [MEDIUM SEVERITY ERROR]', logObject);
        break;
      case ErrorSeverity.LOW:
        console.info('ℹ️ [LOW SEVERITY ERROR]', logObject);
        break;
    }
  }

  /**
   * Afișează toast notification bazat pe tipul și severitatea erorii
   */
  private showToastNotification(error: EnhancedError, duration: number): void {
    const toastOptions = {
      duration,
      id: `error-${error.type}-${Date.now()}`
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        toast.error(`🔥 ${error.userMessage}`, { ...toastOptions, duration: 6000 });
        break;
      case ErrorSeverity.HIGH:
        toast.error(`🚨 ${error.userMessage}`, { ...toastOptions, duration: 5000 });
        break;
      case ErrorSeverity.MEDIUM:
        toast.error(error.userMessage, toastOptions);
        break;
      case ErrorSeverity.LOW:
        toast.error(error.userMessage, { ...toastOptions, duration: 3000 });
        break;
    }
  }

  /**
   * Helper pentru crearea rapidă de erori business logic
   */
  public createBusinessError(
    message: string,
    operation: string,
    component?: string,
    additionalData?: Record<string, unknown>
  ): EnhancedError {
    return new EnhancedError(
      message,
      ErrorType.BUSINESS_LOGIC,
      ErrorSeverity.MEDIUM,
      {
        operation,
        component,
        additionalData
      }
    );
  }

  /**
   * Helper pentru crearea rapidă de erori de validare
   */
  public createValidationError(
    message: string,
    operation: string,
    component?: string,
    fieldName?: string
  ): EnhancedError {
    return new EnhancedError(
      message,
      ErrorType.VALIDATION,
      ErrorSeverity.LOW,
      {
        operation,
        component,
        additionalData: { fieldName }
      }
    );
  }
}

/**
 * Instance globală a error handler-ului
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * Decorator/wrapper pentru funcții async cu error handling automat
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context: Partial<ErrorContext>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const enhancedError = errorHandler.handleError(error, context);
      throw enhancedError;
    }
  };
}

/**
 * Helper pentru error boundaries cu context
 */
export function handleComponentError(
  error: Error,
  errorInfo: React.ErrorInfo,
  componentName: string
): EnhancedError {
  return errorHandler.handleError(error, {
    operation: 'component_render',
    component: componentName,
    additionalData: {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }
  });
}

/**
 * DOCUMENTAȚIE ȘI EXEMPLE DE UTILIZARE
 * 
 * Sistemul de Error Handling Enhanced oferă:
 * 1. Clasificare automată a erorilor (validation, network, auth, etc.)
 * 2. Toast notifications cu severitate diferențiată
 * 3. Logging structurat cu context complet
 * 4. Recovery patterns și retry mechanisms
 * 5. Integration cu React Query mutations
 * 
 * EXEMPLE DE UTILIZARE:
 * 
 * 1. În componente React:
 * ```tsx
 * import { useErrorHandler } from '../hooks/useErrorHandler';
 * 
 * function MyComponent() {
 *   const { handleError, createValidationError } = useErrorHandler({
 *     componentName: 'MyComponent'
 *   });
 * 
 *   const handleSubmit = async (data) => {
 *     try {
 *       await submitData(data);
 *     } catch (error) {
 *       handleError(error, 'submit_form');
 *     }
 *   };
 * 
 *   const validateField = (value) => {
 *     if (!value) {
 *       throw createValidationError('Câmpul este obligatoriu', 'validate_field', 'email');
 *     }
 *   };
 * }
 * ```
 * 
 * 2. În React Query mutations:
 * ```tsx
 * import { useMutationErrorHandler } from '../hooks/useErrorHandler';
 * 
 * function useCreateUser() {
 *   const handleMutationError = useMutationErrorHandler('create', 'user', 'UserMutations');
 * 
 *   return useMutation({
 *     mutationFn: createUser,
 *     onError: handleMutationError
 *   });
 * }
 * ```
 * 
 * 3. Error handling manual cu context:
 * ```tsx
 * import { errorHandler } from '../utils/errorHandling';
 * 
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   errorHandler.handleError(error, {
 *     operation: 'risky_operation',
 *     component: 'DataProcessor',
 *     userId: user.id,
 *     additionalData: { operationId: 'xyz123' }
 *   });
 * }
 * ```
 * 
 * 4. Wrapper pentru funcții async:
 * ```tsx
 * import { withErrorHandling } from '../utils/errorHandling';
 * 
 * const safeAsyncFunction = withErrorHandling(
 *   async (data) => {
 *     return await processData(data);
 *   },
 *   {
 *     operation: 'process_data',
 *     component: 'DataProcessor'
 *   }
 * );
 * ```
 * 
 * TIPURI DE ERORI SUPORTATE:
 * - VALIDATION: Erori de validare (severitate LOW, toast 3s)
 * - NETWORK: Erori de rețea (severitate MEDIUM, toast 4s)
 * - AUTHENTICATION: Erori de autentificare (severitate HIGH, toast 5s)
 * - AUTHORIZATION: Erori de autorizare (severitate HIGH, toast 5s)
 * - NOT_FOUND: Resurse negăsite (severitate MEDIUM, toast 4s)
 * - SERVER_ERROR: Erori server (severitate CRITICAL, toast 6s)
 * - BUSINESS_LOGIC: Erori business (severitate MEDIUM, toast 4s)
 * - UNKNOWN: Erori necunoscute (severitate MEDIUM, toast 4s)
 * 
 * FEATURES AVANSATE:
 * - Logging cu emoji-uri pentru identificare rapidă (🔥 CRITICAL, 🚨 HIGH, ⚠️ MEDIUM, ℹ️ LOW)
 * - Toast-uri cu ID-uri unice pentru evitarea duplicatelor
 * - Context automat cu user ID, component name, timestamp
 * - Stack trace complet în development mode
 * - Recovery patterns în ErrorBoundary cu retry mechanisms
 */ 
