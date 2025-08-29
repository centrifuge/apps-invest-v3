import { useMemo } from 'react'
import { useIsMember } from '@cfg'
import { usePoolContext } from '@contexts/usePoolContext'

export function useIsUserWhitelisted() {
  const { connectedChainId, shareClassId, isPoolDataReady } = usePoolContext()

  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, connectedChainId, {
    enabled: !!shareClassId && !!connectedChainId && isPoolDataReady,
  })

  const isWhitelisted = useMemo(() => !!isMember, [isMember, connectedChainId])
  const isLoading = isMemberLoading

  return { isWhitelisted, isLoading }
}
