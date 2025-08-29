import { Box, Flex, Grid, Skeleton, SkeletonText } from '@chakra-ui/react'

export const PoolPageSkeleton = () => {
  return (
    <Box bg="bg-secondary" p={6}>
      <Flex mb={6} ml={4} align="center" justify="space-between">
        <Skeleton height="40px" width="200px" borderRadius="md" />
        <Flex>
          <Skeleton height="40px" width="200px" borderRadius="md" />
        </Flex>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={6}>
        <Box bg="bg-secondary" borderRadius="md" p={4} h="400px">
          <Flex mb={4} justify="space-between" align="center">
            <Skeleton height="24px" width="200px" borderRadius="md" />
            <Skeleton height="20px" width="80px" borderRadius="md" />
          </Flex>
          <Skeleton height="200px" width="100%" borderRadius="md" mb={4} />
          <Flex justify="space-between">
            <Skeleton height="14px" width="20%" />
            <Skeleton height="14px" width="20%" />
            <Skeleton height="14px" width="20%" />
            <Skeleton height="14px" width="20%" />
            <Skeleton height="14px" width="20%" />
          </Flex>
        </Box>

        <Box bg="yellow.50" borderRadius="md" p={4} h="400px">
          <Flex mb={4}>
            <Skeleton height="32px" width="80px" borderRadius="md" mr={2} />
            <Skeleton height="32px" width="80px" borderRadius="md" />
          </Flex>
          <Skeleton height="48px" width="100%" borderRadius="md" mb={4} />
          <Skeleton height="40px" width="100%" borderRadius="md" mb={4} />
          <SkeletonText noOfLines={4} />
        </Box>
      </Grid>

      <Box bg="bg-secondary" borderRadius="md" p={4}>
        <Flex mb={3} justify="space-between">
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="15%" />
        </Flex>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Flex key={idx} mb={3} justify="space-between" align="center">
            <Skeleton height="14px" width="15%" />
            <Skeleton height="14px" width="15%" />
            <Skeleton height="14px" width="15%" />
            <Skeleton height="14px" width="15%" />
            <Skeleton height="14px" width="15%" />
            <Skeleton height="14px" width="15%" />
          </Flex>
        ))}
      </Box>
    </Box>
  )
}
