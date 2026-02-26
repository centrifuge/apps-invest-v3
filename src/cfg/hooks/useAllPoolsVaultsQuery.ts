import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import type { PoolId } from '@centrifuge/sdk'
import { useCentrifuge } from './CentrifugeContext'
import { createAllPoolsVaults$, type PoolNetworkVaultData } from './useAllPoolsVaults'

export const allPoolsVaultsQueryKey = (poolIdsKey: string) => ['allPoolsVaults', poolIdsKey] as const

export function useAllPoolsVaultsQuery(poolIds: PoolId[]) {
  const centrifuge = useCentrifuge()
  const poolIdsKey = poolIds?.map((id) => id.toString()).join(',') ?? ''

  return useQuery({
    queryKey: allPoolsVaultsQueryKey(poolIdsKey),
    queryFn: () => firstValueFrom(createAllPoolsVaults$(centrifuge, poolIds)),
    enabled: poolIds.length > 0,
    staleTime: Infinity,
  })
}
