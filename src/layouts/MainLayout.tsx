import { memo } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { ErrorBoundary, LogoCentrifugeText } from '@ui'
import { WalletButton } from '@wallet/WalletButton'
import { routePaths } from '@routes/routePaths'

export const maxScreenSize = { base: '95vw', xl: '75vw' }

const MainLayout = memo(() => {
  return (
    <Box minH="100vh" bg="white" overflowX="hidden">
      <Box position="absolute" top={0} left={0} right={0} zIndex={10}>
        <Box maxW={maxScreenSize} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            gap={4}
          >
            <Box width={32}>
              <Link to={routePaths.home}>
                <LogoCentrifugeText fill="white" />
              </Link>
            </Box>
            <Box>
              <WalletButton />
            </Box>
          </Flex>
        </Box>
      </Box>

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </Box>
  )
})

export default MainLayout
