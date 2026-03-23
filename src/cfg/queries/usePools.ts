import { PoolId } from '@centrifuge/sdk'
import { useQuery } from '@tanstack/react-query'
import { combineLatest, of, switchMap } from 'rxjs'
import { useCentrifuge } from './CentrifugeContext'
import { queryKeys } from './queryKeys'
import { firstValueWithTimeout } from './utils'

const POOL_STALE_TIME = 5 * 60 * 1000 // 5 minutes

interface Options {
  enabled?: boolean
}

export function usePools() {
  const centrifuge = useCentrifuge()
  return useQuery({
    queryKey: queryKeys.pools(),
    queryFn: () => firstValueWithTimeout(centrifuge.pools()),
    staleTime: POOL_STALE_TIME,
  })
}

export function usePool(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.pool(poolId?.toString() ?? ''),
    queryFn: () => firstValueWithTimeout(centrifuge.pool(poolId!)),
    enabled: !!poolId && enabled,
    staleTime: POOL_STALE_TIME,
  })
}

export function usePoolDetails(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.poolDetails(poolId?.toString() ?? ''),
    queryFn: () =>
      firstValueWithTimeout(
        centrifuge.pool(poolId!).pipe(switchMap((pool) => (pool ? pool.details() : of(undefined))))
      ),
    enabled: !!poolId && enabled,
    staleTime: POOL_STALE_TIME,
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
      firstValueWithTimeout(
        combineLatest(poolIds.map((id) => centrifuge.pool(id).pipe(switchMap((pool) => pool.details()))))
      ),
    enabled: !!poolIds?.length && enabled,
    staleTime: POOL_STALE_TIME,
  })
}

export function usePoolActiveNetworks(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.poolActiveNetworks(poolId?.toString() ?? ''),
    queryFn: () =>
      firstValueWithTimeout(
        centrifuge.pool(poolId!).pipe(switchMap((pool) => (pool ? pool.activeNetworks() : of(undefined))))
      ),
    enabled: !!poolId && enabled,
    staleTime: POOL_STALE_TIME,
  })
}

export function usePoolNetworks(poolId?: PoolId) {
  const centrifuge = useCentrifuge()
  return useQuery({
    queryKey: queryKeys.poolNetworks(poolId?.toString() ?? ''),
    queryFn: () =>
      firstValueWithTimeout(
        centrifuge.pool(poolId!).pipe(switchMap((pool) => (pool ? pool.networks() : of(undefined))))
      ),
    enabled: !!poolId,
    staleTime: POOL_STALE_TIME,
  })
}
