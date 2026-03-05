import type { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'
import { formatBalanceAbbreviated, type PoolNetworkVaultData } from '@cfg'
import { getPoolTVL } from '@utils/getPoolTVL'
import type { PoolInvestmentTotals, PoolRow, SortConfig, VaultRow } from './types'

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

  const toDecimal = (b: Balance) => b.toDecimal()

  const [first, ...rest] = investments
  return rest.reduce(
    (acc, inv) => ({
      assetBalance: acc.assetBalance.add(toDecimal(inv.assetBalance)),
      shareBalance: acc.shareBalance.add(toDecimal(inv.shareBalance)),
      pendingDepositAssets: acc.pendingDepositAssets.add(toDecimal(inv.pendingDepositAssets)),
      pendingRedeemShares: acc.pendingRedeemShares.add(toDecimal(inv.pendingRedeemShares)),
      claimableDepositShares: acc.claimableDepositShares.add(toDecimal(inv.claimableDepositShares)),
      claimableRedeemAssets: acc.claimableRedeemAssets.add(toDecimal(inv.claimableRedeemAssets)),
    }),
    {
      assetBalance: toDecimal(first.assetBalance),
      shareBalance: toDecimal(first.shareBalance),
      pendingDepositAssets: toDecimal(first.pendingDepositAssets),
      pendingRedeemShares: toDecimal(first.pendingRedeemShares),
      claimableDepositShares: toDecimal(first.claimableDepositShares),
      claimableRedeemAssets: toDecimal(first.claimableRedeemAssets),
    }
  )
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

function compareBalance(a?: Decimal, b?: Decimal): number {
  const aVal = a?.toNumber() ?? 0
  const bVal = b?.toNumber() ?? 0
  return aVal - bVal
}
