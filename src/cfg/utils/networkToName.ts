import { NETWORK_IDS } from '../types'

export const networkToName = (networkId: keyof typeof NETWORK_IDS) => {
  switch (networkId) {
    case 1:
      return 'Ethereum'
    case 11155111:
      return 'Ethereum Sepolia'
    case 42220:
      return 'Celo'
    case 44787:
      return 'Celo Alfajores'
    case 42161:
      return 'Arbitrum'
    case 421614:
      return 'Arbitrum Sepolia'
    case 8453:
      return 'Base'
    case 84532:
      return 'Base Sepolia'
    case 98866:
      return 'Plume'
    case 98867:
      return 'Plume testnet'
    case 43114:
      return 'Avalanche'
    case 43113:
      return 'Avalanche Fuji'
    default:
      return 'Ethereum'
  }
}
