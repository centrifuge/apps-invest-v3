import { useEffect, useState } from 'react'
import { useTransactions } from '@cfg'

interface TxState {
  header: string
  isApproved?: boolean
  isSuccessful: boolean
  isFailed: boolean
}

type TransactionType = 'invest' | 'redeem'

interface TxStateFeedbackProps {
  type: TransactionType
}

const defaultTxState: TxState = {
  header: 'Transaction pending',
  isApproved: false,
  isSuccessful: false,
  isFailed: false,
}

const getHeaders = (type: TransactionType) => ({
  signing: 'Signing transaction',
  failed: 'Transaction failed',
  success: type === 'invest' ? 'Investment in progress' : 'Redemption in progress',
})

export function useTxStateFeedback({ type }: TxStateFeedbackProps) {
  const { transactions } = useTransactions()
  const [txState, setTxState] = useState<TxState>(defaultTxState)
  const [processedTxIds, setProcessedTxIds] = useState<Set<string>>(new Set())

  const resetTxState = () => {
    setTxState(defaultTxState)
    setProcessedTxIds(new Set())
  }

  useEffect(() => {
    resetTxState()
  }, [type])

  useEffect(() => {
    const headers = getHeaders(type)

    transactions.forEach((tx) => {
      switch (tx.status) {
        case 'unconfirmed': {
          setTxState({
            header: headers.signing,
            isApproved: true,
            isSuccessful: false,
            isFailed: false,
          })
          if (!processedTxIds.has(tx.id)) setProcessedTxIds((prev) => new Set(prev).add(tx.id))
          break
        }
        case 'failed': {
          setTxState({
            header: headers.failed,
            isApproved: false,
            isSuccessful: false,
            isFailed: true,
          })
          if (!processedTxIds.has(tx.id)) setProcessedTxIds((prev) => new Set(prev).add(tx.id))
          break
        }
        case 'succeeded': {
          if (type === 'invest') {
            if (tx.title === 'Approve') {
              setTxState((prev) => ({
                ...prev,
                isApproved: true,
              }))
            } else if (tx.title === 'Invest') {
              setTxState({
                header: headers.success,
                isApproved: true,
                isSuccessful: true,
                isFailed: false,
              })
            }
          } else if (type === 'redeem' && tx.title === 'Redeem') {
            setTxState({
              header: headers.success,
              isSuccessful: true,
              isFailed: false,
            })
          }
          if (!processedTxIds.has(tx.id)) setProcessedTxIds((prev) => new Set(prev).add(tx.id))
          break
        }
        default: {
          setTxState(defaultTxState)
        }
      }
    })
  }, [transactions, type])

  return {
    txState,
    resetTxState,
    isTxInProgress: !txState.isSuccessful && !txState.isFailed,
  }
}
