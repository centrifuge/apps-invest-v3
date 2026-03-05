import type { Vault } from '@centrifuge/sdk'
import type Decimal from 'decimal.js-light'
import type { NetworkSlug, PoolDetails, VaultDetails } from '@cfg'

export const POOL_TABLE_TABS = {
  access: 'access',
  funds: 'funds',
} as const

export type ActiveTab = (typeof POOL_TABLE_TABS)[keyof typeof POOL_TABLE_TABS]

export interface VaultRow {
  networkName: NetworkSlug
  networkDisplayName: string
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

export type SortField =
  | 'name'
  | 'type'
  | 'tvl'
  | 'apy'
  | 'totalAssets'
  | 'totalShares'
  | 'pendingDeposits'
  | 'pendingRedemptions'
  | 'depositClaims'
  | 'redeemClaims'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface PoolInvestmentTotals {
  assetBalance: Decimal
  shareBalance: Decimal
  pendingDepositAssets: Decimal
  pendingRedeemShares: Decimal
  claimableDepositShares: Decimal
  claimableRedeemAssets: Decimal
}
