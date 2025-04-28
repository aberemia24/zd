import React from 'react';
import { MESAJE } from '@shared-constants';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error to an error reporting service here
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded p-6 my-8 text-center">
          <h2 className="text-lg font-bold text-red-700 mb-2">{MESAJE.EROARE_TITLU}</h2>
          <p className="text-red-600">{this.state.error?.message || MESAJE.EROARE_GENERALA}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
