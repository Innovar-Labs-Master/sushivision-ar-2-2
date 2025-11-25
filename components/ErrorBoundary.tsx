import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log to error tracking service (e.g., Sentry) in production
    if (import.meta.env.PROD) {
      // TODO: Add error tracking service
      // trackError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 rounded-lg border border-red-500/30 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <AlertTriangle className="w-16 h-16 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Er is iets misgegaan
            </h2>
            
            <p className="text-gray-400 mb-6">
              De applicatie heeft een onverwachte fout tegengekomen. Probeer de pagina te verversen of ga terug naar de startpagina.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Technische details (alleen zichtbaar in development)
                </summary>
                <div className="bg-black/50 p-3 rounded text-xs font-mono text-red-300 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-sushi-gold text-black font-semibold rounded-lg hover:bg-sushi-gold/90 flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={18} />
                Opnieuw proberen
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
              >
                <Home size={18} />
                Naar start
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
