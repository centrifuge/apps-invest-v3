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

  return (
    <Box position="relative">
      {/* Dark Hero Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={{ base: '520px', md: '570px' }}
        bg="bg.inverted"
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
        <Box position="absolute" bg="yellow.500" width="5px" height="5px" top="194px" left="60%" />
        <Box position="absolute" bg="yellow.500" width="6px" height="6px" top="500px" left="70%" />
        <Box position="absolute" bg="yellow.500" width="8px" height="8px" top="162px" right="8%" />
      </Box>

      {/*
        Wave separator - creates the curved boundary between dark hero and white content.
      */}
      <Box
        position="absolute"
        top={{ base: '380px', md: '420px' }}
        left={0}
        right={0}
        height={{ base: '120px' }}
        zIndex={2}
        overflow="hidden"
        pointerEvents="none"
        _before={{
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '57.7%',
          height: '100%',
          bg: 'white',
          borderTopRightRadius: '16% 100%',
        }}
        _after={{
          content: '""',
          position: 'absolute',
          right: 0,
          top: '50%',
          width: '43.1%',
          height: '50%',
          bg: 'bg.inverted',
          borderBottomLeftRadius: '10% 100%',
        }}
      />

      <Box position="absolute" top={{ base: '390px', md: '430px' }} right={{ base: '2.5vw', xl: '12.5vw' }} zIndex={3}>
        <PoolsTvlCard poolIds={poolIds} />
      </Box>

      {/* Hero content */}
      <Box position="relative" zIndex={3} pt={{ base: 28, md: 32 }} px={{ base: 4, md: 16 }}>
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

      <Box position="relative" px={{ base: 4, md: 16 }}>
        <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto">
          <PoolTableTabs poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
        </Box>
      </Box>
    </Box>
  )
}
