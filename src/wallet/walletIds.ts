/**
 * Official wallet IDs from WalletConnect Cloud
 * Source: https://walletguide.walletconnect.network/
 *
 * These IDs are used in Reown AppKit's featuredWalletIds to control
 * which wallets appear prominently in the connection modal.
 *
 * Note: Safe wallet is handled separately via the safe() connector in WagmiAdapter
 * and doesn't need to be in featuredWalletIds.
 */
export const WALLET_IDS = {
  // EVM Wallets - Desktop/Browser
  METAMASK: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  RABBY: '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1',
  BITGET: '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
  OKX: '5d9f1395b3a8e848684848dc4147cbd05c8d54bb737eac78fe103901fe6b01a1',
  TRUST_WALLET: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  FIREBLOCKS: '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489',

  // Solana Wallets
  // Note: Solana wallets (Phantom, Solflare, Coinbase) are configured separately
  // via SolanaAdapter wallets array and don't use featuredWalletIds
} as const

/**
 * Featured wallet IDs for AppKit modal
 * These wallets will appear prominently in the connection interface
 */
export const FEATURED_WALLET_IDS = [
  WALLET_IDS.METAMASK,
  WALLET_IDS.RABBY,
  WALLET_IDS.BITGET,
  WALLET_IDS.OKX,
  WALLET_IDS.TRUST_WALLET,
  WALLET_IDS.FIREBLOCKS,
] as const

export type WalletId = (typeof WALLET_IDS)[keyof typeof WALLET_IDS]

export type FeaturedWalletIds = typeof FEATURED_WALLET_IDS
