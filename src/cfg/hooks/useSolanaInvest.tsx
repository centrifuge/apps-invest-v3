import { useCallback, useMemo } from 'react'
import { Balance, SolanaInvestment, ShareClassId } from '@centrifuge/sdk'
import { useCentrifuge } from './CentrifugeContext'
import { useSolanaTransaction } from './useSolanaTransaction'
import { type SolanaWalletAdapter } from '@centrifuge/sdk'

export function useSolanaInvest(shareClassId?: ShareClassId) {
  const centrifuge = useCentrifuge()
  const { execute: executeSolanaTx, isPending } = useSolanaTransaction()

  const solanaInvestment = useMemo(() => {
    if (!shareClassId) return undefined
    return new SolanaInvestment(centrifuge, shareClassId)
  }, [centrifuge, shareClassId])

  const isAvailable = useMemo(() => {
    return solanaInvestment?.isAvailable() ?? false
  }, [solanaInvestment])

  /**
   * Execute a Solana USDC investment transaction
   *
   * @param amount - The USDC amount to invest
   * @param wallet - The Solana wallet adapter containing publicKey and signTransaction
   * @throws Error if Solana investments are not available or wallet is incomplete
   */
  const invest = useCallback(
    async (amount: Balance, wallet: SolanaWalletAdapter) => {
      if (!solanaInvestment) {
        throw new Error('Share class ID is required for Solana investment')
      }

      if (!isAvailable) {
        throw new Error('Solana investments are not available for this pool')
      }

      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet adapter must provide both publicKey and signTransaction')
      }

      const investObservable = solanaInvestment.invest(amount, wallet)
      return await executeSolanaTx(investObservable)
    },
    [solanaInvestment, isAvailable, executeSolanaTx]
  )

  return {
    invest,
    isAvailable,
    isPending,
    solanaInvestment,
  }
}
