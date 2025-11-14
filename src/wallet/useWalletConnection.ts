import { useAccount } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { useDebugFlags } from '@cfg'

export type WalletType = 'evm' | 'solana' | null

export interface WalletConnection {
  address: string | undefined
  isConnected: boolean
  walletType: WalletType
  chainId: number | undefined
  publicKey: string | undefined
}

// Unified hook for both EVM and Solana wallet connections.
export function useWalletConnection(): WalletConnection {
  const { address: debugAddress } = useDebugFlags()
  const { chainId } = useAccount()

  // AppKit account - works for both EVM and Solana.
  const { address: appKitAddress, caipAddress, isConnected } = useAppKitAccount()

  if (!isConnected || !appKitAddress) {
    return {
      address: undefined,
      isConnected: false,
      walletType: null,
      chainId: undefined,
      publicKey: undefined,
    }
  }

  // Detect chain type from CAIP address.
  // CAIP format: "chainNamespace:chainId:address"
  // EVM example: "eip155:1:0x1234..."
  // Solana example: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:Abc123..."
  // const isEVM = appKitCaipAddress?.startsWith('eip155:')
  const isSolana = caipAddress?.startsWith('solana:')

  if (isSolana) {
    return {
      address: appKitAddress,
      isConnected: true,
      walletType: 'solana',
      chainId: undefined,
      publicKey: appKitAddress,
    }
  }

  return {
    address: (debugAddress as `0x${string}`) || appKitAddress,
    isConnected: true,
    walletType: 'evm',
    chainId,
    publicKey: undefined,
  }
}
