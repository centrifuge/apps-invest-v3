import { type OperationConfirmedStatus, type Transaction } from '@centrifuge/sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tap } from 'rxjs'
import { waitForTransactionReceipt } from 'viem/actions'
import { useConnectorClient, usePublicClient } from 'wagmi'
import { useCentrifuge } from './CentrifugeContext'
import { useTransactions } from './TransactionProvider'

/**
 * Polling interval (ms) for fast transaction receipt detection.
 * We poll faster than the SDK default so the UI reflects confirmed transactions quickly.
 */
const TX_POLLING_INTERVAL = 2_000

export function useCentrifugeTransaction() {
  const centrifuge = useCentrifuge()
  const { updateTransaction, addOrUpdateTransaction, addTransaction } = useTransactions()
  const { data: client } = useConnectorClient()
  const publicClient = usePublicClient()
  const queryClient = useQueryClient()
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: execute,
  })

  function invalidateTransactionQueries() {
    queryClient.invalidateQueries({ queryKey: ['poolsAccessStatus'] })
    queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    queryClient.invalidateQueries({ queryKey: ['investor'] })
    queryClient.invalidateQueries({ queryKey: ['isMember'] })
    queryClient.invalidateQueries({ queryKey: ['investment'] })
    queryClient.invalidateQueries({ queryKey: ['holdings'] })
    queryClient.invalidateQueries({ queryKey: ['investmentsPerVaults'] })
  }

  function execute(observable: Transaction): Promise<OperationConfirmedStatus> {
    if (!client) {
      throw new Error('No wallet connected')
    }
    centrifuge.setSigner(client)

    return new Promise<OperationConfirmedStatus>((resolve, reject) => {
      let lastId = ''
      let settled = false

      function settleSuccess(result: OperationConfirmedStatus) {
        if (settled) return
        settled = true
        invalidateTransactionQueries()
        resolve(result)
      }

      function settleError(error: Error) {
        if (settled) return
        settled = true
        reject(error)
      }

      const subscription = observable
        .pipe(
          tap((result) => {
            switch (result.type) {
              case 'SigningTransaction':
                lastId = result.id
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'unconfirmed',
                })
                break
              case 'TransactionPending':
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'pending',
                })
                if (publicClient) {
                  const title = result.title
                  const txId = lastId
                  waitForTransactionReceipt(publicClient, {
                    hash: result.hash,
                    pollingInterval: TX_POLLING_INTERVAL,
                    timeout: 60_000,
                  })
                    .then((receipt) => {
                      addOrUpdateTransaction({
                        id: txId,
                        title,
                        status: receipt.status === 'success' ? 'succeeded' : 'failed',
                        result: receipt,
                      })
                      if (receipt.status === 'success') {
                        settleSuccess(result as unknown as OperationConfirmedStatus)
                      } else {
                        settleError(new Error('Transaction failed'))
                      }
                    })
                    .catch(() => {
                      // Ignore – the SDK's own confirmation will handle it as a fallback
                    })
                }
                break
              case 'TransactionConfirmed':
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'succeeded',
                  result: result.receipt,
                })
                settleSuccess(result as unknown as OperationConfirmedStatus)
                break
            }
          })
        )
        .subscribe({
          error: (e) => {
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
                title: 'Transaction Failed',
                status: 'failed',
                failedReason: error.message,
                error: e,
              })
            }
            settleError(error)
          },
          complete: () => {
            // Clean up once the SDK observable completes
            subscription.unsubscribe()
          },
        })
    })
  }

  return {
    execute: mutateAsync,
    ...rest,
  }
}
