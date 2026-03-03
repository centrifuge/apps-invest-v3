import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import type { Vault } from '@centrifuge/sdk'
import type { Investment } from '../../types'
import { useAddress } from '../useAddress'
import { createInvestmentsPerVaults$ } from '../useVaults'

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
    queryFn: () => firstValueFrom(createInvestmentsPerVaults$(vaults!, address!)),
    enabled: !!address && !!vaults && vaults.length > 0,
    placeholderData: [] as Investment[],
    staleTime: Infinity,
  })
}
