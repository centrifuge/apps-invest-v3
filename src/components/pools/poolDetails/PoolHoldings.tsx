import { Heading, Text } from '@chakra-ui/react'
import { type ColumnDefinition, DataTable, formatHeaderLabel, normalizeCell } from '@ui'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'

export function PoolHoldings() {
  const { poolDetails } = usePoolContext()
  const { isRestrictedPool } = useGetPoolsByIds()

  const holdings = poolDetails?.metadata?.holdings ?? { headers: [], data: [] }
  holdings.data.forEach((h) => delete h.ISIN)
  const headers = holdings?.headers.filter((h) => h !== 'ISIN') ?? []

  const holdingsData =
    holdings?.data.map((row: Record<string, unknown>, i: number) => {
      const out: Record<string, unknown> = { id: i + 1 }
      headers.forEach((h) => {
        const { display, sortVal } = normalizeCell(h, row[h])
        out[h] = display
        // we add this so we can keep the original data displayed nicely
        out[`__sort__${h}`] = sortVal
      })
      return out
    }) ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const holdingsColumns: ColumnDefinition<any>[] = headers.map((h, i) => ({
    header: formatHeaderLabel(h),
    accessor: h,
    sortKey: `__sort__${h}`,
    justifyContent: i === 0 ? 'flex-start' : 'center',
    textAlign: i === 0 ? 'left' : 'center',
  }))

  if (!holdingsData || holdingsData.length === 0) return null

  return (
    <>
      <Heading size="lg" mt={8} mb={2}>
        Holdings
      </Heading>
      <>
        <Text fontSize="sm" mb={4}>
          Holdings shown are the approximate market value of invested assets only and do not reflect the total NAV of
          the pool.
        </Text>
        {isRestrictedPool ? (
          <InvestorsOnlyValueBlock />
        ) : (
          <DataTable columns={holdingsColumns} data={holdingsData} hideActions />
        )}
      </>
    </>
  )
}
