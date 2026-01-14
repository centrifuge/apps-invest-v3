import { useMemo } from 'react'
import { useIsMember } from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'

export function useIsUserWhitelisted() {
  const { network, shareClassId, isPoolDataReady } = usePoolContext()

  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, network?.centrifugeId, {
    enabled: !!shareClassId && !!network?.centrifugeId && isPoolDataReady,
  })

  const isWhitelisted = useMemo(() => !!isMember, [isMember, network?.centrifugeId])
  const isLoading = isMemberLoading

  return { isWhitelisted, isLoading }
}
