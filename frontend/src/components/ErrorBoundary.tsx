import React from "react";
import { MESAJE } from "@shared-constants";

// CVA styling imports - UNIFIED MIGRATION
import { cn, button } from "../styles/cva/unified-cva";

import Alert from "./primitives/Alert/Alert";
import { handleComponentError, EnhancedError } from "../utils/errorHandling";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Nume personalizat pentru componentă (pentru logging)
   */
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: EnhancedError | null;
}

/**
 * Enhanced Error Boundary cu sistem centralizat de error handling
 * 
 * FEATURES:
 * - Logging structurat cu context complet
 * - Clasificare automată a erorilor
 * - Toast notifications pentru developeri (poate fi disabled în producție)
 * - Recovery capabilities și retry mechanisms
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryCount: number = 0;
  private readonly maxRetries: number = 2;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || 'UnknownComponent';
    
    // Folosește noul sistem enhanced de error handling
    const enhancedError = handleComponentError(error, errorInfo, componentName);
    
    // Actualizează state-ul cu enhanced error
    this.setState({ error: enhancedError });

    // În development, afișează și în console detaliile complete
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 [ERROR BOUNDARY] Complete Error Details');
      console.error('Original Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Enhanced Error:', enhancedError.toLogObject());
      console.groupEnd();
    }
  }

  /**
   * Încercă să recupereze din eroare prin remounting
   */
  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: null });
      
      // Log retry attempt
      console.info(`🔄 [ERROR BOUNDARY] Retry attempt ${this.retryCount}/${this.maxRetries} for component ${this.props.componentName || 'Unknown'}`);
    }
  };

  /**
   * Reset error boundary (pentru recovery externă)
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.children !== this.props.children) {
      // Props s-au schimbat, poate fi safe să resetez
      this.setState({ hasError: false, error: null });
      this.retryCount = 0;
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const canRetry = this.retryCount < this.maxRetries;
      
      return (
        <div className="error-boundary-container p-4">
          <Alert
            variant="error"
            title={MESAJE.EROARE_TITLU}
            className="my-8"
            data-testid="error-boundary-alert"
          >
            {this.state.error.userMessage}
          </Alert>
          
          {/* Recovery Controls */}
          <div className="mt-4 flex gap-4 justify-center">
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className={cn(
                  button({ variant: "primary", size: "md" }),
                  "transition-colors"
                )}
                data-testid="error-boundary-retry"
              >
                🔄 Încearcă din nou ({this.maxRetries - this.retryCount} încercări rămase)
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className={cn(
                button({ variant: "secondary", size: "md" }),
                "transition-colors"
              )}
              data-testid="error-boundary-reload"
            >
              🔄 Reîncarcă pagina
            </button>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-gray-100 rounded-lg">
              <summary className="cursor-pointer font-semibold text-gray-700">
                🔍 Detalii tehnice pentru dezvoltatori
              </summary>
              <div className="mt-4 space-y-2">
                <p><strong>Tip eroare:</strong> {this.state.error.type}</p>
                <p><strong>Severitate:</strong> {this.state.error.severity}</p>
                <p><strong>Operație:</strong> {this.state.error.context.operation}</p>
                <p><strong>Componentă:</strong> {this.state.error.context.component}</p>
                <p><strong>Timestamp:</strong> {this.state.error.timestamp}</p>
                {this.state.error.originalError && (
                  <div className="mt-4">
                    <p><strong>Mesaj original:</strong></p>
                    <pre className="bg-red-50 p-2 rounded text-xs overflow-auto">
                      {this.state.error.originalError.message}
                    </pre>
                  </div>
                )}
                {this.state.error.originalError?.stack && (
                  <div className="mt-4">
                    <p><strong>Stack trace:</strong></p>
                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                      {this.state.error.originalError.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
