import { combineLatest, map, switchMap, of } from 'rxjs'
import { Address } from 'viem'
import { useMemo } from 'react'
import { useCentrifuge } from './CentrifugeContext'
import { useObservable } from './useObservable'
import { HexString, PoolId } from '@centrifuge/sdk'

export function useIsPoolManager(poolId?: PoolId, address?: HexString) {
  const centrifuge = useCentrifuge()

  const isManager$ = useMemo(() => {
    if (!poolId || !address) return of(false)
    return centrifuge.pool(poolId).pipe(switchMap((pool) => pool.isPoolManager(address)))
  }, [centrifuge, poolId, address])

  return useObservable(isManager$).data
}

export function useIsBalanceSheetManager(poolId?: PoolId, address?: HexString, chainId?: number) {
  const centrifuge = useCentrifuge()

  const isBalanceSheetManager$ = useMemo(() => {
    if (!poolId || !address || !chainId) return of(false)
    return centrifuge.pool(poolId).pipe(switchMap((pool) => pool.isBalanceSheetManager(chainId, address)))
  }, [centrifuge, poolId, address])

  return useObservable(isBalanceSheetManager$).data
}

export function usePoolsByManager(address: Address) {
  const centrifuge = useCentrifuge()

  const pools$ = useMemo(() => {
    if (!address) return of([])

    return centrifuge.pools().pipe(
      switchMap((pools) => {
        if (!pools.length) return of([])
        return combineLatest(
          pools.map((pool) => pool.isPoolManager(address).pipe(map((isManager) => (isManager ? pool : null))))
        ).pipe(map((results) => results.filter((p) => p !== null)))
      })
    )
  }, [address, centrifuge])

  return useObservable(pools$)
}
