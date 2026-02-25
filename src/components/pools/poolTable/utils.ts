import type { Balance } from '@centrifuge/sdk'
import { formatBalanceAbbreviated, type PoolNetworkVaultData } from '@cfg'
import { getPoolTVL } from '@utils/getPoolTVL'
import type { ExpandedPosition, PoolInvestmentTotals, PoolRow, SortConfig, VaultRow } from './types'

export function groupVaultsByPool(
  vaults: PoolNetworkVaultData[],
  helpers: {
    getIsRestrictedPool: (poolId?: string) => boolean
  }
): PoolRow[] {
  const poolMap = new Map<string, PoolRow>()

  for (const v of vaults) {
    const existing = poolMap.get(v.poolId)
    const vaultRow: VaultRow = {
      networkName: v.networkName,
      networkDisplayName: v.networkDisplayName,
      centrifugeId: v.centrifugeId,
      vault: v.vault,
      vaultDetails: v.vaultDetails,
    }

    if (existing) {
      existing.vaults.push(vaultRow)
    } else {
      const poolMetadata = v.poolDetails.metadata?.pool
      const shareClasses = v.poolDetails.metadata?.shareClasses
      const shareClassDetails = shareClasses ? Object.values(shareClasses)[0] : undefined
      const subClass = poolMetadata?.asset.subClass === 'S&P 500' ? 'Equities' : (poolMetadata?.asset.subClass ?? '')

      poolMap.set(v.poolId, {
        poolId: v.poolId,
        poolDetails: v.poolDetails,
        poolName: poolMetadata?.name ?? 'Pool',
        iconUri: poolMetadata?.icon?.uri || null,
        tvl: getPoolTVL(v.poolDetails),
        apy: `${shareClassDetails?.apyPercentage ?? 0}%`,
        assetType: subClass,
        investorType: poolMetadata?.investorType ?? '',
        minInvestment: shareClassDetails?.minInitialInvestment
          ? formatBalanceAbbreviated(shareClassDetails.minInitialInvestment, 0, 'USD')
          : '',
        isRestricted: helpers.getIsRestrictedPool(v.poolId),
        vaults: [vaultRow],
      })
    }
  }

  return Array.from(poolMap.values())
}

export function computeInvestmentTotals(
  investments: {
    assetBalance: Balance
    shareBalance: Balance
    pendingDepositAssets: Balance
    pendingRedeemShares: Balance
    claimableDepositShares: Balance
    claimableRedeemAssets: Balance
  }[]
): PoolInvestmentTotals | null {
  if (!investments || investments.length === 0) return null

  const [first, ...rest] = investments
  return rest.reduce(
    (acc, inv) => ({
      assetBalance: acc.assetBalance.add(inv.assetBalance),
      shareBalance: acc.shareBalance.add(inv.shareBalance),
      pendingDepositAssets: acc.pendingDepositAssets.add(inv.pendingDepositAssets),
      pendingRedeemShares: acc.pendingRedeemShares.add(inv.pendingRedeemShares),
      claimableDepositShares: acc.claimableDepositShares.add(inv.claimableDepositShares),
      claimableRedeemAssets: acc.claimableRedeemAssets.add(inv.claimableRedeemAssets),
    }),
    {
      assetBalance: first.assetBalance,
      shareBalance: first.shareBalance,
      pendingDepositAssets: first.pendingDepositAssets,
      pendingRedeemShares: first.pendingRedeemShares,
      claimableDepositShares: first.claimableDepositShares,
      claimableRedeemAssets: first.claimableRedeemAssets,
    }
  )
}

export function getExpandedCellBorder(position: ExpandedPosition | undefined, cell: 'first' | 'middle' | 'last') {
  if (!position) return {}
  const borderStyle: Record<string, string> = {}

  if (position === 'top') {
    borderStyle.borderTopWidth = '2px'
    borderStyle.borderTopColor = 'border.muted'
  }
  if (position === 'bottom') {
    borderStyle.borderBottomWidth = '2px'
    borderStyle.borderBottomColor = 'border.muted'
  }

  if (cell === 'first') {
    borderStyle.borderLeftWidth = '2px'
    borderStyle.borderLeftColor = 'border.muted'
    if (position === 'top') borderStyle.borderTopLeftRadius = '8px'
    if (position === 'bottom') borderStyle.borderBottomLeftRadius = '8px'
  }

  if (cell === 'last') {
    borderStyle.borderRightWidth = '2px'
    borderStyle.borderRightColor = 'border.muted'
    if (position === 'top') borderStyle.borderTopRightRadius = '8px'
    if (position === 'bottom') borderStyle.borderBottomRightRadius = '8px'
  }

  return borderStyle
}

export function sortPoolRows(
  rows: PoolRow[],
  config: SortConfig | null,
  investmentTotals?: Map<string, PoolInvestmentTotals>
): PoolRow[] {
  if (!config) return rows

  const sorted = [...rows]
  const sortDirection = config.direction === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    switch (config.field) {
      case 'name':
        return sortDirection * a.poolName.localeCompare(b.poolName)
      case 'tvl': {
        const aVal = parseFloat(a.tvl.replace(/,/g, '')) || 0
        const bVal = parseFloat(b.tvl.replace(/,/g, '')) || 0
        return sortDirection * (aVal - bVal)
      }
      case 'apy': {
        const aVal = parseFloat(a.apy) || 0
        const bVal = parseFloat(b.apy) || 0
        return sortDirection * (aVal - bVal)
      }
      case 'totalAssets':
        return (
          sortDirection *
          compareBalance(investmentTotals?.get(a.poolId)?.assetBalance, investmentTotals?.get(b.poolId)?.assetBalance)
        )
      case 'totalShares':
        return (
          sortDirection *
          compareBalance(investmentTotals?.get(a.poolId)?.shareBalance, investmentTotals?.get(b.poolId)?.shareBalance)
        )
      case 'pendingDeposits':
        return (
          sortDirection *
          compareBalance(
            investmentTotals?.get(a.poolId)?.pendingDepositAssets,
            investmentTotals?.get(b.poolId)?.pendingDepositAssets
          )
        )
      case 'pendingRedemptions':
        return (
          sortDirection *
          compareBalance(
            investmentTotals?.get(a.poolId)?.pendingRedeemShares,
            investmentTotals?.get(b.poolId)?.pendingRedeemShares
          )
        )
      case 'depositClaims':
        return (
          sortDirection *
          compareBalance(
            investmentTotals?.get(a.poolId)?.claimableDepositShares,
            investmentTotals?.get(b.poolId)?.claimableDepositShares
          )
        )
      case 'redeemClaims':
        return (
          sortDirection *
          compareBalance(
            investmentTotals?.get(a.poolId)?.claimableRedeemAssets,
            investmentTotals?.get(b.poolId)?.claimableRedeemAssets
          )
        )
      default:
        return 0
    }
  })

  return sorted
}

function compareBalance(a?: Balance, b?: Balance): number {
  const aVal = a?.toFloat() ?? 0
  const bVal = b?.toFloat() ?? 0
  return aVal - bVal
}
