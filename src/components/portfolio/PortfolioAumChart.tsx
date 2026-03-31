import { useMemo } from 'react'
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`
import { Pool } from '@centrifuge/sdk'
import { formatBalanceAbbreviated, useMultiPoolTokenPrices } from '@cfg'
import { LineChart } from '@ui'
import { POOL_COLORS } from './colors'

interface PoolChartInfo {
  pool: Pool
  poolName: string
  investedValue: number
  currentPrice: number
}

interface PortfolioAumChartProps {
  pools: PoolChartInfo[]
  totalInvested: number
}

type ChartRow = { timestamp: string } & Record<string, number>

const now = new Date()
const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
const fromDate = new Date(Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate() - 7, 0, 0, 0, 0))

export function PortfolioAumChart({ pools, totalInvested }: PortfolioAumChartProps) {
  const poolObjects = useMemo(() => pools.map((p) => p.pool), [pools])

  const sharePriceQueries = useMultiPoolTokenPrices(poolObjects, {
    from: fromDate,
    to: toDate,
    groupBy: 'day',
    unit: 's',
  })

  const isLoading = sharePriceQueries.some((q) => q.isLoading)

  // Merge all pool timeseries into a single dataset keyed by timestamp.
  // For each pool, the value is: user's shareBalance × historical token price
  const queryData = sharePriceQueries.map((q) => q.data)
  const { chartData, series } = useMemo(() => {
    const timestampMap = new Map<string, ChartRow>()
    const poolNames: string[] = []

    pools.forEach((poolInfo, idx) => {
      const report = queryData[idx]
      if (!report || !Array.isArray(report)) return

      const name = poolInfo.poolName
      poolNames.push(name)

      for (const entry of report) {
        // SDK doesn't filter by from/to, so filter client-side
        const entryTime = new Date(entry.timestamp).getTime()
        if (entryTime < fromDate.getTime() || entryTime > toDate.getTime()) continue

        const shareClassIds = Object.keys(entry.shareClasses) as Array<keyof typeof entry.shareClasses>
        if (!shareClassIds.length) continue
        const sc = entry.shareClasses[shareClassIds[0]]
        if (!sc) continue

        // Scale current assetBalance by price change ratio so the latest point matches the pie chart
        const historicalPrice = sc.price.toDecimal().toNumber()
        const userValue = poolInfo.currentPrice > 0
          ? poolInfo.investedValue * (historicalPrice / poolInfo.currentPrice)
          : 0

        const existing = timestampMap.get(entry.timestamp)
        if (existing) {
          existing[name] = userValue
        } else {
          timestampMap.set(entry.timestamp, { timestamp: entry.timestamp, [name]: userValue } as ChartRow)
        }
      }
    })

    const sorted = Array.from(timestampMap.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const seriesConfig = poolNames.map((name, i) => ({
      id: name,
      type: 'line' as const,
      accessor: (r: ChartRow) => (r[name] as number) ?? 0,
      colorToken: POOL_COLORS[i % POOL_COLORS.length],
      strokeWidth: 3,
    }))

    return { chartData: sorted, series: seriesConfig }
  }, [pools, queryData])

  const yDomain = useMemo(() => {
    if (!chartData.length) return [0, 'auto']
    let max = -Infinity
    for (const row of chartData) {
      for (const key of Object.keys(row)) {
        if (key === 'timestamp') continue
        const v = row[key] as number
        if (v > max) max = v
      }
    }
    if (!Number.isFinite(max)) return [0, 'auto']
    return [0, max * 1.1]
  }, [chartData])

  const xTickFormatter = (ts: string) =>
    new Date(ts).toLocaleString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' })

  return (
    <Box flex="1" minW={0} position="relative" css={{ animation: `${slideInLeft} 0.5s ease-out both` }}>
      {isLoading && (
        <Box pos="absolute" inset="0" zIndex={1}>
          <Center h="full">
            <Spinner size="lg" color="fg.inverted" />
          </Center>
        </Box>
      )}

      <Flex justifyContent="space-between" alignItems="flex-start" mb={6} flexWrap="wrap" gap={4}>
        <Box>
          <Text fontSize="md" color="fg.subtle">
            Your portfolio
          </Text>
          <Flex gap={4} alignItems="center" mt={2}>
            <Heading size="2xl" color="fg.inverted">
              {formatBalanceAbbreviated(totalInvested, 1, 'USD')}
            </Heading>
          </Flex>
        </Box>
      </Flex>

      {chartData.length > 0 && series.length > 0 ? (
        <LineChart
          height={260}
          data={chartData}
          yDomain={yDomain}
          margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
          xAccessor={(r) => r.timestamp}
          xTickFormatter={xTickFormatter}
          yTickFormatter={(v) => formatBalanceAbbreviated(v, 1)}
          tooltipYTickFormatter={(v) => formatBalanceAbbreviated(v, 2)}
          axisFontSize="14px"
          series={series}
        />
      ) : (
        !isLoading && (
          <Center h="260px">
            <Text color="fg.subtle" fontSize="sm">
              No chart data available
            </Text>
          </Center>
        )
      )}
    </Box>
  )
}
