import { Pool, type SharePricesReport } from '@centrifuge/sdk'
import { useQuery, useQueries } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

type GroupBy = 'day' | 'month' | 'quarter' | 'year'
type DateLike = Date | string | number
type TokenPriceFilters = { from: DateLike; to: DateLike; groupBy?: GroupBy; unit?: 's' | 'ms' }

const toUTCEpoch = (d: DateLike, unit: 's' | 'ms' = 's') => {
  const date = typeof d === 'number' ? new Date(d) : new Date(d)
  const ms = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  )
  return unit === 's' ? Math.floor(ms / 1000) : ms
}

export function useTokenPrices(pool: Pool | undefined, filters: TokenPriceFilters) {
  const unit = filters.unit ?? 's'
  const fromNum = toUTCEpoch(filters.from, unit)
  const toNum = toUTCEpoch(filters.to, unit)

  return useQuery({
    enabled: !!pool && Number.isFinite(fromNum) && Number.isFinite(toNum),
    queryKey: queryKeys.sharePrices(pool?.id.toString(), fromNum, toNum, filters.groupBy, unit),
    queryFn: async () => {
      return pool!.reports.sharePrices({
        from: fromNum,
        to: toNum,
        groupBy: filters.groupBy ?? 'day',
      })
    },
  })
}

export function useMultiPoolTokenPrices(pools: Pool[], filters: TokenPriceFilters) {
  const unit = filters.unit ?? 's'
  const fromNum = toUTCEpoch(filters.from, unit)
  const toNum = toUTCEpoch(filters.to, unit)
  const groupBy = filters.groupBy ?? 'day'

  return useQueries({
    queries: pools.map((pool) => ({
      queryKey: queryKeys.sharePrices(pool.id.toString(), fromNum, toNum, groupBy, unit),
      queryFn: async (): Promise<SharePricesReport> =>
        pool.reports.sharePrices({ from: fromNum, to: toNum, groupBy }),
      staleTime: 5 * 60 * 1000,
      enabled: Number.isFinite(fromNum) && Number.isFinite(toNum),
    })),
  })
}
