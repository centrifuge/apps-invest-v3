import { PoolId } from '@centrifuge/sdk'
import { useQuery } from '@tanstack/react-query'
import { combineLatest, firstValueFrom, of, switchMap } from 'rxjs'
import { useCentrifuge } from './CentrifugeContext'
import { queryKeys } from './queries/queryKeys'

interface Options {
  enabled?: boolean
}

export function usePools() {
  const centrifuge = useCentrifuge()
  return useQuery({
    queryKey: queryKeys.pools(),
    queryFn: () => firstValueFrom(centrifuge.pools()),
  })
}

export function usePool(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.pool(poolId?.toString() ?? ''),
    queryFn: () => firstValueFrom(centrifuge.pool(poolId!)),
    enabled: !!poolId && enabled,
  })
}

export function usePoolDetails(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.poolDetails(poolId?.toString() ?? ''),
    queryFn: () =>
      firstValueFrom(centrifuge.pool(poolId!).pipe(switchMap((pool) => (pool ? pool.details() : of(undefined))))),
    enabled: !!poolId && enabled,
  })
}

export function useAllPoolDetails(poolIds: PoolId[], options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  const poolIdsKey =
    poolIds
      ?.map((id) => id.toString())
      .sort()
      .join(',') ?? ''
  return useQuery({
    queryKey: queryKeys.allPoolDetails(poolIdsKey),
    queryFn: () =>
      firstValueFrom(combineLatest(poolIds.map((id) => centrifuge.pool(id).pipe(switchMap((pool) => pool.details()))))),
    enabled: !!poolIds?.length && enabled,
  })
}

export function usePoolActiveNetworks(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.poolActiveNetworks(poolId?.toString() ?? ''),
    queryFn: () =>
      firstValueFrom(
        centrifuge.pool(poolId!).pipe(switchMap((pool) => (pool ? pool.activeNetworks() : of(undefined))))
      ),
    enabled: !!poolId && enabled,
  })
}

export function usePoolNetworks(poolId?: PoolId) {
  const centrifuge = useCentrifuge()
  return useQuery({
    queryKey: queryKeys.poolNetworks(poolId?.toString() ?? ''),
    queryFn: () =>
      firstValueFrom(centrifuge.pool(poolId!).pipe(switchMap((pool) => (pool ? pool.networks() : of(undefined))))),
    enabled: !!poolId,
  })
}
