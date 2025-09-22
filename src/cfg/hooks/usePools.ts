import { PoolId } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, of, switchMap } from 'rxjs'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

interface Options {
  enabled?: boolean
}

export function usePools() {
  const centrifuge = useCentrifuge()

  const pools$ = useMemo(() => {
    return centrifuge.pools()
  }, [centrifuge])

  return useObservable(pools$)
}

export function usePool(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  const pool$ = useMemo(() => {
    if (!poolId || !enabled) return undefined
    return centrifuge.pool(poolId)
  }, [poolId?.toString(), enabled])

  return useObservable(pool$)
}

export function usePoolDetails(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true

  const details$ = useMemo(() => {
    if (!enabled || !poolId) return undefined
    return centrifuge.pool(poolId).pipe(switchMap((pool) => (pool ? pool.details() : of(undefined))))
  }, [poolId?.toString(), centrifuge, enabled])

  return useObservable(details$)
}

export function useAllPoolDetails(poolIds: PoolId[], options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true

  const details$ = useMemo(() => {
    if (!enabled || !poolIds?.length) {
      return of([])
    }

    const poolDetailObservables$ = poolIds.map((id) => centrifuge.pool(id).pipe(switchMap((pool) => pool.details())))

    return combineLatest(poolDetailObservables$)
  }, [poolIds, centrifuge, enabled])

  return useObservable(details$)
}

export function usePoolActiveNetworks(poolId?: PoolId, options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true

  const vaults$ = useMemo(() => {
    if (!enabled || !poolId) return undefined
    return centrifuge.pool(poolId).pipe(switchMap((pool) => (pool ? pool.activeNetworks() : of(undefined))))
  }, [poolId?.toString(), centrifuge])

  return useObservable(vaults$)
}

export function usePoolNetworks(poolId?: PoolId) {
  const centrifuge = useCentrifuge()
  const networks$ = useMemo(() => {
    if (!poolId) return undefined
    return centrifuge.pool(poolId).pipe(switchMap((pool) => (pool ? pool.networks() : of(undefined))))
  }, [poolId?.toString(), centrifuge])

  return useObservable(networks$)
}
