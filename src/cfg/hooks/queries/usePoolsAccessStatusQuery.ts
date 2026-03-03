import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import type { PoolId } from '@centrifuge/sdk'
import { useCentrifuge } from '../CentrifugeContext'
import { useAddress } from '../useAddress'
import { createPoolsAccessStatus$ } from '../usePoolsAccessStatus'

export const poolsAccessStatusQueryKey = (poolIdsKey: string, address?: string) =>
  ['poolsAccessStatus', poolIdsKey, address] as const

export function usePoolsAccessStatusQuery(poolIds: PoolId[]) {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  const poolIdsKey =
    poolIds
      ?.map((id) => id.toString())
      .sort()
      .join(',') ?? ''

  return useQuery({
    queryKey: poolsAccessStatusQueryKey(poolIdsKey, address),
    queryFn: () => firstValueFrom(createPoolsAccessStatus$(centrifuge, address!, poolIds)),
    enabled: !!address && poolIds.length > 0,
    staleTime: Infinity,
  })
}
