import { combineLatest, map, of, switchMap, type Observable } from 'rxjs'
import type { Centrifuge, HexString, PoolId } from '@centrifuge/sdk'

export interface PoolAccessStatus {
  hasAccess: boolean
  // Centrifuge IDs of networks where the user is a member
  memberNetworkIds: Set<number>
}

export interface UsePoolsAccessStatusResult {
  data: Map<string, PoolAccessStatus>
  isLoading: boolean
}

export function createPoolsAccessStatus$(
  centrifuge: Centrifuge,
  address: HexString,
  poolIds: PoolId[]
): Observable<Map<string, PoolAccessStatus>> {
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
}
