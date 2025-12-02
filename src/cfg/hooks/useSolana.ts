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

export function useSolanaUsdcBalance() {
  const centrifuge = useCentrifuge()
  const { address, isSolanaWallet } = useAddress()
  const balance$ = useMemo(
    () => (address && isSolanaWallet ? centrifuge.solana?.usdcBalance(address) : undefined),
    [address, isSolanaWallet, centrifuge]
  )
  return useObservable(balance$)
}
