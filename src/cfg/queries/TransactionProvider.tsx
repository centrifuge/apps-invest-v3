import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { TransactionToasts } from '../components'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TransactionStatus = 'creating' | 'unconfirmed' | 'pending' | 'succeeded' | 'failed'
export type Transaction = {
  id: string
  title: string
  status: TransactionStatus
  hash?: string
  result?: any
  failedReason?: string
  error?: any
  dismissed?: boolean
}
/* eslint-enable @typescript-eslint/no-explicit-any */

type TransactionsContextType = {
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  addOrUpdateTransaction: (tx: Transaction) => void
  updateTransaction: (id: string, update: Partial<Transaction> | ((prev: Transaction) => Partial<Transaction>)) => void
}

const defaultContextValues = {
  transactions: [],
  addTransaction: () => {},
  addOrUpdateTransaction: () => {},
  updateTransaction: () => {},
}

const TransactionsContext = createContext<TransactionsContextType>(defaultContextValues)

type TransactionProviderProps = {
  children: ReactNode
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [...prev, tx])
  }, [])

  const updateTransaction = useCallback(
    (id: string, update: Partial<Transaction> | ((prev: Transaction) => Partial<Transaction>)) => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === id
            ? {
                ...tx,
                dismissed: false,
                ...(typeof update === 'function' ? update(tx) : update),
              }
            : tx
        )
      )
    },
    []
  )

  const addOrUpdateTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => {
      if (prev.find((t) => t.id === tx.id)) {
        return prev.map((t) => (t.id === tx.id ? { ...t, dismissed: false, ...tx } : t))
      }
      return [...prev, tx]
    })
  }, [])

  const ctx: TransactionsContextType = useMemo(
    () => ({
      transactions,
      addTransaction,
      updateTransaction,
      addOrUpdateTransaction,
    }),
    [transactions, addTransaction, updateTransaction, addOrUpdateTransaction]
  )

  return (
    <TransactionsContext.Provider value={ctx}>
      {children}
      <TransactionToasts />
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx || ctx === defaultContextValues) throw new Error('useTransactions must be used within TransactionProvider')
  return ctx
}

export function useTransaction(id?: string) {
  const { transactions } = useTransactions()
  return id ? transactions.find((tx) => tx.id === id) : null
}
