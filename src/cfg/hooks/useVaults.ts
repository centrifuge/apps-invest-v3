import type { HexString, PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { type Observable, combineLatest, of } from 'rxjs'
import type { Investment } from '../types'
import { useObservable } from './useObservable'
import { useAddress } from './useAddress'

interface Options {
  enabled?: boolean
}

export function useVaults(poolNetwork?: PoolNetwork, scId?: ShareClassId, options?: Options) {
  const enabled = options?.enabled ?? true
  const vaults$ = useMemo(() => {
    if (!poolNetwork || !scId || !enabled) return undefined
    return poolNetwork.vaults(scId)
  }, [poolNetwork?.centrifugeId, scId?.toString(), enabled])
  return useObservable(vaults$)
}

export function useVaultDetails(vault?: Vault | null, options?: Options) {
  const enabled = options?.enabled ?? true
  const vaultDetails$ = useMemo(() => (vault && enabled ? vault.details() : undefined), [vault?.address, enabled])
  return useObservable(vaultDetails$)
}

export function useVaultsDetails(vaults?: Vault[], options?: Options) {
  const enabled = options?.enabled ?? true
  const vaultsDetails$ = useMemo(() => {
    if (!vaults || vaults.length === 0 || !enabled) return undefined
    const vaultDetails$ = vaults.map((vault) => vault.details())
    return combineLatest(vaultDetails$)
  }, [vaults, enabled])

  return useObservable(vaultsDetails$)
}

export function useInvestment(vault?: Vault, options?: Options) {
  const enabled = options?.enabled ?? true
  const { address } = useAddress()
  const investment$ = useMemo(
    () => (vault && address && enabled ? vault.investment(address) : undefined),
    [vault?.address, address, enabled]
  )
  return useObservable(investment$)
}

export function useInvestmentsPerVaults(vaults?: Vault[], options?: Options) {
  const enabled = options?.enabled ?? true
  const { address } = useAddress()
  const investmentsPerVaults$ = useMemo(() => {
    if (!vaults || !vaults.length || !address || !enabled) return of([])

    return createInvestmentsPerVaults$(vaults, address)
  }, [vaults, address, enabled])

  return useObservable(investmentsPerVaults$)
}

export function createInvestmentsPerVaults$(vaults: Vault[], address: HexString): Observable<Investment[]> {
  const investment$ = vaults.map((vault) => vault.investment(address))
  return combineLatest(investment$)
}
