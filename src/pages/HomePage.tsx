import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { PoolTableTabs } from '@components/pools/poolTable/PoolTableTabs'
import { PoolsTvlCard } from '@components/pools/poolCards/PoolsTvlCard'
import { usePoolContext } from '@contexts/PoolContext'
import heroBg from '@assets/logos/centrifuge-logo-lg.svg'

export default function HomePage() {
  const { pools, isPoolsLoading, setSelectedPoolId } = usePoolContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (isPoolsLoading) {
    return (
      <Flex minH="100vh" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Flex>
    )
  }

  if (!poolIds?.length) return <h3>Sorry, there are no pools available at this time.</h3>

  const baseHeroHeight = '480px'
  const waveHeight = '120px'
  const totalHeroHeight = `calc(${baseHeroHeight} + ${waveHeight})`

  return (
    <Box position="relative">
      {/* Dark Hero Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={totalHeroHeight}
        bg="linear-gradient(45deg, #07090A 40%, #252B34 60%)"
        overflow="hidden"
      >
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
      </Box>

      {/* Wave separator - creates the curved boundary between dark hero and white content. */}
      <Box
        position="absolute"
        top={baseHeroHeight}
        left={0}
        right={0}
        height={waveHeight}
        zIndex={2}
        overflow="hidden"
        pointerEvents="none"
        _before={{
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '57.7%',
          height: '100%',
          bg: 'white',
          borderTopRightRadius: '15% 100%',
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '50%',
          right: 0,
          width: '43.1%',
          height: '50%',
          bg: 'linear-gradient(45deg, #16181c 20%, #252B34 80%)',
          borderBottomLeftRadius: '15% 100%',
        }}
      />

      <Box position="absolute" top={baseHeroHeight} right={{ base: '2.5vw', xl: '12.5vw' }} zIndex={3}>
        <PoolsTvlCard poolIds={poolIds} />
      </Box>

      {/* Hero content */}
      <Box position="relative" zIndex={3} pt={{ base: 32 }} px={{ base: 4, md: 16 }} height={baseHeroHeight}>
        <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto">
          <Flex flexDirection="column" justifyContent="center" gap={6} py={{ base: 10, md: 12 }} maxW="558px">
            <Text
              as="h1"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight={400}
              color="fg.inverted"
              lineHeight={{ base: '40px', md: '72px' }}
              letterSpacing="-1.28px"
            >
              Unlock Yield from Real-World Assets
            </Text>
            <Text fontSize="md" fontWeight={400} color="fg.subtle" lineHeight="24px" maxW="531px">
              Access curated investment opportunities backed by US Treasuries and other high-quality assets. Start
              growing your portfolio with secure, fully onchain funds.
            </Text>
          </Flex>
        </Box>
      </Box>

      <Box position="relative" px={{ base: 4, md: 16 }} pt="2rem">
        <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto">
          <PoolTableTabs poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
        </Box>
      </Box>
    </Box>
  )
}
