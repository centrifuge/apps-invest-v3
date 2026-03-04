import { type OperationConfirmedStatus, type Transaction } from '@centrifuge/sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lastValueFrom, tap } from 'rxjs'
import { useConnectorClient } from 'wagmi'
import { useCentrifuge } from './CentrifugeContext'
import { useTransactions } from './TransactionProvider'

export function useCentrifugeTransaction() {
  const centrifuge = useCentrifuge()
  const { updateTransaction, addOrUpdateTransaction, addTransaction } = useTransactions()
  const { data: client } = useConnectorClient()
  const queryClient = useQueryClient()
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: execute,
  })

  async function execute(observable: Transaction) {
    if (!client) {
      throw new Error('No wallet connected')
    }
    centrifuge.setSigner(client)
    let lastId = ''
    try {
      const lastResult = await lastValueFrom(
        observable.pipe(
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
                break
              case 'TransactionConfirmed':
                addOrUpdateTransaction({
                  id: lastId,
                  title: result.title,
                  status: 'succeeded',
                  result: result.receipt,
                })
                // Centralized cache invalidation after any successful transaction.
                // Only add queries here that need to be refetched after any transaction.
                // Avoid adding queries that can be refetched by specific components to prevent unnecessary refetches.
                queryClient.invalidateQueries({ queryKey: ['investment'] })
                queryClient.invalidateQueries({ queryKey: ['investmentsPerVaults'] })
                queryClient.invalidateQueries({ queryKey: ['poolsAccessStatus'] })
                queryClient.invalidateQueries({ queryKey: ['portfolio'] })
                queryClient.invalidateQueries({ queryKey: ['investor'] })
                queryClient.invalidateQueries({ queryKey: ['isMember'] })
            }
          })
        )
      )
      return lastResult as OperationConfirmedStatus
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
          title: 'Transaction Failed',
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
