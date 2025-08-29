export type Network = 'ethereum' | 'arbitrum' | 'celo' | 'base' | 'plume' | 'avalanche' | 'bnb'

export const NETWORK_IDS: Record<number, Network> = {
  1: 'ethereum', // Ethereum Mainnet
  11155111: 'ethereum', // Ethereum Sepolia
  42161: 'arbitrum', // Arbitrum One
  421614: 'arbitrum', // Arbitrum Sepolia
  42220: 'celo', // Celo Mainnet
  44787: 'celo', // Celo Alfajores
  8453: 'base', // Base Mainnet
  84532: 'base', // Base Sepolia
  98866: 'plume', // Plume
  98867: 'plume', // Plume Testnet
  43114: 'avalanche', // Avalanche Mainnet
  43113: 'avalanche', // Avalanche Fuji Testnet
  56: 'bnb', // Binance mainnet
  97: 'bnb', // Binance testnet
} as const
