import { ShareClass } from '@centrifuge/sdk'
import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { queryKeys } from './queries/queryKeys'

export function useHoldings(shareClass?: ShareClass, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const holdings$ = useMemo(
    () => (enabled && shareClass ? shareClass.balances() : undefined),
    [shareClass?.id, enabled]
  )
  return useObservable(holdings$)
}

export function useShareClassDetails(shareClass: ShareClass | undefined, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.shareClassDetails(shareClass?.id?.toString() ?? ''),
    queryFn: () => firstValueFrom(shareClass!.details()),
    enabled: !!shareClass && enabled,
  })
}
