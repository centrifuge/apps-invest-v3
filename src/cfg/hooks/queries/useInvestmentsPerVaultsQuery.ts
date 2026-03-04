import { useQuery } from '@tanstack/react-query'
import { combineLatest, firstValueFrom } from 'rxjs'
import type { HexString, Vault } from '@centrifuge/sdk'
import type { Investment } from '../../types'
import { useAddress } from '../useAddress'

export const investmentsPerVaultsQueryKey = (vaultAddressesKey: string) =>
  ['investmentsPerVaults', vaultAddressesKey] as const

export function useInvestmentsPerVaultsQuery(vaults?: Vault[]) {
  const { address } = useAddress()
  const vaultAddressesKey =
    vaults
      ?.map((v) => v.address)
      .sort()
      .join(',') ?? ''

  return useQuery({
    queryKey: investmentsPerVaultsQueryKey(vaultAddressesKey),
    queryFn: () => firstValueFrom(combineLatest(vaults!.map((v) => v.investment(address! as HexString)))),
    enabled: !!address && !!vaults && vaults.length > 0,
    placeholderData: [] as Investment[],
    staleTime: 60000,
  })
}
