import type { HexString, PoolNetwork, ShareClassId, Vault } from '@centrifuge/sdk'
import { useMemo } from 'react'
import { combineLatest, firstValueFrom } from 'rxjs'
import { useQuery } from '@tanstack/react-query'
import { useAddress } from './useAddress'
import { queryKeys } from './queries/queryKeys'

const VAULT_STALE_TIME = 5 * 60 * 1000 // 5 minutes
const INVESTMENT_REFETCH_INTERVAL = 60_000

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
  return useQuery({
    queryKey: queryKeys.investment(vault?.address ?? '', address ?? ''),
    queryFn: () => firstValueFrom(vault!.investment(address! as HexString)),
    enabled: !!vault && !!address && enabled,
    staleTime: 0,
    refetchInterval: INVESTMENT_REFETCH_INTERVAL,
  })
}
