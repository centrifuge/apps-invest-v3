import { useState, useMemo } from 'react'
import { Badge, Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { formatBigintToString, useTokenPrices, formatBalanceAbbreviated } from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'
import { LineChart } from '@ui'
import { Price, Balance } from '@centrifuge/sdk'
// import { DatePicker } from '@ui'

const now = new Date()
const defaultTo = new Date(
  Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    0
  )
)
const defaultFrom = new Date(
  Date.UTC(
    defaultTo.getUTCFullYear(),
    defaultTo.getUTCMonth(),
    defaultTo.getUTCDate() - 30,
    defaultTo.getUTCHours(),
    defaultTo.getUTCMinutes(),
    defaultTo.getUTCSeconds(),
    0
  )
)

export function SmallCircle({ color }: { color: string }) {
  return <Box w="12px" h="12px" bg={color} borderRadius="full" />
}

export function LegendItem({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <Box display="flex" flexDir="column" justifyContent="flex-start">
      <Box display="flex" alignItems="center" gap={2}>
        {color && <SmallCircle color={color} />}
        <Text color="fg.muted" fontWeight={500} fontSize="xs">
          {label}
        </Text>
      </Box>
      <Heading size="xl">{value}</Heading>
    </Box>
  )
}

export const PoolPerformanceChart = () => {
  const { pool, shareClass, shareClassId } = usePoolContext()
  // TODO: Update state once sdk accepts date filtering
  const [fromDate] = useState<Date>(defaultFrom)
  const [toDate] = useState<Date>(defaultTo)
  const currentTokenPrice = formatBigintToString(
    shareClass?.details.pricePerShare.toBigInt() ?? 0n,
    shareClass?.details.pricePerShare.decimals ?? 6,
    6
  )

  const currentAum = useMemo(() => {
    if (!shareClass?.details) return '0'
    const { pricePerShare, totalIssuance } = shareClass.details
    const aum = pricePerShare.mul(totalIssuance)
    return formatBalanceAbbreviated(aum.toDecimal(), 1)
  }, [shareClass?.details])

  const { data: prices, isLoading } = useTokenPrices(pool, {
    from: fromDate.toDateString(),
    to: toDate.toDateString(),
    groupBy: 'day',
    unit: 's',
  })

  const pricesPerShareClass = useMemo(() => {
    return (prices ?? [])
      .map((entry) => {
        const match = shareClassId && entry.shareClasses[shareClassId.toString()]
        if (!match) return null
        return { timestamp: entry.timestamp, price: match.price, totalIssuance: match.totalIssuance }
      })
      .filter((x): x is { timestamp: string; price: Price; totalIssuance: Balance } => x !== null)
  }, [prices])

  const chartData = useMemo(() => {
    return pricesPerShareClass
      .map((entry) => {
        const price = entry.price.toDecimal().toNumber()
        const aum = entry.price.mul(entry.totalIssuance).toDecimal().toNumber()
        return { timestamp: entry.timestamp, price, aum }
      })
      .filter((entry) => entry.price > 0)
  }, [pricesPerShareClass])

  const xTickFormatter = useMemo(
    () => (ts: string) => new Date(ts).toLocaleString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }),
    [fromDate, toDate]
  )

  const yDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 'dataMax']
    const maxPrice = Number(Math.max(...chartData.map((d) => d.price)).toFixed(2))
    const minPrice = Number(Math.min(...chartData.map((d) => d.price)).toFixed(2))
    return [minPrice, maxPrice]
  }, [chartData])

  const rightYDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 'auto']
    const maxAum = Math.max(...chartData.map((d) => d.aum))
    return [0, maxAum * 1.1]
  }, [chartData])

  return (
    <Box position="relative" mt={8}>
      {isLoading ? (
        <Box pos="absolute" inset="0" bg="bg/80">
          <Center h="full">
            <Spinner size="lg" color="fg.solid" />
          </Center>
        </Box>
      ) : null}
      <Box
        bg="bg.solid"
        width="100%"
        padding={6}
        borderRadius={10}
        border="1px solid"
        borderColor="border.solid"
        shadow="xs"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={8} flexWrap="wrap" gap={4}>
          {/* // TODO: Add back datepickers once sdk accepts date filtering */}
          {/* <Flex gap={4} mr={4}>
            <DatePicker label="From" date={fromDate} onChange={setFromDate} />
            <DatePicker label="To" date={toDate} onChange={setToDate} />
          </Flex> */}
          <Heading size="lg">Performance</Heading>
          <Flex alignItems="flex-end" gap={6}>
            <Badge mr={2} pb={2} color="fg.muted">
              Latest
            </Badge>
            <LegendItem color="fg.emphasized" label="Token price" value={currentTokenPrice} />
            <LegendItem color="gray.900" label="AUM" value={currentAum} />
          </Flex>
        </Flex>
        <LineChart
          height={260}
          data={chartData}
          yDomain={yDomain}
          rightYDomain={rightYDomain}
          rightYTickFormatter={(v) => formatBalanceAbbreviated(v, 1)}
          margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          xAccessor={(r) => r.timestamp}
          xTickFormatter={xTickFormatter}
          yTickFormatter={(v) => String(v.toFixed(2))}
          tooltipYTickFormatter={(v) => String(v.toFixed(6))}
          series={[
            {
              id: 'token price',
              type: 'line',
              accessor: (r) => r.price,
              colorToken: 'fg.emphasized',
              strokeWidth: 2,
            },
            {
              id: 'AUM',
              type: 'line',
              accessor: (r) => r.aum,
              colorToken: 'gray.900',
              strokeWidth: 2,
              yAxisId: 'right',
              tooltipFormatter: (v) => formatBalanceAbbreviated(v, 2),
            },
          ]}
        />
      </Box>
    </Box>
  )
}
