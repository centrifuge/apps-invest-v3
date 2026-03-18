import { SortField } from '@components/pools/poolTable/types'

export interface PoolTableColumns {
  label: string
  field?: SortField
  width: string
  align?: 'left' | 'center' | 'right'
}

interface VaultColumn {
  label: string
  width: string
  align?: 'left' | 'center' | 'right'
}

export const POOL_COLUMNS_ACCESS: PoolTableColumns[] = [
  { label: 'Fund', field: 'name', width: '20%', align: 'left' },
  { label: 'Total Assets', field: 'totalAssets', width: '12%', align: 'right' },
  { label: 'Total Tokens', field: 'totalShares', width: '12%', align: 'right' },
  { label: 'Pending Deposits', field: 'pendingDeposits', width: '14%', align: 'right' },
  { label: 'Pending Redeems', field: 'pendingRedemptions', width: '14%', align: 'right' },
  { label: 'Deposit Claims', field: 'depositClaims', width: '14%', align: 'right' },
  { label: 'Redeem Claims', field: 'redeemClaims', width: '14%', align: 'right' },
]

export const VAULT_COLUMNS_ACCESS: VaultColumn[] = [
  { label: 'Network', width: '16%', align: 'left' },
  { label: 'Vault', width: '8%', align: 'center' },
  { label: 'Asset Balance', width: '12%', align: 'right' },
  { label: 'Share Balance', width: '12%', align: 'right' },
  { label: 'Pending Deposit', width: '13%', align: 'right' },
  { label: 'Pending Redeem', width: '13%', align: 'right' },
  { label: 'Claimable Deposit', width: '13%', align: 'right' },
  { label: 'Claimable Redeem', width: '13%', align: 'right' },
]

export const POOL_COLUMNS_PRODUCTS: PoolTableColumns[] = [
  { label: 'Token', field: 'name', width: '24%', align: 'left' },
  { label: 'APY', field: 'apy', width: '10%', align: 'center' },
  { label: 'TVL (USD)', field: 'tvl', width: '16%', align: 'right' },
  { label: 'Asset type', width: '20%', align: 'left' },
  { label: 'Investor type', width: '20%', align: 'left' },
  { label: 'Min. Investment', width: '10%', align: 'right' },
]

export const VAULT_COLUMNS_PRODUCTS: VaultColumn[] = [
  { label: 'Network', width: '16%', align: 'left' },
  { label: 'Vault', width: '8%', align: 'center' },
  { label: 'Asset Balance', width: '16%', align: 'right' },
  { label: 'NAV', width: '16%', align: 'right' },
  { label: 'Total Issuance', width: '24%', align: 'right' },
  { label: 'Token Price', width: '20%', align: 'right' },
]
