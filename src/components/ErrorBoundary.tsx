import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Var, T } from "gt-react";


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (<T id="components.errorboundary.0">
        <div className="h-full flex flex-col items-center justify-center p-6 bg-[#1e1e1e] text-white">
          <div className="max-w-md w-full bg-[#252526] border border-[#3c3c3c] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>

            <div className="mb-4 p-3 bg-[#1e1e1e] rounded border border-[#3c3c3c] overflow-auto max-h-[200px] text-sm font-mono">
              <p className="text-red-400"><Var>{this.state.error?.toString()}</Var></p>
              <Var>{this.state.errorInfo && (
                <pre className="mt-2 text-white/70 text-xs">
                  {this.state.errorInfo.componentStack}
                </pre>
                )}</Var>
            </div>

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-vscode-accent text-white rounded hover:bg-vscode-accent/80 transition-colors">

              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div></T>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;