import { Heading, Text } from '@chakra-ui/react'
import { type ColumnDefinition, Card, DataTable, formatHeaderLabel, normalizeCell } from '@ui'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
import { useIpfsQuery } from '@cfg'
import { type Positions, getChronicleHoldings } from '@utils/getChronicleHoldings'

export function PoolHoldings() {
  const { poolDetails, poolId } = usePoolContext()
  const { isRestrictedPool, getChroniclePoolIpfsUri, getIsChroniclePool } = useGetPoolsByIds()

  // Try to fetch Chronicle holdings
  const isChronicleVerified = getIsChroniclePool(poolId)
  const chronicleIpfsUri = poolId && isChronicleVerified ? getChroniclePoolIpfsUri(poolId) : ''
  const { data: chronicleData, isError, error } = useIpfsQuery(chronicleIpfsUri)
  const {
    hasChronicleHoldings,
    headers: chronicleHeaders,
    holdings: chronicleHoldings,
  } = getChronicleHoldings(chronicleData)
  // Try to fetch cfg metadata holdings
  const cfgMetadataHoldings = poolDetails?.metadata?.holdings ?? { headers: [], data: [] }
  const cfgMetadataHeaders = cfgMetadataHoldings?.headers ?? []
  // Use Chronicle holdings else use cfg holdings
  const holdings = hasChronicleHoldings ? chronicleHoldings : cfgMetadataHoldings?.data
  const headers = hasChronicleHoldings ? chronicleHeaders : cfgMetadataHeaders

  const holdingsData =
    holdings?.map((row: Record<string, unknown> | Positions, i: number) => {
      const out: Record<string, unknown> = { id: i + 1 }
      headers.forEach((h) => {
        const { display, sortVal } = normalizeCell(h, (row as Record<string, unknown>)[h])
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

  const displayError = (error: Error) => (
    <Card>
      <Text color="fg.error" fontSize="sm">
        Error: {error.message}
      </Text>
    </Card>
  )

  if (!isError && (!holdingsData || holdingsData.length === 0)) return null

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
        {isError ? (
          displayError(error)
        ) : isRestrictedPool ? (
          <InvestorsOnlyValueBlock />
        ) : (
          <DataTable columns={holdingsColumns} data={holdingsData} hideActions />
        )}
      </>
    </>
  )
}
