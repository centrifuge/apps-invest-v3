import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolPageSkeleton } from '@components/skeletons/PoolPageSkeleton'
import { routePaths } from '@routes/routePaths'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { PoolMainStats } from '@components/pools/poolDetails/PoolMainStats'
import { formatBalance } from '@cfg'
import { useVaultsContext } from '@contexts/VaultsContext'
import { usePoolContext } from '@contexts/PoolContext'
import { PoolDetailsDeRwa } from '@components/pools/poolDetails/PoolDetailsDeRwa'
import { PoolDetailsRwa } from '@components/pools/poolDetails/PoolDetailsRwa'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { SolanaMarketCard } from '@components/elements/SolanaMarketCard'

export default function PoolPage() {
  const { isLoading: isPoolLoading, poolId, poolDetails, networks, shareClass } = usePoolContext()
  const { investment, isLoading: isVaultsLoading } = useVaultsContext()
  const { getIsRwaPool } = useGetPoolsByIds()
  const isRwaPool = getIsRwaPool(poolId)
  const poolName = poolDetails?.metadata?.pool.name

  if (isPoolLoading || isVaultsLoading) {
    return <PoolPageSkeleton />
  }

  if (!poolDetails || !networks || !shareClass) {
    return <BackLink heading="Sorry, no pool data available at this time." />
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-end" my={8}>
        <BackLink heading={poolName ?? 'Back to pools'} />
        <Box>
          <Text fontSize=".75rem" color="black" width="auto" textAlign="right">
            Your current holdings {poolName ? `in ${poolName}` : ''}
          </Text>
          <Flex align={'flex-end'} justifyContent="flex-end">
            <Text fontSize="xl" fontWeight="bold" textAlign="right">
              {investment?.shareBalance
                ? formatBalance(investment.shareBalance, investment?.share.symbol ?? '', 2)
                : '0.00'}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Box marginTop={8}>
        <Grid templateColumns={{ base: '1fr', sm: '1fr', md: '1fr', lg: '6fr 4fr' }} gap={6}>
          <Box minW={0}>
            <PoolMainStats />
            {isRwaPool ? <PoolDetailsRwa /> : <PoolDetailsDeRwa />}
          </Box>

          <Box height="fit-content" position="sticky" top={8}>
            <InvestRedeemSection pool={poolDetails} />
            <Box mt={6}>
              <SolanaMarketCard />
            </Box>
          </Box>
        </Grid>
      </Box>
    </>
  )
}

function BackLink({ heading }: { heading: string }) {
  return (
    <Link to={routePaths.home}>
      <Flex alignItems="center">
        <IoArrowBack fill="#91969B" />
        <Heading size="xl" ml={2}>
          {heading}
        </Heading>
      </Flex>
    </Link>
  )
}
