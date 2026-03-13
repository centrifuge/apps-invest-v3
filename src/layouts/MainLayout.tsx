import { memo, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Box, Flex, Separator, Text } from '@chakra-ui/react'
import { ErrorBoundary, LogoCentrifugeText, Banner } from '@ui'
import { WalletButton } from '@wallet/WalletButton'
import { NetworkButton } from '@components/elements/NetworkButton'
import { routePaths } from '@routes/routePaths'
import mainBg from '../assets/main_bg.jpg'

const MainLayout = memo(() => {
  // TODO: This banner is temporary for the custody upgrade in March 2026.
  // It should be removed after the upgrade is complete.
  const [showCustodyBanner, setShowCustodyBanner] = useState(true)

  return (
    <Box bg="bg.subtle" minH="100vh">
      <Box minH="100vh" bgImage={`url(${mainBg})`} bgRepeat="no-repeat" bgSize="cover" backgroundPosition="left">
        {showCustodyBanner && (
          <Banner status="warning" onClose={() => setShowCustodyBanner(false)} mb={4}>
            <Text fontSize="sm">
              As part of an upgrade to our custody infrastructure, subscriptions and redemptions will be temporarily
              unavailable between 13–16 March 2026 for the following funds:{' '}
              <Text as="span" color="fg.info" fontWeight={500}>
                Janus Henderson Anemoy AAA CLO Fund Segregated Portfolio (JAAA)
              </Text>{' '}
              and{' '}
              <Text as="span" color="fg.info" fontWeight={500}>
                Janus Henderson Anemoy S&P 500® Fund Segregated Portfolio (SPXA)
              </Text>
            </Text>
          </Banner>
        )}
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
            <Box>
              <NetworkButton mr={4} size="sm" height="40px" />
              <WalletButton />
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
