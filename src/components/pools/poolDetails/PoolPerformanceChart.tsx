import { useState, useMemo } from 'react'
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { formatBigintToString, useTokenPrices } from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'
import { LineChart } from '@ui'
import { Price } from '@centrifuge/sdk'
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
        <Text color="gray.600" fontWeight={500} fontSize="xs">
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
        return { timestamp: entry.timestamp, price: match.price }
      })
      .filter((x): x is { timestamp: string; price: Price } => x !== null)
  }, [prices])

  const chartData = useMemo(() => {
    return pricesPerShareClass.map((entry) => {
      return { timestamp: entry.timestamp, price: entry.price.toDecimal().toNumber() }
    })
  }, [pricesPerShareClass]).filter((entry) => entry.price > 0)

  const xTickFormatter = useMemo(
    () => (ts: string) => new Date(ts).toLocaleString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }),
    [fromDate, toDate]
  )

  const yDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 'dataMax']
    const maxPrice = Number(Math.max(...chartData.map((d) => d.price)).toFixed(3))
    const minPrice = Number(Math.min(...chartData.map((d) => d.price)).toFixed(3))
    return [minPrice, maxPrice]
  }, [chartData])

  return (
    <Box position="relative" mt={8}>
      {isLoading ? (
        <Box pos="absolute" inset="0" bg="bg/80">
          <Center h="full">
            <Spinner size="lg" color="black.500" />
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
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          {/* // TODO: Add back datepickers once sdk accepts date filtering */}
          {/* <Flex gap={4} mr={4}>
            <DatePicker label="From" date={fromDate} onChange={setFromDate} />
            <DatePicker label="To" date={toDate} onChange={setToDate} />
          </Flex> */}
          <Heading size="lg">Performance</Heading>
          <LegendItem color="fg.emphasized" label="Token price" value={currentTokenPrice} />
        </Flex>
        <LineChart
          height={260}
          data={chartData}
          yDomain={yDomain}
          xAccessor={(r) => r.timestamp}
          xTickFormatter={xTickFormatter}
          yTickFormatter={(v) => String(v.toFixed(3))}
          tooltipYTickFormatter={(v) => String(v.toFixed(6))}
          series={[
            {
              id: 'token price',
              type: 'line',
              accessor: (r) => r.price,
              colorToken: 'fg.emphasized',
              strokeWidth: 2,
            },
          ]}
        />
      </Box>
    </Box>
  )
}
