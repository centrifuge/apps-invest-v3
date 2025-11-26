import { useCallback, useMemo } from 'react'
import { Balance, ShareClassId } from '@centrifuge/sdk'
import { useCentrifuge } from './CentrifugeContext'
import { useSolanaTransaction } from './useSolanaTransaction'
import { type SolanaWalletAdapter } from '@centrifuge/sdk'

export function useSolanaInvest(shareClassId?: ShareClassId) {
  const centrifuge = useCentrifuge()
  const { execute: executeSolanaTx, isPending } = useSolanaTransaction()

  const isSolanaPool = useMemo(() => {
    if (!centrifuge.solana || !shareClassId) return false
    return centrifuge.solana.isSolanaPool(shareClassId)
  }, [centrifuge.solana, shareClassId])

  /**
   * Execute a Solana USDC investment transaction
   *
   * @param amount - The USDC amount to invest (must have 6 decimals)
   * @param wallet - The Solana wallet adapter containing publicKey and signTransaction
   * @throws Error if Solana is not configured, investments are not available, or wallet is incomplete
   */
  const invest = useCallback(
    async (amount: Balance, wallet: SolanaWalletAdapter) => {
      if (!centrifuge.solana) {
        throw new Error('Solana is not configured in the Centrifuge SDK')
      }

      if (!shareClassId) {
        throw new Error('Share class ID is required for Solana investment')
      }

      if (!isSolanaPool) {
        throw new Error('Solana investments are not available for this pool')
      }

      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet adapter must provide both publicKey and signTransaction')
      }

      // Use the new centrifuge.solana.invest() method
      const investObservable = centrifuge.solana.invest(amount, shareClassId, wallet)
      return await executeSolanaTx(investObservable)
    },
    [centrifuge.solana, shareClassId, isSolanaPool, executeSolanaTx]
  )

  return {
    invest,
    isSolanaPool,
    isPending,
  }
}
