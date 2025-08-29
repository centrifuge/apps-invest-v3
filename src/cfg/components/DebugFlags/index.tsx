import { Suspense, lazy } from 'react'
import { debug } from './config'
import { Flags } from './context'

export * from './context'

const DebugFlagsImpl = lazy(() => import('./DebugFlags'))

export function DebugFlags({
  children,
  onChange,
  customFlags,
}: {
  children?: React.ReactNode
  onChange?: (state: Flags) => void
  customFlags?: string[]
}) {
  const fallback = <>{children}</>
  return debug ? (
    <Suspense fallback={fallback}>
      <DebugFlagsImpl onChange={onChange} customFlags={customFlags}>
        {children}
      </DebugFlagsImpl>
    </Suspense>
  ) : (
    fallback
  )
}
