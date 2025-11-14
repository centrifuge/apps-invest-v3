import { useMemo } from 'react'
import { useCentrifuge } from 'src/cfg/hooks/CentrifugeContext'
import { useAddress } from 'src/cfg/hooks/useAddress'
import { useObservable } from 'src/cfg/hooks/useObservable'

export function useSolanaBalance() {
  const centrifuge = useCentrifuge()
  const { address } = useAddress()
  const balance$ = useMemo(() => (address ? centrifuge.solana?.balance(address) : undefined), [address, centrifuge])
  return useObservable(balance$)
}
