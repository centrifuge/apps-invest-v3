import { type SolanaTransactionStatus } from '@centrifuge/sdk'
import { useMutation } from '@tanstack/react-query'
import { lastValueFrom, tap, Observable } from 'rxjs'
import { useTransactions } from './TransactionProvider'

/**
 * Hook for executing Solana transactions
 * Unlike EVM transactions, Solana transactions don't require setSigner
 * The wallet adapter (publicKey, signTransaction) is passed directly to the transaction method
 *
 * Solana transaction lifecycle:
 * - preparing: Transaction is being prepared
 * - signing: Waiting for user to sign in wallet
 * - sending: Transaction is being sent to network
 * - confirming: Transaction is sent, waiting for confirmation
 * - confirmed: Transaction is confirmed on-chain
 */
export function useSolanaTransaction() {
  const { updateTransaction, addOrUpdateTransaction, addTransaction } = useTransactions()
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: executeSolana,
  })

  async function executeSolana(observable: Observable<SolanaTransactionStatus>) {
    let lastId = ''
    try {
      const lastResult = await lastValueFrom(
        observable.pipe(
          tap((result) => {
            switch (result.type) {
              case 'preparing':
                break
              case 'signing':
                lastId = `solana-tx-${Date.now()}`
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.message || 'Sign Solana Transaction',
                  status: 'unconfirmed',
                })
                break
              case 'sending':
              case 'confirming':
                if (lastId) {
                  addOrUpdateTransaction({
                    id: lastId,
                    title: result.message || 'Confirming Transaction',
                    status: 'pending',
                    hash: result.type === 'confirming' ? result.signature : undefined,
                  })
                }
                break
              case 'confirmed':
                if (lastId) {
                  addOrUpdateTransaction({
                    id: lastId,
                    title: result.message || 'Transaction Confirmed',
                    status: 'succeeded',
                    hash: result.signature,
                    result: { signature: result.signature },
                  })
                }
            }
          })
        )
      )
      return lastResult
    } catch (e) {
      const error = e as Error
      if (lastId) {
        updateTransaction(lastId, {
          status: 'failed',
          failedReason: error.message,
          error: e,
        })
      } else {
        addTransaction({
          id: `failed-tx-${Date.now()}`,
          title: 'Solana Transaction Failed',
          status: 'failed',
          failedReason: error.message,
          error: e,
        })
      }
      throw e
    }
  }

  return {
    execute: mutateAsync,
    ...rest,
  }
}
