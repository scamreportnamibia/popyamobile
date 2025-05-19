"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo)

    // You could send this to a logging service in production
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              We're sorry, but an error occurred while trying to display this content.
            </p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Refresh the page
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                Go back
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-md overflow-auto">
                <p className="font-mono text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm font-medium cursor-pointer">Stack trace</summary>
                    <p className="mt-2 font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </p>
                  </details>
                )}
              </div>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}
