import { divideBigInts, formatBalance } from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { useMemo } from 'react'

export function useGetPendingInvestments() {
  const { investment, vaultDetails } = useVaultsContext()
  const { poolDetails } = usePoolContext()

  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare

  const calculatedInvestSharesEstimate = useMemo(() => {
    if (!investment || !investment.pendingDepositAssets || investment.pendingDepositAssets.isZero() || !pricePerShare) {
      return undefined
    }

    const investAmountBigint = investment.pendingDepositAssets.toBigInt()
    const pricePerShareBigint = pricePerShare.toBigInt()

    return divideBigInts(investAmountBigint, pricePerShareBigint, pricePerShare.decimals).formatToString(
      investment.pendingDepositAssets.decimals,
      2
    )
  }, [investment?.pendingDepositAssets, pricePerShare])

  const calculatedRedeemAmountEstimate = useMemo(() => {
    if (!investment || !investment?.pendingRedeemShares || investment?.pendingRedeemShares.isZero() || !pricePerShare) {
      return undefined
    }

    return formatBalance(investment.pendingRedeemShares.mul(pricePerShare))
  }, [])

  return {
    investment,
    asset: investment?.asset,
    pendingDepositAssets: investment?.pendingDepositAssets,
    share: investment?.share,
    pendingRedeemShares: investment?.pendingRedeemShares,
    calculatedInvestSharesEstimate,
    calculatedRedeemAmountEstimate,
    hasPendingRedeems: !!(investment && investment.pendingRedeemShares && !investment.pendingRedeemShares.isZero()),
    hasPendingInvestments: !!(
      investment &&
      investment.pendingDepositAssets &&
      !investment.pendingDepositAssets.isZero()
    ),
  }
}
