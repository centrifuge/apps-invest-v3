import type { HexString, PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { type Observable, combineLatest } from 'rxjs'
import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import type { Investment } from '../types'
import { useObservable } from './useObservable'
import { useAddress } from './useAddress'
import { queryKeys } from './queries/queryKeys'

interface Options {
  enabled?: boolean
}

export function useVaults(poolNetwork?: PoolNetwork, scId?: ShareClassId, options?: Options) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.vaults(poolNetwork?.centrifugeId ?? 0, scId?.toString() ?? ''),
    queryFn: () => firstValueFrom(poolNetwork!.vaults(scId!)),
    enabled: !!poolNetwork && !!scId && enabled,
  })
}

export function useVaultDetails(vault?: Vault | null, options?: Options) {
  const enabled = options?.enabled ?? true
  return useQuery({
    queryKey: queryKeys.vaultDetails(vault?.address ?? ''),
    queryFn: () => firstValueFrom(vault!.details()),
    enabled: !!vault && enabled,
  })
}

export function useVaultsDetails(vaults?: Vault[], options?: Options) {
  const enabled = options?.enabled ?? true
  const vaultAddressesKey = useMemo(
    () => vaults?.map((v) => v.address).sort().join(',') ?? '',
    [vaults]
  )
  return useQuery({
    queryKey: queryKeys.vaultsDetails(vaultAddressesKey),
    queryFn: () => firstValueFrom(combineLatest(vaults!.map((v) => v.details()))),
    enabled: !!vaults && vaults.length > 0 && enabled,
  })
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

export function createInvestmentsPerVaults$(vaults: Vault[], address: HexString): Observable<Investment[]> {
  const investment$ = vaults.map((vault) => vault.investment(address))
  return combineLatest(investment$)
}
