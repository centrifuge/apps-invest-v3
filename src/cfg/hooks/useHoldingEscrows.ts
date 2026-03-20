import { Balance, type HexString, Price } from '@centrifuge/sdk'
import { useQuery } from '@tanstack/react-query'
import Decimal from 'decimal.js-light'
import { useCentrifuge } from './CentrifugeContext'
import { queryKeys } from './queries/queryKeys'
import { firstValueWithTimeout } from './utils'

const ESCROW_STALE_TIME = 5 * 60 * 1000

interface RawHoldingEscrowItem {
  escrowAddress: string
  centrifugeId: string
  poolId: string
  tokenId: string
  assetAmount: string | null
  assetAddress: string
  assetPrice: string | null
  asset: {
    id: string
    decimals: number | null
    address: string
    name: string | null
    symbol: string | null
  } | null
}

export interface HoldingEscrow {
  escrowAddress: HexString
  centrifugeId: number
  poolId: string
  tokenId: string
  assetAmount: Balance
  assetAddress: HexString
  assetPrice: Price
  assetSymbol: string
  assetName: string
}

export interface HoldingEscrowBalance {
  escrowAddress: HexString
  assetSymbol: string
  assetName: string
  centrifugeId: number
  amount: Balance
  valueUsd: Decimal
  percentage: number
}

function transformEscrow(item: RawHoldingEscrowItem): HoldingEscrow {
  const decimals = item.asset?.decimals ?? 18
  return {
    escrowAddress: item.escrowAddress as HexString,
    centrifugeId: Number(item.centrifugeId),
    poolId: item.poolId,
    tokenId: item.tokenId,
    assetAmount: new Balance(BigInt(item.assetAmount ?? '0'), decimals),
    assetAddress: item.assetAddress as HexString,
    assetPrice: new Price(BigInt(item.assetPrice ?? '0')),
    assetSymbol: item.asset?.symbol ?? '',
    assetName: item.asset?.name ?? '',
  }
}

export function useHoldingEscrows(tokenId: string | undefined) {
  const centrifuge = useCentrifuge()

  return useQuery({
    queryKey: queryKeys.holdingEscrows(tokenId ?? ''),
    queryFn: () =>
      firstValueWithTimeout(
        centrifuge._queryIndexer<{ holdingEscrows: { items: RawHoldingEscrowItem[] } }>(
          `query ($tokenId: String!) {
            holdingEscrows(where: { tokenId: $tokenId }) {
              items {
                escrowAddress
                centrifugeId
                poolId
                tokenId
                assetAmount
                assetAddress
                assetPrice
                asset {
                  id
                  decimals
                  address
                  name
                  symbol
                }
              }
            }
          }`,
          { tokenId: tokenId! }
        )
      ),
    enabled: !!tokenId,
    staleTime: ESCROW_STALE_TIME,
    select: (data) => data.holdingEscrows.items.map(transformEscrow),
  })
}

export function useHoldingEscrowBalances(tokenId: string | undefined) {
  const { data, isLoading } = useHoldingEscrows(tokenId)

  return {
    data: data ? buildBalances(data) : undefined,
    isLoading,
  }
}

function buildBalances(escrows: HoldingEscrow[]): HoldingEscrowBalance[] {
  const balanceValues = escrows
    .filter((escrow) => !escrow.assetAmount.isZero())
    .map((escrow) => ({
      escrowAddress: escrow.escrowAddress,
      assetSymbol: escrow.assetSymbol,
      assetName: escrow.assetName,
      centrifugeId: escrow.centrifugeId,
      amount: escrow.assetAmount,
      valueUsd: escrow.assetAmount.toDecimal().mul(escrow.assetPrice.toDecimal()),
      percentage: 0,
    }))

  const totalValue = balanceValues.reduce((sum, balance) => sum.add(balance.valueUsd), new Decimal(0))

  if (totalValue.isZero()) return balanceValues

  return balanceValues.map((balance) => ({
    ...balance,
    percentage: balance.valueUsd.div(totalValue).mul(100).toNumber(),
  }))
}
