import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react'

export const PoolPageSkeleton = () => {
  return (
    <Box bg="transparent" p={6}>
      <Flex mb={6} ml={4} align="center" justify="space-between">
        <Skeleton height="40px" width="360px" borderRadius="md" />
        <Flex>
          <Skeleton height="40px" width="360px" borderRadius="md" />
        </Flex>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={4}>
        <Box bg="transparent" borderRadius="md" p={4} h="auto">
          <Flex mb={4} justify="space-between" align="center">
            <Skeleton height="24px" width="200px" borderRadius="md" />
          </Flex>
          <Skeleton height="200px" width="100%" borderRadius="md" />
        </Box>

        <Box
          bg="bg-secondary"
          position="relative"
          borderRadius="md"
          p={4}
          h="264px"
          border="1px solid"
          borderColor="border-primary"
        >
          <Flex mb={4} borderBottom="1px solid" borderColor="border-primary" pb={2}>
            <Skeleton height="32px" width="80px" borderRadius="md" mr={2} />
            <Skeleton height="32px" width="80px" borderRadius="md" mr={2} />
            <Skeleton height="32px" width="80px" borderRadius="md" />
          </Flex>
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="space-between">
            <Skeleton height="48px" width="100%" borderRadius="md" mb={4} />
            <Skeleton height="48px" width="100%" borderRadius="md" mb={4} />
            <Skeleton bg="yellow.100" height="40px" width="100%" borderRadius="md" mb={4} />
          </Flex>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={4}>
        <Box bg="transparent" borderRadius="md" p={4} h="auto">
          <Flex mb={4} justify="space-between" align="center">
            <Skeleton height="24px" width="200px" borderRadius="md" />
          </Flex>
          <Skeleton height="200px" width="100%" borderRadius="md" mb={4} />
        </Box>

        <div />
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={4}>
        <Box bg="transparent" borderRadius="md" p={4} h="auto">
          <Flex mb={4} justify="space-between" align="center">
            <Skeleton height="24px" width="200px" borderRadius="md" />
          </Flex>
          <Skeleton height="200px" width="100%" borderRadius="md" mb={4} />
        </Box>

        <div />
      </Grid>
    </Box>
  )
}
