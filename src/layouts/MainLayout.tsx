import { memo } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Box, Flex, Separator } from '@chakra-ui/react'
import { ErrorBoundary, LogoCentrifugeText } from '@ui'
import { WalletButton } from '@wallet/WalletButton'
import { NetworkButton } from '@components/elements/NetworkButton'
import { MigrationBanner } from '@components/elements/MigrationBanner'
import { routePaths } from '@routes/routePaths'
import mainBg from '../assets/main_bg.jpg'

const MainLayout = memo(() => {
  return (
    <Box bg="bg.secondary" minH="100vh">
      <Box minH="100vh" bgImage={`url(${mainBg})`} bgRepeat="no-repeat" bgSize="cover" backgroundPosition="left">
        <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            gap={4}
            mb={8}
          >
            <Box width={32}>
              <Link to={routePaths.home}>
                <LogoCentrifugeText fill="fg.solid" />
              </Link>
            </Box>
            <MigrationBanner />
            <Box>
              <NetworkButton mr={4} size="sm" height="40px" />
              <WalletButton colorPalette={['black', 'black']} />
            </Box>
          </Flex>
          <Separator mb={4} />
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  )
})

export default MainLayout
