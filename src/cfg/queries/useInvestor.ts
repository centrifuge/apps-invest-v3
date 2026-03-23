import { useQuery } from '@tanstack/react-query'
import { useCentrifuge } from './CentrifugeContext'
import { useAddress } from './useAddress'
import { ShareClassId } from '@centrifuge/sdk'
import { queryKeys } from './queryKeys'
import { firstValueWithTimeout } from './utils'

interface Options {
  enabled?: boolean
}

export function useInvestor() {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  return useQuery({
    queryKey: queryKeys.investor(address ?? ''),
    queryFn: () => firstValueWithTimeout(centrifuge.investor(address!)),
    enabled: !!address,
  })
}

export function usePortfolio() {
  const { data: account } = useInvestor()
  return useQuery({
    queryKey: queryKeys.portfolio(account?.address ?? ''),
    queryFn: () => firstValueWithTimeout(account!.portfolio()),
    enabled: !!account,
  })
}

export function useIsMember(shareClassId?: ShareClassId, centrifugeId?: number, options?: Options) {
  const enabled = options?.enabled ?? true
  const { data: account } = useInvestor()
  return useQuery({
    queryKey: queryKeys.isMember(account?.address ?? '', shareClassId?.toString() ?? '', centrifugeId ?? 0),
    queryFn: () => firstValueWithTimeout(account!.isMember(shareClassId!, centrifugeId!)),
    enabled: !!account && !!shareClassId && !!centrifugeId && enabled,
  })
}
