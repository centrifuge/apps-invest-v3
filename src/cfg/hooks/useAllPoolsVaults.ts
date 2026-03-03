import type { Centrifuge, PoolId, PoolNetwork } from '@centrifuge/sdk'
import { combineLatest, type Observable, of, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { PoolDetails, VaultDetails } from '../types'
import { NetworkSlug } from '../utils'

export interface PoolNetworkVaultData {
  poolId: string
  poolDetails: PoolDetails
  centrifugeId: number
  networkName: NetworkSlug
  networkDisplayName: string
  vault: import('@centrifuge/sdk').Vault
  vaultDetails: VaultDetails
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
