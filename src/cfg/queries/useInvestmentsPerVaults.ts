import { useQuery } from '@tanstack/react-query'
import { combineLatest } from 'rxjs'
import type { HexString, Vault } from '@centrifuge/sdk'
import type { Investment } from '../types'
import { queryKeys } from './queryKeys'
import { useAddress } from './useAddress'
import { firstValueWithTimeout } from './utils'

export function useInvestmentsPerVaults(vaults?: Vault[]) {
  const { address } = useAddress()
  const vaultAddressesKey =
    vaults
      ?.map((v) => v.address)
      .sort()
      .join(',') ?? ''

  return useQuery({
    queryKey: queryKeys.investmentsPerVaults(vaultAddressesKey),
    queryFn: () => firstValueWithTimeout(combineLatest(vaults!.map((v) => v.investment(address! as HexString)))),
    enabled: !!address && !!vaults && vaults.length > 0,
    placeholderData: [] as Investment[],
    staleTime: 60000,
    gcTime: Infinity,
  })
}
