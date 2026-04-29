import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DeploymentMismatchError, UnknownDeploymentError } from '@centrifuge/sdk'

export type DeploymentError = DeploymentMismatchError | UnknownDeploymentError

interface DeploymentErrorContextValue {
  error: DeploymentError | null
  reportError: (error: unknown) => void
  clearError: () => void
}

const DeploymentErrorContext = createContext<DeploymentErrorContextValue | null>(null)

// Module-level reporter so non-React code (useObservable's catchError, the
// QueryClient onError handler) can publish errors without needing to be a hook.
let externalReporter: ((error: unknown) => void) | null = null

export function reportDeploymentError(error: unknown) {
  externalReporter?.(error)
}

export function isDeploymentError(error: unknown): error is DeploymentError {
  return error instanceof DeploymentMismatchError || error instanceof UnknownDeploymentError
}

export function DeploymentErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<DeploymentError | null>(null)

  const reportError = useCallback((err: unknown) => {
    if (isDeploymentError(err)) {
      // Mismatches always win over unknown — once a mismatch is seen, don't
      // downgrade the gate to a soft warning.
      setError((prev: DeploymentError | null) => (prev instanceof DeploymentMismatchError ? prev : err))
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  useEffect(() => {
    externalReporter = reportError
    return () => {
      if (externalReporter === reportError) externalReporter = null
    }
  }, [reportError])

  const value = useMemo(() => ({ error, reportError, clearError }), [error, reportError, clearError])

  return <DeploymentErrorContext.Provider value={value}>{children}</DeploymentErrorContext.Provider>
}

export function useDeploymentError() {
  const ctx = useContext(DeploymentErrorContext)
  if (!ctx) throw new Error('useDeploymentError must be used within <DeploymentErrorProvider>')
  return ctx
}
