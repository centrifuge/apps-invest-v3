import type { Vault } from '@centrifuge/sdk'
import type { Network, PoolDetails, VaultDetails } from '@cfg'

export interface VaultRow {
  networkName: Network
  centrifugeId: number
  vault: Vault
  vaultDetails: VaultDetails
}

export interface PoolRow {
  poolId: string
  poolDetails: PoolDetails
  poolName: string
  iconUri: string | null
  tvl: string
  apy: string
  assetType: string
  investorType: string
  minInvestment: string
  isRestricted: boolean
  vaults: VaultRow[]
}

export type SortField = 'name' | 'type' | 'tvl' | 'apy'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}
