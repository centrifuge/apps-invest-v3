import { ShareClass } from '@centrifuge/sdk'
import { useObservable } from './useObservable'
import { useMemo } from 'react'

export function useHoldings(shareClass?: ShareClass, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const holdings$ = useMemo(() => (enabled && shareClass ? shareClass.balances() : undefined), [shareClass, enabled])
  return useObservable(holdings$)
}
