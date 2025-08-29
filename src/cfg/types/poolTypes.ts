import { Pool, PoolMetadata, Vault } from '@centrifuge/sdk'

export type CurrencyDetails = {
  name: string
  symbol: string
  decimals: number
}

// Todo: update sdk with correct types
export type PoolDetails = Omit<Awaited<ReturnType<typeof Pool.prototype.details>>, 'metadata'> & {
  metadata:
    | (PoolMetadata & {
        holdings?: {
          headers: string[]
          data: Array<Record<string, string>>
        } | null
        pool:
          | (PoolMetadata['pool'] & {
              underlying?: {
                poolId: number
              }
            })
          | null
      })
    | null
}

export type VaultDetails = Awaited<ReturnType<typeof Vault.prototype.details>>
