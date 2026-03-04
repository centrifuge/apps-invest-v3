import type { HexString, PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { type Observable, combineLatest, firstValueFrom } from 'rxjs'
import { useQuery } from '@tanstack/react-query'
import type { Investment } from '../types'
import { useAddress } from './useAddress'
import { useObservable } from './useObservable'
import { queryKeys } from './queries/queryKeys'

const VAULT_STALE_TIME = 5 * 60 * 1000 // 5 minutes

interface Options {
  enabled?: boolean
}

export function useVaults(poolNetwork?: PoolNetwork, scId?: ShareClassId, options?: Options) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.vaults(poolNetwork?.centrifugeId ?? 0, scId?.toString() ?? ''),
    queryFn: () => firstValueFrom(poolNetwork!.vaults(scId!)),
    enabled: !!poolNetwork && !!scId && enabled,
    staleTime: VAULT_STALE_TIME,
  })
}

export function useVaultDetails(vault?: Vault | null, options?: Options) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.vaultDetails(vault?.address ?? ''),
    queryFn: () => firstValueFrom(vault!.details()),
    enabled: !!vault && enabled,
    staleTime: VAULT_STALE_TIME,
  })
}

export function useVaultsDetails(vaults?: Vault[], options?: Options) {
  const enabled = options?.enabled ?? true
  const vaultAddressesKey = useMemo(
    () =>
      vaults
        ?.map((v) => v.address)
        .sort()
        .join(',') ?? '',
    [vaults]
  )
  return useQuery({
    queryKey: queryKeys.vaultsDetails(vaultAddressesKey),
    queryFn: () => firstValueFrom(combineLatest(vaults!.map((v) => v.details()))),
    enabled: !!vaults && vaults.length > 0 && enabled,
    staleTime: VAULT_STALE_TIME,
  })
}

export function useInvestment(vault?: Vault, options?: Options) {
  const enabled = options?.enabled ?? true
  const { address } = useAddress()
  const investment$ = useMemo(() => {
    if (!vault || !address || !enabled) return undefined
    return vault.investment(address)
  }, [vault, address, enabled])
  return useObservable(investment$)
}

export function createInvestmentsPerVaults$(vaults: Vault[], address: HexString): Observable<Investment[]> {
  const investment$ = vaults.map((vault) => vault.investment(address))
  return combineLatest(investment$)
}
