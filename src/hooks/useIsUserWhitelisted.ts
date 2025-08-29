import { useIsMember } from '@cfg'
import { usePoolContext } from '@contexts/usePoolContext'
import { useMemo } from 'react'

export function useIsUserWhitelisted() {
  const { network, shareClassId, isPoolDataReady } = usePoolContext()

  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, network?.chainId, {
    enabled: !!shareClassId && !!network?.chainId && isPoolDataReady,
  })

  const isWhitelisted = useMemo(() => !!isMember, [isMember])
  const isLoading = isMemberLoading

  return { isWhitelisted, isLoading }
}
