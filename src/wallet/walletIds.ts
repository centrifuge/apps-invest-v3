/**
 * Official wallet IDs for EVM Wallets used in Desktop/Browser from WalletConnect Cloud
 * Source: https://walletguide.walletconnect.network/
 *
 * These IDs are used in Reown AppKit's featuredWalletIds to control
 * which wallets appear prominently in the connection modal.
 *
 * Note: Safe wallet is handled separately via the safe() connector in WagmiAdapter
 * and doesn't need to be in featuredWalletIds.
 *
 * Note: Solana wallets (Phantom, Solflare, Coinbase) are configured separately
 * via SolanaAdapter wallets array and don't use featuredWalletIds.
 */
export const WALLET_IDS = {
  METAMASK: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  RABBY: '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1',
  FIREBLOCKS: '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489',
  COINBASE_WALLET: 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  TRUST_WALLET: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  BITGET: '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
  OKX: '5d9f1395b3a8e848684848dc4147cbd05c8d54bb737eac78fe103901fe6b01a1',
} as const

// Order matters for which appear first
export const FEATURED_WALLET_IDS = [
  WALLET_IDS.METAMASK,
  WALLET_IDS.RABBY,
  WALLET_IDS.FIREBLOCKS,
  WALLET_IDS.COINBASE_WALLET,
  WALLET_IDS.TRUST_WALLET,
  WALLET_IDS.BITGET,
  WALLET_IDS.OKX,
] as const

export type WalletId = (typeof WALLET_IDS)[keyof typeof WALLET_IDS]

export type FeaturedWalletIds = typeof FEATURED_WALLET_IDS
