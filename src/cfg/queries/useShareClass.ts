import { ShareClass } from '@centrifuge/sdk'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { firstValueWithTimeout } from './utils'

const HOLDINGS_REFETCH_INTERVAL = 60_000

export function useHoldings(shareClass?: ShareClass, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.holdings(shareClass?.id?.toString() ?? ''),
    queryFn: () => firstValueWithTimeout(shareClass!.balances()),
    enabled: !!shareClass && enabled,
    refetchInterval: HOLDINGS_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
  })
}

export function useShareClassDetails(shareClass: ShareClass | undefined, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.shareClassDetails(shareClass?.id?.toString() ?? ''),
    queryFn: () => firstValueWithTimeout(shareClass!.details()),
    enabled: !!shareClass && enabled,
  })
}
