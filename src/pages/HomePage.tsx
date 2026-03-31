import { useState } from 'react'
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
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
  const showPortfolioHero = isAccessTab && hasPortfolioData

  if (isPoolsLoading) {
    return (
      <Flex minH="100vh" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    )
  }

  const waveHeight = '120px'
  const heroTop = showPortfolioHero ? '560px' : '360px'
  const totalHeroHeight = {
    base: showPortfolioHero ? 'auto' : '290px',
    md: `calc(${heroTop} + ${waveHeight} / 2 + 10px)`,
  }

  return (
    <Box position="relative">
      {/* Dark Hero Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={totalHeroHeight}
        bg="linear-gradient(to top, #07090A 30%, #252B34 70%)"
        overflow="hidden"
      >
        {!showPortfolioHero && (
          <>
            {/* Vector background image */}
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

            {/* Yellow decorative dots */}
            <Box position="absolute" bg="fg.emphasized" width="5px" height="5px" top="194px" left="60%" />
            <Box position="absolute" bg="fg.emphasized" width="6px" height="6px" top="380px" left="70%" />
            <Box position="absolute" bg="fg.emphasized" width="8px" height="8px" top="162px" right="8%" />
          </>
        )}
      </Box>

      {/* Wave separator - creates the curved boundary between dark hero and white content. Hidden on mobile. */}
      <Box
        display={{ base: 'none', md: 'block' }}
        position="absolute"
        top={heroTop}
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
        top={{ base: '240px', md: `calc(${heroTop} + 1.5rem)` }}
        right={{ base: 4, xl: '12.5vw', md: '2.5vw' }}
        zIndex={3}
      >
        <PoolsTvlCard poolIds={poolIds} />
      </Box>

      {/* Hero content */}
      <Box
        position="relative"
        zIndex={3}
        pt={{ base: 20, md: showPortfolioHero ? 24 : 32 }}
        px={{ base: 4, md: 16 }}
        height={showPortfolioHero ? { base: 'auto', md: heroTop } : { base: '280px', md: '360px' }}
        pb={showPortfolioHero ? { base: 8, md: 12 } : 0}
      >
        <Box maxW={maxScreenSize} mx="auto">
          {isAccessTab ? (
            <PortfolioHero poolIds={poolIds} onDataChange={setHasPortfolioData} fallback={<HeroText />} />
          ) : (
            <HeroText />
          )}
        </Box>
      </Box>

      <Box position="relative" px={{ base: 4, md: 16 }} pt={{ base: '1.5rem', md: '3.5rem' }}>
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

function HeroText() {
  return (
    <Flex flexDirection="column" justifyContent="center" gap={6} py={{ base: 10, md: 12 }} maxW="558px">
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
