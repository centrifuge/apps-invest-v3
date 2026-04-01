import { useState } from 'react'
import { Box, Flex, Spinner, Text, useBreakpointValue } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useAddress } from '@cfg'
import { PoolTableTabs } from '@components/pools/poolTable/PoolTableTabs'
import { PoolsTvlCard } from '@components/pools/poolCards/PoolsTvlCard'
import { PortfolioHero } from '@components/portfolio/PortfolioHero'
import { POOL_TABLE_TABS } from '@components/pools/poolTable/types'
import { usePoolContext } from '@contexts/PoolContext'
import heroBg from '@assets/logos/centrifuge-logo-lg.svg'
import { maxScreenSize } from '@layouts/MainLayout'

export default function HomePage() {
  const { pools, isPoolsLoading, activeHomeTab } = usePoolContext()
  const { address } = useAddress()
  const poolIds = pools?.map((p) => p.id) ?? []
  const isAccessTab = activeHomeTab === POOL_TABLE_TABS.access && !!address
  const [hasPortfolioData, setHasPortfolioData] = useState(false)

  const isMobile =
    useBreakpointValue({
      base: true,
      sm: true,
      md: false,
    }) ?? false

  const showPortfolioHero = isAccessTab && hasPortfolioData

  if (isPoolsLoading) {
    return (
      <Flex minH="100vh" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    )
  }

  const waveHeight = '120px'

  return (
    <Box position="relative">
      {showPortfolioHero ? (
        <>
          {/* Portfolio hero: flow-based layout so dark bg wraps content naturally */}
          <Box bg="linear-gradient(to top, #07090A 30%, #252B34 70%)" position="relative">
            <Box
              position="relative"
              zIndex={3}
              pt={{ base: 20, md: 24 }}
              px={{ base: 4, md: 16 }}
              pb={{ base: 8, md: 12 }}
            >
              <Box maxW={maxScreenSize} mx="auto">
                <PortfolioHero
                  poolIds={poolIds}
                  onDataChange={setHasPortfolioData}
                  fallback={<HeroText />}
                  isMobile={isMobile}
                />
              </Box>
            </Box>
          </Box>

          {/* Wave separator in document flow */}
          {!isMobile && (
            <Box
              display={{ base: 'none', md: 'block' }}
              position="relative"
              height={waveHeight}
              zIndex={3}
              overflow="hidden"
              pointerEvents="none"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '57.7%',
                height: '60%',
                bg: 'white',
                borderTopRightRadius: '10% 100%',
              }}
              _after={{
                content: '""',
                position: 'absolute',
                top: '58%',
                right: 0,
                width: '42.3%',
                height: '40%',
                bg: '#07090A',
                borderBottomLeftRadius: '10% 100%',
              }}
            />
          )}

          <Box position="relative" zIndex={3} mt={{ base: 4, md: '-2rem' }}>
            <Box position="absolute" right={{ base: 4, xl: '12.5vw', md: '2.5vw' }} top="-60px" zIndex={4}>
              <PoolsTvlCard poolIds={poolIds} />
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* Products hero: original absolute-positioned layout */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={{ base: '290px', md: `calc(360px + ${waveHeight} / 2 + 10px)` }}
            bg="linear-gradient(to top, #07090A 30%, #252B34 70%)"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              width={{ base: '100%', md: '60%' }}
              bgImage={`url(${heroBg})`}
              bgRepeat="no-repeat"
              backgroundPosition="right top"
              bgSize="contain"
              pointerEvents="none"
            />
            <Box position="absolute" bg="fg.emphasized" width="5px" height="5px" top="194px" left="60%" />
            <Box position="absolute" bg="fg.emphasized" width="6px" height="6px" top="380px" left="70%" />
            <Box position="absolute" bg="fg.emphasized" width="8px" height="8px" top="162px" right="8%" />
          </Box>

          <Box
            display={{ base: 'none', md: 'block' }}
            position="absolute"
            top="360px"
            left={0}
            right={0}
            height={waveHeight}
            zIndex={2}
            overflow="hidden"
            pointerEvents="none"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '57.7%',
              height: '60%',
              bg: 'white',
              borderTopRightRadius: '10% 100%',
            }}
            _after={{
              content: '""',
              position: 'absolute',
              top: '58%',
              right: 0,
              width: '42.3%',
              height: '40%',
              bg: '#07090A',
              borderBottomLeftRadius: '10% 100%',
            }}
          />

          <Box
            position="absolute"
            top={{ base: '240px', md: 'calc(360px + 1.5rem)' }}
            right={{ base: 4, xl: '12.5vw', md: '2.5vw' }}
            zIndex={3}
          >
            <PoolsTvlCard poolIds={poolIds} />
          </Box>

          <Box
            position="relative"
            zIndex={3}
            pt={{ base: 20, md: 32 }}
            px={{ base: 4, md: 16 }}
            height={{ base: '280px', md: '360px' }}
          >
            <Box maxW={maxScreenSize} mx="auto">
              {isAccessTab ? (
                <PortfolioHero
                  poolIds={poolIds}
                  onDataChange={setHasPortfolioData}
                  fallback={<HeroText />}
                  isMobile={isMobile}
                />
              ) : (
                <HeroText />
              )}
            </Box>
          </Box>
        </>
      )}

      <Box
        position="relative"
        px={{ base: 4, md: 16 }}
        pt={showPortfolioHero && !isMobile ? 0 : { base: '1.5rem', md: '3.5rem' }}
        mt={showPortfolioHero && !isMobile ? '-60px' : 0}
      >
        <Box maxW={maxScreenSize} mx="auto">
          {!poolIds?.length ? (
            <Text as="h2" fontSize="2xl" mt={2}>
              Sorry, there are no pools available at this time.
            </Text>
          ) : (
            <PoolTableTabs poolIds={poolIds} />
          )}
        </Box>
      </Box>
    </Box>
  )
}

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

function HeroText() {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      gap={6}
      py={{ base: 10, md: 12 }}
      maxW="558px"
      css={{ animation: `${slideInLeft} 0.5s ease-out both` }}
    >
      <Text
        as="h1"
        fontSize={{ base: '2rem', md: '4rem' }}
        fontWeight={400}
        color="fg.inverted"
        lineHeight={{ base: '40px', md: '72px' }}
        letterSpacing="-1.28px"
      >
        Access Tokenized Assets on Centrifuge
      </Text>
    </Flex>
  )
}
