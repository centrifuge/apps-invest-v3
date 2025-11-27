import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import { useWalletConnection } from '@wallet/useWalletConnection'

export const walletAdapterFallback = {
  publicKey: undefined,
  signTransaction: undefined,
  signAllTransactions: undefined,
}

export interface SolanaWalletAdapter {
  publicKey: PublicKey | null | undefined
  signTransaction: (<T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>) | undefined
  signAllTransactions: (<T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>) | undefined
}

interface WindowWithSolana extends Window {
  solana?: SolanaWalletAdapter
}

/**
 * Accesses the Solana wallet directly from the browser's window object.
 * Returns publicKey (as PublicKey object) and signTransaction functions needed for Solana transactions.
 * Using appkit causes loading issues when switching between EVM and Solana wallets.
 */
export function useSolanaWalletAdapter(): SolanaWalletAdapter {
  const { walletType } = useWalletConnection()

  if (walletType !== 'solana') return walletAdapterFallback

  // Solana wallets inject themselves as window.solana (Phantom, Solflare, etc.)
  const solanaWallet = typeof window !== 'undefined' ? (window as WindowWithSolana).solana : undefined

  if (!solanaWallet) return walletAdapterFallback

  // Get publicKey directly from wallet (already a PublicKey object)
  const publicKey = solanaWallet.publicKey
  const signTransaction = solanaWallet.signTransaction?.bind(solanaWallet)
  const signAllTransactions = solanaWallet.signAllTransactions?.bind(solanaWallet)

  return {
    publicKey,
    signTransaction,
    signAllTransactions,
  }
}
