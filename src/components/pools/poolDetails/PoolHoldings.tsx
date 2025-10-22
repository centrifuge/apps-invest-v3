import { Heading, Text } from '@chakra-ui/react'
import { DataTable, formatHeaderLabel, normalizeCell } from '@ui'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
import { useIpfsQuery } from '@cfg'
import { getChronicleHoldings, type Positions } from '@utils/getChronicleHoldings'

export function PoolHoldings() {
  const { poolDetails, poolId } = usePoolContext()
  const { isRestrictedPool, getChroniclePoolIpfsUri, getIsChroniclePool } = useGetPoolsByIds()

  // Try to fetch Chronicle holdings
  const isChronicleVerified = getIsChroniclePool(poolId)
  const chronicleIpfsUri = poolId && isChronicleVerified ? getChroniclePoolIpfsUri(poolId) : ''
  const { data: chronicleData, error } = useIpfsQuery(chronicleIpfsUri)
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
        // @ts-expect-error - element implicitly has an any type
        const { display, sortVal } = normalizeCell(h, row[h])
        out[h] = display
        // we add this so we can keep the original data displayed nicely
        out[`__sort__${h}`] = sortVal
      })
      return out
    }) ?? []

  const holdingsColumns = headers.map((h) => ({
    header: formatHeaderLabel(h),
    accessor: h,
    sortKey: `__sort__${h}`,
    justifyContent: 'flex-start',
  }))

  if (!holdingsData || holdingsData.length === 0) return null
  if (error) return <Text color="fg.error">Error: {error.message}</Text>

  return (
    <>
      <Heading size="lg" mt={8} mb={2}>
        Holdings
      </Heading>
      <Text fontSize="sm" mb={4}>
        Holdings shown are the approximate market value of invested assets only and do not reflect the total NAV of the
        pool.
      </Text>
      {isRestrictedPool ? (
        <InvestorsOnlyValueBlock />
      ) : (
        <DataTable columns={holdingsColumns} data={holdingsData} hideActions />
      )}
    </>
  )
}
