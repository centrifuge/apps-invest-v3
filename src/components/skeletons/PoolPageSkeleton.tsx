import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react'
import { maxScreenSize } from '@layouts/MainLayout'

export const PoolPageSkeleton = () => {
  return (
    <Box bg="charcoal.900" minH="100vh">
      {/* Dark Hero skeleton */}
      <Box pt={{ base: 24, md: 28 }} pb={8}>
        <Box maxW={maxScreenSize} mx="auto" px={{ base: 4, md: 8 }}>
          <Flex justify="space-between" align="flex-end">
            <Skeleton
              height="40px"
              width="360px"
              borderRadius="md"
              css={{ '--skeleton-start-color': '#1a1d22', '--skeleton-end-color': '#2a2e35' } as React.CSSProperties}
            />
            <Flex flexDirection="column" alignItems="flex-end" gap={1}>
              <Skeleton
                height="16px"
                width="200px"
                borderRadius="md"
                css={{ '--skeleton-start-color': '#1a1d22', '--skeleton-end-color': '#2a2e35' } as React.CSSProperties}
              />
              <Skeleton
                height="28px"
                width="120px"
                borderRadius="md"
                css={{ '--skeleton-start-color': '#1a1d22', '--skeleton-end-color': '#2a2e35' } as React.CSSProperties}
              />
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* White Content skeleton */}
      <Box bg="white" borderRadius="2xl" minH="80vh" maxW={maxScreenSize} mx="auto" my="2rem">
        <Box maxW={maxScreenSize} mx="auto" px={{ base: 4, md: 8 }} py={8}>
          <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={4}>
            <Box borderRadius="md" p={4} h="auto">
              <Flex mb={4} justify="space-between" align="center">
                <Skeleton bg="bg.muted" height="24px" width="200px" borderRadius="md" />
              </Flex>
              <Skeleton bg="bg.muted" height="200px" width="100%" borderRadius="md" />
            </Box>

            <Box
              bg="bg.subtle"
              position="relative"
              borderRadius="md"
              p={4}
              h="264px"
              border="1px solid"
              borderColor="border.solid"
            >
              <Flex mb={4} borderBottom="1px solid" borderColor="border.solid" pb={2}>
                <Skeleton bg="bg.muted" height="32px" width="80px" borderRadius="md" mr={2} />
                <Skeleton bg="bg.muted" height="32px" width="80px" borderRadius="md" mr={2} />
                <Skeleton bg="bg.muted" height="32px" width="80px" borderRadius="md" />
              </Flex>
              <Flex flexDirection="column" alignItems="flex-start" justifyContent="space-between">
                <Skeleton bg="bg.muted" height="48px" width="100%" borderRadius="md" mb={4} />
                <Skeleton bg="bg.muted" height="48px" width="100%" borderRadius="md" mb={4} />
                <Skeleton bg="bg.accent" height="40px" width="100%" borderRadius="md" mb={4} />
              </Flex>
            </Box>
          </Grid>

          <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={4}>
            <Box borderRadius="md" p={4} h="auto">
              <Flex mb={4} justify="space-between" align="center">
                <Skeleton bg="bg.muted" height="24px" width="200px" borderRadius="md" />
              </Flex>
              <Skeleton bg="bg.muted" height="200px" width="100%" borderRadius="md" mb={4} />
            </Box>
            <div />
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
