import React from "react";
import { MESAJE } from "@shared-constants";
import Alert from "./primitives/Alert/Alert";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error to an error reporting service here

    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          title={MESAJE.EROARE_TITLU}
          message={this.state.error?.message || MESAJE.EROARE_GENERALA}
          className="my-8"
          size="lg"
          dataTestId="error-boundary-alert"
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
