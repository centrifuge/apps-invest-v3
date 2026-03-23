import { Balance, type HexString, Price } from '@centrifuge/sdk'
import { useQuery } from '@tanstack/react-query'
import Decimal from 'decimal.js-light'
import { isStablecoin, STABLECOIN_PRICE } from '@utils/stableCoins'
import { useCentrifuge } from './CentrifugeContext'
import { queryKeys } from './queryKeys'
import { useTokenInstances } from './useTokenInstances'
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
  const { data: escrows, isLoading: escrowsLoading } = useHoldingEscrows(tokenId)

  const nonStablecoinAddresses = (escrows ?? [])
    .filter((escrow) => !isStablecoin(escrow.assetAddress))
    .map((escrow) => escrow.assetAddress)
    .filter((addr, i, arr) => arr.indexOf(addr) === i)

  const { data: tokenInstances, isLoading: tokenInstancesLoading } = useTokenInstances(nonStablecoinAddresses)

  const priceMap = new Map<string, Price>()
  tokenInstances?.forEach((ti) => {
    priceMap.set(ti.address.toLowerCase(), ti.tokenPrice)
  })

  const isLoading = escrowsLoading || (nonStablecoinAddresses.length > 0 && tokenInstancesLoading)
  const data = escrows ? buildBalances(escrows, priceMap) : undefined

  return { data, isLoading }
}

function resolvePrice(escrow: HoldingEscrow, priceMap: Map<string, Price>): Price {
  if (isStablecoin(escrow.assetAddress)) return STABLECOIN_PRICE
  return priceMap.get(escrow.assetAddress.toLowerCase()) ?? STABLECOIN_PRICE
}

function buildBalances(escrows: HoldingEscrow[], priceMap: Map<string, Price>): HoldingEscrowBalance[] {
  const balanceValues = escrows
    .filter((escrow) => !escrow.assetAmount.isZero())
    .map((escrow) => {
      const price = resolvePrice(escrow, priceMap)
      return {
        escrowAddress: escrow.escrowAddress,
        assetSymbol: escrow.assetSymbol,
        assetName: escrow.assetName,
        centrifugeId: escrow.centrifugeId,
        amount: escrow.assetAmount,
        valueUsd: escrow.assetAmount.toDecimal().mul(price.toDecimal()),
        percentage: 0,
      }
    })

  const totalValue = balanceValues.reduce((sum, balance) => sum.add(balance.valueUsd), new Decimal(0))

  if (totalValue.isZero()) return balanceValues

  return balanceValues.map((balance) => ({
    ...balance,
    percentage: balance.valueUsd.div(totalValue).mul(100).toNumber(),
  }))
}
