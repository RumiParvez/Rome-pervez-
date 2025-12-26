
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IconLogo, IconRefresh } from './Icons';

interface Props {
  // Make children optional to satisfy the JSX compiler in some strict environments
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch UI crashes and show a fallback interface.
export class ErrorBoundary extends Component<Props, State> {
  // Added constructor to ensure props are correctly initialized and typed for the base class
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Accessing this.state works correctly when state is defined as a class property or in constructor
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-center text-white font-sans">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-red-900/20 border border-gray-800">
             <IconLogo className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-8 max-w-md">
            The application encountered an unexpected error. This usually happens due to a temporary glitch or connection issue.
          </p>
          
          <div className="bg-gray-900/50 p-4 rounded-lg border border-red-900/30 mb-8 max-w-lg w-full overflow-hidden">
             <p className="text-red-400 font-mono text-xs text-left">
                {this.state.error?.toString()}
             </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-green-500/20"
          >
            <IconRefresh className="w-5 h-5" />
            Reload Application
          </button>
        </div>
      );
    }

    // Explicitly return children from this.props
    return this.props.children;
  }
}
