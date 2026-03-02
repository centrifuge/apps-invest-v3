import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import type { PoolId } from '@centrifuge/sdk'
import { useCentrifuge } from '../CentrifugeContext'
import { useAddress } from '../useAddress'
import { type PoolAccessStatus, createPoolsAccessStatus$ } from '../usePoolsAccessStatus'

export const poolsAccessStatusQueryKey = (poolIdsKey: string) => ['poolsAccessStatus', poolIdsKey] as const

// Module-level cache that survives component unmount/remount (navigation).
let lastValidAccessData: Map<string, PoolAccessStatus> | undefined

export function usePoolsAccessStatusQuery(poolIds: PoolId[]) {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  const poolIdsKey =
    poolIds
      ?.map((id) => id.toString())
      .sort()
      .join(',') ?? ''

  const result = useQuery({
    queryKey: poolsAccessStatusQueryKey(poolIdsKey),
    queryFn: () => firstValueFrom(createPoolsAccessStatus$(centrifuge, address!, poolIds)),
    enabled: !!address && poolIds.length > 0,
    staleTime: Infinity,
  })

  if (result.data && result.data instanceof Map && result.data.size > 0) {
    lastValidAccessData = result.data
  }

  return {
    ...result,
    data: result.data ?? lastValidAccessData,
    isLoading: result.isLoading && !lastValidAccessData,
  }
}
