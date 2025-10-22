import { Heading, Text } from '@chakra-ui/react'
import { DataTable, normalizeCell } from '@ui'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
import { useIpfsQuery } from '@cfg'

interface ChronicleHoldings {
  current_price: string
  description: string
  market_value: string
  maturity_date: string
  units: number
  yield_to_maturity: string
  isin?: string
}

export function PoolHoldings() {
  const { poolDetails, poolId } = usePoolContext()
  const { isRestrictedPool, getChroniclePoolIpfsUri, getIsChroniclePool } = useGetPoolsByIds()
  const isChronicleVerified = getIsChroniclePool(poolId)

  const chronicleIpfsUri = poolId && isChronicleVerified ? getChroniclePoolIpfsUri(poolId) : ''
  const { data: chronicleData, error } = useIpfsQuery(chronicleIpfsUri)

  const chronicleHoldings: ChronicleHoldings[] =
    !chronicleData || !chronicleData.payload ? [] : chronicleData?.payload?.output?.dashboard?.portfolio?.positions
  chronicleHoldings.forEach((p: ChronicleHoldings) => delete p.isin)
  const chronicleHeaders = chronicleHoldings.length ? Object.keys(chronicleHoldings[0]) : []
  const cfgMetadataHoldings = poolDetails?.metadata?.holdings ?? { headers: [], data: [] }
  const cfgMetadataHeaders = cfgMetadataHoldings?.headers ?? []
  const holdings = chronicleHoldings ? chronicleHoldings : cfgMetadataHoldings?.data
  const headers = chronicleHeaders ? chronicleHeaders : cfgMetadataHeaders

  const holdingsData =
    holdings?.map((row: Record<string, unknown> | ChronicleHoldings, i: number) => {
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
    header: h,
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
