import { useQuery } from '@tanstack/react-query'
import type { PoolId } from '@centrifuge/sdk'
import { useCentrifuge } from '../CentrifugeContext'
import { createAllPoolsVaults$ } from '../useAllPoolsVaults'
import { firstValueWithTimeout } from '../utils'

export const allPoolsVaultsQueryKey = (poolIdsKey: string) => ['allPoolsVaults', poolIdsKey] as const

export function useAllPoolsVaultsQuery(poolIds: PoolId[]) {
  const centrifuge = useCentrifuge()
  const poolIdsKey =
    poolIds
      ?.map((id) => id.toString())
      .sort()
      .join(',') ?? ''

  return useQuery({
    queryKey: allPoolsVaultsQueryKey(poolIdsKey),
    queryFn: () => firstValueWithTimeout(createAllPoolsVaults$(centrifuge, poolIds)),
    enabled: poolIds.length > 0,
    staleTime: Infinity,
  })
}
