import { Pool, Vault } from '@centrifuge/sdk'

export type CurrencyDetails = {
  name: string
  symbol: string
  decimals: number
}

export type PoolDetails = Awaited<ReturnType<typeof Pool.prototype.details>>
export type VaultDetails = Awaited<ReturnType<typeof Vault.prototype.details>>
