import { memo } from 'react'
import { Link, Outlet, useMatch } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { ErrorBoundary, LogoCentrifugeText } from '@ui'
import { WalletButton } from '@wallet/WalletButton'
import { routePaths } from '@routes/routePaths'

const MainLayout = memo(() => {
  const isHomePage = useMatch(routePaths.home)

  return (
    <Box minH="100vh" bg="white" overflowX="hidden">
      {/* Nav bar - transparent, positioned above content */}
      <Box position={isHomePage ? 'absolute' : 'relative'} top={0} left={0} right={0} zIndex={10}>
        <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            gap={4}
          >
            <Box width={32}>
              <Link to={routePaths.home}>
                <LogoCentrifugeText fill={isHomePage ? 'white' : 'fg.solid'} />
              </Link>
            </Box>
            <Box>
              <WalletButton />
            </Box>
          </Flex>
        </Box>
      </Box>

      <ErrorBoundary>
        {isHomePage ? (
          <Outlet />
        ) : (
          <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 24, md: 28 }}>
            <Outlet />
          </Box>
        )}
      </ErrorBoundary>
    </Box>
  )
})

export default MainLayout
