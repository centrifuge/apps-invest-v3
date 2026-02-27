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
import { maxScreenSize } from '@layouts/MainLayout'

export default function PoolPage() {
  const { isLoading: isPoolLoading, poolId, poolDetails, networks, shareClass } = usePoolContext()
  const { investment, isLoading: isVaultsLoading } = useVaultsContext()
  const { getIsRwaPool } = useGetPoolsByIds()
  const isRwaPool = getIsRwaPool(poolId)
  const poolName = poolDetails?.metadata?.pool?.name ?? ''

  if (isPoolLoading || isVaultsLoading) {
    return <PoolPageSkeleton />
  }

  if (!poolDetails || !poolDetails?.metadata?.pool || !networks || !shareClass) {
    return (
      <Box bg="charcoal.900" minH="100vh">
        <Box pt={{ base: 24, md: 28 }} pb={8}>
          <Box maxW={maxScreenSize} mx="auto" px={{ base: 4, md: 8 }}>
            <BackLink heading="Sorry, no pool data available at this time." />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box bg="charcoal.900" minH="100vh">
      <Box pt={{ base: 24, md: 28 }} pb={8}>
        <Box maxW={maxScreenSize} mx="auto" p="1.5rem" bg="bg.inverted" borderRadius="2xl">
          <Flex justifyContent="space-between" alignItems="flex-end" justifyItems="center">
            <BackLink heading={poolName ?? 'Back to pools'} />
            <Box>
              <Text fontSize=".75rem" color="fg.subtle" width="auto" textAlign="right">
                Your current holdings {poolName ? `in ${poolName}` : ''}
              </Text>
              <Flex align="flex-end" justifyContent="flex-end">
                <Text fontSize="xl" fontWeight="bold" textAlign="right" color="fg.inverted">
                  {investment?.shareBalance
                    ? formatBalance(investment.shareBalance, { currency: investment?.share.symbol ?? '', precision: 2 })
                    : '0.00'}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Box bg="white" borderRadius="2xl" minH="75vh" maxW={maxScreenSize} mx="auto" my="2rem">
          <Box maxW={maxScreenSize} mx="auto" px={{ base: 4, md: 8 }} py={8}>
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
        </Box>
      </Box>
    </Box>
  )
}

function BackLink({ heading }: { heading: string }) {
  return (
    <Link to={routePaths.home} style={{ alignSelf: 'center' }}>
      <Flex alignItems="center">
        <IoArrowBack fill="#A4A7AE" style={{ color: 'white' }} />
        <Heading size="xl" ml={2} color="fg.inverted">
          {heading}
        </Heading>
      </Flex>
    </Link>
  )
}
