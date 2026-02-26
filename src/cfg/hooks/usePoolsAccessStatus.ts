import { useMemo, useRef } from 'react'
import { combineLatest, map, of, switchMap } from 'rxjs'
import type { PoolId } from '@centrifuge/sdk'
import { useCentrifuge } from './CentrifugeContext'
import { useObservable } from './useObservable'
import { useAddress } from './useAddress'

export interface PoolAccessStatus {
  hasAccess: boolean
  // Centrifuge IDs of networks where the user is a member
  memberNetworkIds: Set<number>
}

export interface UsePoolsAccessStatusResult {
  data: Map<string, PoolAccessStatus>
  isLoading: boolean
}

export function usePoolsAccessStatus(poolIds: PoolId[]): UsePoolsAccessStatusResult {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  const lastValidDataRef = useRef<Map<string, PoolAccessStatus>>(new Map())

  const access$ = useMemo(() => {
    if (!address || !poolIds?.length) {
      return of(new Map<string, PoolAccessStatus>())
    }

    const investor$ = centrifuge.investor(address)

    return investor$.pipe(
      switchMap((account) => {
        if (!account) return of(new Map<string, PoolAccessStatus>())

        // For each pool, check membership on its first active network
        const poolChecks$ = poolIds.map((poolId) =>
          centrifuge.pool(poolId).pipe(
            switchMap((pool) => pool.details()),
            switchMap((details) => {
              const shareClassId = details.shareClasses?.[0]?.shareClass.id
              if (!shareClassId) {
                return of({ poolId: poolId.toString(), hasAccess: false, memberNetworkIds: new Set<number>() })
              }

              return centrifuge.pool(poolId).pipe(
                switchMap((pool) => pool.activeNetworks()),
                switchMap((networks) => {
                  if (!networks?.length) {
                    return of({ poolId: poolId.toString(), hasAccess: false, memberNetworkIds: new Set<number>() })
                  }

                  // Check isMember on each network
                  const memberChecks$ = networks.map((network) => account.isMember(shareClassId, network.centrifugeId))

                  return combineLatest(memberChecks$).pipe(
                    map((memberResults) => {
                      const memberNetworkIds = new Set<number>()
                      networks.forEach((network, i) => {
                        if (memberResults[i]) {
                          memberNetworkIds.add(network.centrifugeId)
                        }
                      })
                      return {
                        poolId: poolId.toString(),
                        hasAccess: memberNetworkIds.size > 0,
                        memberNetworkIds,
                      }
                    })
                  )
                })
              )
            })
          )
        )

        return combineLatest(poolChecks$).pipe(
          map((results) => {
            const statusMap = new Map<string, PoolAccessStatus>()
            for (const r of results) {
              statusMap.set(r.poolId, { hasAccess: r.hasAccess, memberNetworkIds: r.memberNetworkIds })
            }
            return statusMap
          })
        )
      })
    )
  }, [centrifuge, address, poolIds?.map((id) => id.toString()).join(',')])

  const result = useObservable(access$)

  if (result.data && result.data.size > 0) {
    lastValidDataRef.current = result.data
  }

  return {
    data: result.data ?? lastValidDataRef.current,
    isLoading: result.isLoading && lastValidDataRef.current.size === 0,
  }
}
