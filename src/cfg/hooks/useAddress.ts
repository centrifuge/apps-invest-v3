import { useWalletConnection } from '@wallet/useWalletConnection'

/**
 * Hook for accessing wallet address across both EVM and Solana chains
 * This maintains backward compatibility with existing code that uses useAddress
 *
 * IMPORTANT: For EVM-only operations (Centrifuge SDK), use the `evmAddress` property
 * which ensures type safety with `0x${string}` format. The generic `address` property
 * may contain Solana addresses which are incompatible with EVM operations.
 *
 * @returns {Object} Wallet connection details
 * @property {string | undefined} address - The connected wallet address (EVM or Solana format)
 * @property {`0x${string}` | undefined} evmAddress - EVM address only (undefined if Solana wallet connected)
 * @property {boolean} isConnected - Whether a wallet is connected
 * @property {number | undefined} chainId - EVM chain ID (undefined for Solana)
 * @property {'evm' | 'solana' | null} walletType - Type of connected wallet
 * @property {string | undefined} publicKey - Solana public key (undefined for EVM)
 * @property {boolean} isSolanaWallet - Whether the connected wallet is a Solana wallet
 * @property {boolean} isEvmWallet - Whether the connected wallet is an EVM wallet
 */
const useAddress = () => {
  const connection = useWalletConnection()

  return {
    ...connection,
    evmAddress: connection.isEvmWallet ? (connection.address as `0x${string}`) : undefined,
  }
}

export { useAddress }
