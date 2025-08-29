import { useEffect, useRef, useCallback } from 'react'
import { TransactionToaster, toaster } from './TransactionToaster'
import { useTransactions } from '../../hooks/TransactionProvider'
import { useChainId } from 'wagmi'
import { chainExplorer } from '../../utils'

export function TransactionToasts() {
  const { transactions } = useTransactions()
  const chainId = useChainId()
  const blockExplorerUrl = chainExplorer[chainId]

  const activeToastIds = useRef<Record<string, string>>({})
  const processedTransactions = useRef<Set<string>>(new Set())

  const txHashLink = (message: string, txHash?: string) => (
    <>
      <p>{message}</p>
      {txHash ? (
        <a href={`${blockExplorerUrl}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{`Hash: ${txHash}`}</a>
      ) : null}
    </>
  )

  const deferToastOperation = useCallback((operation: () => void) => {
    // This is to ensure we're outside the render cycle.
    // Fixes error caused by Chakra toast flushSync operation on multiple toast updates.
    requestAnimationFrame(() => {
      setTimeout(operation, 0)
    })
  }, [])

  useEffect(() => {
    const handleToastUpdates = () => {
      transactions.forEach((tx) => {
        const txKey = `${tx.id}-${tx.status}`

        switch (tx.status) {
          case 'creating':
          case 'unconfirmed':
          case 'pending': {
            if (!activeToastIds.current[tx.id] && !tx.dismissed && !processedTransactions.current.has(txKey)) {
              processedTransactions.current.add(txKey)

              deferToastOperation(() => {
                if (!activeToastIds.current[tx.id]) {
                  const toastId = toaster.create({
                    title: tx.title,
                    description:
                      tx.status === 'creating'
                        ? 'Creating transaction'
                        : tx.status === 'unconfirmed'
                          ? 'Signing transaction'
                          : 'Transaction pending',
                    type: 'loading',
                    duration: undefined,
                    closable: true,
                    id: tx.id,
                  })

                  activeToastIds.current[tx.id] = toastId
                }
              })
            }
            break
          }
          case 'succeeded': {
            if (activeToastIds.current[tx.id] && !processedTransactions.current.has(txKey)) {
              processedTransactions.current.add(txKey)

              deferToastOperation(() => {
                const toastIdToUpdate = activeToastIds.current[tx.id]
                if (toastIdToUpdate) {
                  const txHash = (tx.result?.transactionHash as string) || tx.hash
                  const message = 'Transaction succeeded'

                  toaster.update(toastIdToUpdate, {
                    title: tx.title,
                    description: txHashLink(message, txHash),
                    type: 'success',
                    duration: 10_000,
                    closable: true,
                  })

                  // Force a re-render to always show success toast, otherwise,
                  // if you have multiple toasts the early ones do not re-render with updates.
                  setTimeout(() => {
                    toaster.dismiss(toastIdToUpdate)
                    const newToastId = toaster.create({
                      title: tx.title,
                      description: txHashLink(message, txHash),
                      type: 'success',
                      duration: 10_000,
                      closable: true,
                    })
                    activeToastIds.current[tx.id] = newToastId
                  }, 50)
                }
              })
            }
            break
          }
          case 'failed': {
            if (!processedTransactions.current.has(txKey)) {
              processedTransactions.current.add(txKey)

              deferToastOperation(() => {
                const oldId = activeToastIds.current[tx.id]
                if (oldId) {
                  toaster.dismiss(oldId)
                }

                const reason = tx.failedReason ?? tx.error?.shortMessage ?? tx.error?.message ?? ''
                const msg = `Transaction failed${reason ? `: ${reason}` : ''}`
                const txHash = (tx.result?.transactionHash as string) || tx.hash

                const newId = toaster.create({
                  title: tx.title,
                  description: txHashLink(msg, txHash),
                  type: 'error',
                  duration: 60_000,
                  closable: true,
                })
                activeToastIds.current[tx.id] = newId
              })
            }
            break
          }
        }

        if (tx.dismissed && activeToastIds.current[tx.id]) {
          deferToastOperation(() => {
            const toastIdToDismiss = activeToastIds.current[tx.id]
            if (toastIdToDismiss) {
              toaster.dismiss(toastIdToDismiss)
              delete activeToastIds.current[tx.id]
            }
          })
        }
      })

      // Cleanup: Dismiss any toasts that are no longer present in the `transactions` list
      const currentTxIds = new Set(transactions.map((t) => t.id))
      for (const txId in activeToastIds.current) {
        if (!currentTxIds.has(txId)) {
          deferToastOperation(() => {
            const toastIdToDismiss = activeToastIds.current[txId]
            if (toastIdToDismiss) {
              toaster.dismiss(toastIdToDismiss)
              delete activeToastIds.current[txId]
            }
          })
        }
      }
    }

    handleToastUpdates()
  }, [transactions, deferToastOperation])

  useEffect(() => {
    return () => {
      Object.values(activeToastIds.current).forEach((toastId) => {
        toaster.dismiss(toastId)
      })
      activeToastIds.current = {}
      processedTransactions.current.clear()
    }
  }, [])

  return <TransactionToaster />
}
