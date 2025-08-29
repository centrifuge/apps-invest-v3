import { ReactNode, Suspense } from 'react'
import { useLoadingBoundary } from './LoadingProvider'

export interface LoadingBoundaryProps {
  children: ReactNode
}

// For use with lazy loaded routes
export function LoadingBoundary({ children }: LoadingBoundaryProps) {
  const { fallback } = useLoadingBoundary()

  return <Suspense fallback={fallback}>{children}</Suspense>
}
