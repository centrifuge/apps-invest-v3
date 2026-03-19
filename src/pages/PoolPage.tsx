import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolPageSkeleton } from '@components/skeletons/PoolPageSkeleton'
import { routePaths } from '@routes/routePaths'
import { InvestRedeemSection } from '@components/InvestRedeemSection'
import { KyberSwapWidget } from '@components/elements/KyberSwapWidget'
import { PoolMainStats } from '@components/pools/poolDetails/PoolMainStats'
import { formatBalance, type PoolDetails } from '@cfg'
import { useVaultsContext } from '@contexts/VaultsContext'
import { usePoolContext } from '@contexts/PoolContext'
import { PoolDetailsDeRwa } from '@components/pools/poolDetails/PoolDetailsDeRwa'
import { PoolDetailsRwa } from '@components/pools/poolDetails/PoolDetailsRwa'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { SolanaMarketCard } from '@components/elements/SolanaMarketCard'
import { useGeolocation } from '@hooks/useGeolocation'
import { useGetPoolRestrictedCountries } from '@hooks/useGetPoolRestrictedCountries'
import { maxScreenSize } from '@layouts/MainLayout'
import { PoolPageLayout } from '@layouts/PoolPageLayout'

// TODO: remove deJAAA pool ID after testing
const KYBERSWAP_POOL_IDS = ['281474976710659', '281474976710668']

export default function PoolPage() {
  const { isLoading: isPoolLoading, poolId, poolDetails, networks, shareClass } = usePoolContext()
  const { investment, isLoading: isVaultsLoading } = useVaultsContext()
  const { getIsRwaPool, getIsDeRwaPool } = useGetPoolsByIds()
  const isRwaPool = getIsRwaPool(poolId)
  const poolName = poolDetails?.metadata?.pool?.name ?? ''

  const isSwapPool = KYBERSWAP_POOL_IDS.includes(poolId ?? '')

  // Geolocation check for swap pool — block US persons from viewing the page
  const { data: location } = useGeolocation({ enabled: isSwapPool && !isPoolLoading })
  const poolRestrictedCountries = useGetPoolRestrictedCountries(poolId, getIsDeRwaPool(poolId))
  const isRestrictedCountry = poolRestrictedCountries.includes(location?.country_code ?? '')

  if (isPoolLoading || isVaultsLoading) {
    return <PoolPageSkeleton />
  }

  if (isSwapPool && isRestrictedCountry) {
    return (
      <PoolPageLayout>
        <BackLink heading="Access Restricted" />
        <Box bg="white" borderRadius="2xl" p={8} mt={6}>
          <Text>
            Unfortunately, this page is not available in your region. Restrictions apply to US Persons and residents of
            sanctioned jurisdictions.
          </Text>
        </Box>
      </PoolPageLayout>
    )
  }

  if (!poolDetails || !poolDetails?.metadata?.pool || !networks || !shareClass) {
    return (
      <PoolPageLayout>
        <BackLink heading="Sorry, no pool data available at this time." />
      </PoolPageLayout>
    )
  }

  return (
    <PoolPageLayout>
      <Box p="1.5rem" bg="bg.inverted" borderRadius="2xl">
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
              {isSwapPool ? (
                <SwapPoolSection pool={poolDetails} poolId={poolId!} />
              ) : (
                <>
                  <InvestRedeemSection pool={poolDetails} />
                  <Box mt={6}>
                    <SolanaMarketCard />
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Box>
      </Box>
    </PoolPageLayout>
  )
}

function SwapPoolSection({ pool, poolId }: { pool: PoolDetails; poolId: string }) {
  const [showInvestRedeem, setShowInvestRedeem] = useState(false)

  return (
    <>
      <KyberSwapWidget poolId={poolId} />
      <Box mt={4} textAlign="center">
        <Button variant="plain" size="sm" color="fg.muted" onClick={() => setShowInvestRedeem((prev) => !prev)}>
          {showInvestRedeem ? 'Hide' : 'Show'} Acquire/Redeem directly from the fund
        </Button>
      </Box>
      {showInvestRedeem && (
        <Box mt={4}>
          <InvestRedeemSection pool={pool} />
        </Box>
      )}
    </>
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
