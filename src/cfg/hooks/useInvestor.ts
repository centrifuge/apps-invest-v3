import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import { useCentrifuge } from './CentrifugeContext'
import { useAddress } from './useAddress'
import { ShareClassId } from '@centrifuge/sdk'
import { queryKeys } from './queries/queryKeys'

interface Options {
  enabled?: boolean
}

export function useInvestor() {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  return useQuery({
    queryKey: queryKeys.investor(address ?? ''),
    queryFn: () => firstValueFrom(centrifuge.investor(address!)),
    enabled: !!address,
  })
}

export function usePortfolio() {
  const { data: account } = useInvestor()
  return useQuery({
    queryKey: queryKeys.portfolio(account?.address ?? ''),
    queryFn: () => firstValueFrom(account!.portfolio()),
    enabled: !!account,
  })
}

export function useIsMember(shareClassId?: ShareClassId, centrifugeId?: number, options?: Options) {
  const enabled = options?.enabled ?? true
  const { data: account } = useInvestor()
  return useQuery({
    queryKey: queryKeys.isMember(account?.address ?? '', shareClassId?.toString() ?? '', centrifugeId ?? 0),
    queryFn: () => firstValueFrom(account!.isMember(shareClassId!, centrifugeId!)),
    enabled: !!account && !!shareClassId && !!centrifugeId && enabled,
  })
}
