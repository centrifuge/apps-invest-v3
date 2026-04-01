import { Box, Flex, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { formatBalanceAbbreviated } from '@cfg'
import { DonutChart, type DonutChartDatum } from '@ui'
import { POOL_COLORS } from './colors'

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

interface PoolAllocation {
  poolName: string
  aum: number
}

interface PortfolioAllocationChartProps {
  pools: PoolAllocation[]
}

export function PortfolioAllocationChart({ pools }: PortfolioAllocationChartProps) {
  const chartData: DonutChartDatum[] = pools.map((pool, i) => ({
    name: pool.poolName,
    value: pool.aum,
    colorToken: POOL_COLORS[i % POOL_COLORS.length],
  }))

  return (
    <Box
      bg="bg.inverted"
      borderRadius={16}
      p={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      height="100%"
      minH="398px"
      css={{ animation: `${slideInRight} 0.5s ease-out 0.15s both` }}
      width={{ base: '100%', md: '390px' }}
      flexShrink={0}
    >
      <DonutChart data={chartData} centerLabel="All Investments" />

      <Box width="100%" px={1}>
        {pools.map((pool, i) => (
          <Flex key={pool.poolName} gap={3} alignItems="center" py="6px" width="100%">
            <Box
              width="12px"
              height="12px"
              borderRadius="full"
              bg={POOL_COLORS[i % POOL_COLORS.length]}
              flexShrink={0}
            />
            <Text
              fontSize="sm"
              color="fg.subtle"
              flex="1"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {pool.poolName}
            </Text>
            <Text fontSize="sm" color="fg.inverted" textAlign="right" flexShrink={0}>
              {formatBalanceAbbreviated(pool.aum, 2)}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  )
}
