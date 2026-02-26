import {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  celo,
  celoSepolia,
  optimism,
  bsc,
  bscTestnet,
  monad,
  hyperEvm,
  hyperliquidEvmTestnet,
} from 'viem/chains'
import { chains } from '@centrifuge/sdk'
import { AppKitNetwork } from '@reown/appkit/networks'

/**
 * Chain configuration module - single source of truth for all chain-related config.
 *
 * This module centralizes chain definitions for WalletProvider and ConnectionGuard.
 */

const MAINNET_CHAINS = chains
  .filter((chain) => !chain.testnet)
  .sort((a, b) => a.name.localeCompare(b.name)) as AppKitNetwork[]
const TESTNET_CHAINS = chains
  .filter((chain) => chain.testnet)
  .sort((a, b) => a.name.localeCompare(b.name)) as AppKitNetwork[]

export const ALL_CHAINS = [...MAINNET_CHAINS, ...TESTNET_CHAINS]

export const MAINNET_CHAIN_IDS: number[] = MAINNET_CHAINS.map((c) => Number(c.id))
export const TESTNET_CHAIN_IDS: number[] = TESTNET_CHAINS.map((c) => Number(c.id))

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY

export const MAINNET_RPC_URLS: Record<number, string[]> = {
  [mainnet.id]: [`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [base.id]: [`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [arbitrum.id]: [`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [avalanche.id]: [`https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [celo.id]: [`https://celo-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [optimism.id]: [`https://optimism-rpc.publicnode.com`],
  [bsc.id]: [`https://bsc-dataseed.binance.org`],
  [monad.id]: [`https://rpc.monad.xyz`],
  [hyperEvm.id]: [`https://rpc.hyperliquid.xyz/evm`],
}

export const TESTNET_RPC_URLS: Record<number, string[]> = {
  [sepolia.id]: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [baseSepolia.id]: [`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [arbitrumSepolia.id]: [`https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [avalancheFuji.id]: [`https://avax-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [celoSepolia.id]: [`https://celo-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  [bscTestnet.id]: [`https://data-seed-prebsc-1-s1.binance.org:8545`],
  [hyperliquidEvmTestnet.id]: [`https://rpc.hyperliquid-testnet.xyz/evm`],
}
