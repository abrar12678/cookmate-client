"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              Something went wrong
            </h2>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              An unexpected error occurred in this part of the application.
            </p>

            {this.state.error?.message && (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 mt-3 mb-5 font-mono break-words text-left">
                {this.state.error.message}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button variant="outline" onClick={this.handleReset}>
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Try Again
              </Button>
              <a href="/">
                <Button>
                  <Home className="h-4 w-4 mr-1.5" />
                  Go Home
                </Button>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}