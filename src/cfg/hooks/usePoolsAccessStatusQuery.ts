import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import type { HexString, PoolId } from '@centrifuge/sdk'
import { useCentrifuge } from './CentrifugeContext'
import { useAddress } from './useAddress'
import { createPoolsAccessStatus$ } from './usePoolsAccessStatus'

export const poolsAccessStatusQueryKey = (address: HexString) => ['poolsAccessStatus', address] as const

export function usePoolsAccessStatusQuery(poolIds: PoolId[]) {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()

  return useQuery({
    queryKey: poolsAccessStatusQueryKey(address),
    queryFn: () => firstValueFrom(createPoolsAccessStatus$(centrifuge, address!, poolIds)),
    enabled: !!address && poolIds.length > 0,
    staleTime: Infinity,
  })
}
