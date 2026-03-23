import { Price } from '@centrifuge/sdk'

export const STABLECOIN_PRICE = new Price(BigInt('1000000000000000000'))

export const stableCoins = [
  {
    address: null,
    name: 'United States Dollar',
    symbol: 'USD',
  },
  {
    address: null,
    name: 'Euro',
    symbol: 'EUR',
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
  },
  {
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42',
    name: 'EURC',
    symbol: 'EURC',
  },
  {
    address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0xdddd73f5df1f0dc31373357beac77545dc5a6f3f',
    name: 'Plume USD',
    symbol: 'pUSD',
  },
  {
    address: '0x78add880a697070c1e765ac44d65323a0dcce913',
    name: 'Bridged USDC (Stargate)',
    symbol: 'USDC.e',
  },
  {
    address: '0x222365ef19f7947e5484218551b56bb3965aa7af',
    name: 'USDC',
    symbol: 'USDC',
  },
  {
    address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0x55d398326f99059ff775485246999027b3197955',
    name: 'Tether USD',
    symbol: 'USDT',
  },
  {
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0xb88339cb7199b77e23db6e890353e22632ba630f',
    name: 'USDC',
    symbol: 'USDC',
  },
  {
    address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    address: '0x754704bc059f8c67012fed69bc8a327a5aafb603',
    name: 'USDC',
    symbol: 'USDC',
  },
]

const STABLECOIN_ADDRESSES = new Set(stableCoins.filter((c) => c.address !== null).map((c) => c.address!.toLowerCase()))

export function isStablecoin(address: string): boolean {
  return STABLECOIN_ADDRESSES.has(address.toLowerCase())
}
