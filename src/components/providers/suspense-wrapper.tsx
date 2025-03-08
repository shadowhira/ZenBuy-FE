"use client"

import { Suspense, type ReactNode } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode | ((error: Error) => ReactNode)
}

export function SuspenseWrapper({
  children,
  fallback = <div className="p-4 text-center">Loading...</div>,
  errorFallback = (error: Error) => (
    <div className="p-4 text-center text-red-500">
      <p>Something went wrong</p>
      <p className="text-sm">{error.message}</p>
    </div>
  ),
}: SuspenseWrapperProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (typeof errorFallback === "function" ? errorFallback(error) : errorFallback)}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

