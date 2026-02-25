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
  { label: 'Fund', field: 'name', width: '20%' },
  { label: 'Type', width: '8%', align: 'center' },
  { label: 'Total Assets', field: 'totalAssets', width: '12%', align: 'right' },
  { label: 'Total Shares', field: 'totalShares', width: '12%', align: 'right' },
  { label: 'Total Pending Deposits', field: 'pendingDeposits', width: '12%', align: 'right' },
  { label: 'Total Pending Redemptions', field: 'pendingRedemptions', width: '12%', align: 'right' },
  { label: 'Total Deposit Claims', field: 'depositClaims', width: '12%', align: 'right' },
  { label: 'Total Redeem Claims', field: 'redeemClaims', width: '12%', align: 'right' },
]

export const VAULT_COLUMNS_ACCESS: VaultColumn[] = [
  { label: 'Vault', width: '20%' },
  { label: 'Asset', width: '8%', align: 'center' },
  { label: 'Asset Balance', width: '12%', align: 'right' },
  { label: 'Share Balance', width: '12%', align: 'right' },
  { label: 'Pending Deposit', width: '12%', align: 'right' },
  { label: 'Pending Redeem', width: '12%', align: 'right' },
  { label: 'Claimable Deposit', width: '12%', align: 'right' },
  { label: 'Claimable Redeem', width: '12%', align: 'right' },
]

export const POOL_COLUMNS_FUNDS: PoolTableColumns[] = [
  { label: 'Fund', field: 'name', width: '20%' },
  { label: 'Type', width: '8%', align: 'center' },
  { label: 'APY', field: 'apy', width: '8%', align: 'center' },
  { label: 'TVL (USD)', field: 'tvl', width: '14%', align: 'right' },
  { label: 'Asset type', width: '20%' },
  { label: 'Investor type', width: '20%' },
  { label: 'Min. Investment', width: '10%', align: 'right' },
]

export const VAULT_COLUMNS_FUNDS: VaultColumn[] = [
  { label: 'Vault', width: '20%' },
  { label: 'Asset', width: '8%', align: 'center' },
  { label: 'Token', width: '8%', align: 'center' },
  { label: 'NAV', width: '14%', align: 'right' },
  { label: 'Total Issuance', width: '20%', align: 'right' },
  { label: 'Price/Share', width: '20%', align: 'right' },
  { label: '', width: '10%' },
]
