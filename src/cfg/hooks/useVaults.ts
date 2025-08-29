import type { PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, of } from 'rxjs'
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
  }, [poolNetwork, scId, enabled])
  return useObservable(vaults$)
}

export function useVaultDetails(vault?: Vault | null, options?: Options) {
  const enabled = options?.enabled ?? true
  const vaultDetails$ = useMemo(() => (vault && enabled ? vault.details() : undefined), [vault, enabled])
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
    [vault, address, enabled]
  )
  return useObservable(investment$)
}

export function useInvestmentsPerVaults(vaults?: Vault[], options?: Options) {
  const enabled = options?.enabled ?? true
  const { address } = useAddress()
  const investmentsPerVaults$ = useMemo(() => {
    if (!vaults || !vaults.length || !address || !enabled) return of([])

    const investment$ = vaults.map((vault) => vault.investment(address))
    return combineLatest(investment$)
  }, [vaults, address, enabled])

  return useObservable(investmentsPerVaults$)
}
