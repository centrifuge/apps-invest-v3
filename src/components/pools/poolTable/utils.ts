import { formatBalanceAbbreviated, type PoolNetworkVaultData } from '@cfg'
import { getPoolTVL } from '@utils/getPoolTVL'
import type { ExpandedPosition, PoolRow, SortConfig, VaultRow } from './types'

export function getExpandedCellBorder(pos: ExpandedPosition | undefined, cell: 'first' | 'middle' | 'last') {
  if (!pos) return {}
  const s: Record<string, string> = {}

  if (pos === 'top') { s.borderTopWidth = '2px'; s.borderTopColor = 'border.muted' }
  if (pos === 'bottom') { s.borderBottomWidth = '2px'; s.borderBottomColor = 'border.muted' }

  if (cell === 'first') {
    s.borderLeftWidth = '2px'; s.borderLeftColor = 'border.muted'
    if (pos === 'top') s.borderTopLeftRadius = '8px'
    if (pos === 'bottom') s.borderBottomLeftRadius = '8px'
  }

  if (cell === 'last') {
    s.borderRightWidth = '2px'; s.borderRightColor = 'border.muted'
    if (pos === 'top') s.borderTopRightRadius = '8px'
    if (pos === 'bottom') s.borderBottomRightRadius = '8px'
  }

  return s
}

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
      const subClass =
        poolMetadata?.asset.subClass === 'S&P 500' ? 'Equities' : (poolMetadata?.asset.subClass ?? '')

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

export function sortPoolRows(rows: PoolRow[], config: SortConfig | null): PoolRow[] {
  if (!config) return rows

  const sorted = [...rows]
  const dir = config.direction === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    switch (config.field) {
      case 'name':
        return dir * a.poolName.localeCompare(b.poolName)
      case 'tvl': {
        const aVal = parseFloat(a.tvl.replace(/,/g, '')) || 0
        const bVal = parseFloat(b.tvl.replace(/,/g, '')) || 0
        return dir * (aVal - bVal)
      }
      case 'apy': {
        const aVal = parseFloat(a.apy) || 0
        const bVal = parseFloat(b.apy) || 0
        return dir * (aVal - bVal)
      }
      default:
        return 0
    }
  })

  return sorted
}
