import type { Centrifuge, PoolId, PoolNetwork, Vault } from '@centrifuge/sdk'
import { useMemo, useRef } from 'react'
import { combineLatest, type Observable, of, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { PoolDetails, VaultDetails } from '../types'
import { NetworkSlug } from '../utils'
import { useCentrifuge } from './CentrifugeContext'
import { useObservable } from './useObservable'

export interface PoolNetworkVaultData {
  poolId: string
  poolDetails: PoolDetails
  centrifugeId: number
  networkName: NetworkSlug
  networkDisplayName: string
  vault: Vault
  vaultDetails: VaultDetails
}

interface Options {
  enabled?: boolean
}

export function createAllPoolsVaults$(centrifuge: Centrifuge, poolIds: PoolId[]): Observable<PoolNetworkVaultData[]> {
  const poolVaultsObservables$ = poolIds.map((poolId) =>
    centrifuge.pool(poolId).pipe(
      switchMap((pool) =>
        combineLatest([pool.details(), pool.activeNetworks()]).pipe(
          switchMap(([poolDetails, networks]) => {
            if (!networks?.length) {
              return of([])
            }

            const networkVaultsObservables$ = networks.map((network: PoolNetwork) =>
              getNetworkVaultsWithDetails(centrifuge, network, poolDetails)
            )

            return combineLatest(networkVaultsObservables$).pipe(
              map((networkVaultsArrays) => networkVaultsArrays.flat())
            )
          })
        )
      )
    )
  )

  return combineLatest(poolVaultsObservables$).pipe(map((poolVaultsArrays) => poolVaultsArrays.flat()))
}

export function useAllPoolsVaults(poolIds: PoolId[], options?: Options) {
  const centrifuge = useCentrifuge()
  const enabled = options?.enabled ?? true
  const lastValidDataRef = useRef<PoolNetworkVaultData[] | undefined>(undefined)

  const allVaults$ = useMemo(() => {
    if (!enabled || !poolIds?.length) {
      return of([])
    }

    return createAllPoolsVaults$(centrifuge, poolIds)
  }, [centrifuge, enabled, poolIds?.map((id) => id.toString()).join(',')])

  const result = useObservable(allVaults$)

  // Store last valid data to prevent flickering during resubscription
  if (result.data && result.data.length > 0) {
    lastValidDataRef.current = result.data
  }

  return {
    ...result,
    data: result.data ?? lastValidDataRef.current,
    isLoading: result.isLoading && !lastValidDataRef.current,
  }
}

function getNetworkVaultsWithDetails(centrifuge: Centrifuge, network: PoolNetwork, poolDetails: PoolDetails) {
  const shareClassId = poolDetails.shareClasses?.[0]?.shareClass.id
  if (!shareClassId) {
    return of([])
  }

  // Get chain config to resolve centrifugeId to network name
  return combineLatest([network.vaults(shareClassId), centrifuge.getChainConfig(network.centrifugeId)]).pipe(
    switchMap(([vaults, chainConfig]) => {
      if (!vaults?.length) {
        return of([])
      }

      const networkName: NetworkSlug = chainConfig.name.toLowerCase().replace(/\s+/g, '-')
      const networkDisplayName = formatNetworkDisplayName(chainConfig.name)

      const vaultDetailsObservables$ = vaults.map((vault) =>
        vault.details().pipe(
          map((vaultDetails): PoolNetworkVaultData => {
            return {
              poolId: poolDetails.id.toString(),
              poolDetails,
              centrifugeId: network.centrifugeId,
              networkName,
              networkDisplayName,
              vault,
              vaultDetails,
            }
          })
        )
      )

      return combineLatest(vaultDetailsObservables$)
    })
  )
}

const NETWORK_DISPLAY_NAMES: Record<string, string> = {
  'BNB Smart Chain': 'BNB',
}

function formatNetworkDisplayName(chainName: string): string {
  return NETWORK_DISPLAY_NAMES[chainName] ?? chainName
}
