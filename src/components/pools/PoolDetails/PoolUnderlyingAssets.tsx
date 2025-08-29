import { usePoolDetails } from '@cfg'
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { usePoolContext } from '@contexts/usePoolContext'

export function PoolUnderlyingAssets() {
  const { poolDetails, pools } = usePoolContext()

  // Get underlying pool metadata
  const underlyingPoolIdNumber = poolDetails?.metadata?.pool.underlying?.poolId
  const underlyPoolId = pools?.find((pool) => pool.id.toString() === (underlyingPoolIdNumber ?? 0).toString())?.id
  const { data: underlyingPoolDetails, isLoading: isUnderlyingLoading } = usePoolDetails(underlyPoolId, {
    enabled: !!underlyPoolId?.toString(),
  })
  const underlyingMetadata = underlyingPoolDetails?.metadata
  const underlyingShareClass = underlyingMetadata ? Object.values(underlyingMetadata.shareClasses)[0] : undefined
  const underlyingApy = underlyingShareClass?.apyPercentage ? `${underlyingShareClass.apyPercentage}%` : '-'

  const items = [
    { label: 'Fund', value: underlyingMetadata?.pool.name ?? '-' },
    { label: 'Asset type', value: underlyingMetadata?.pool.asset.subClass ?? '-' },
    { label: 'APY', value: underlyingApy },
    { label: 'Investor type', value: underlyingMetadata?.pool.investorType || 'Non-US Professional' },
    // Todo: expense ratio in the future would come from onchain and not metadata
    { label: 'Expense ratio', value: (underlyingMetadata?.pool as any)?.expenseRatio || 'Unknown' },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Underlying assets
      </Heading>

      <Box
        bg="bg-primary"
        width="100%"
        padding={{ base: 6, md: 8 }}
        borderRadius={10}
        border="1px solid"
        borderColor="border-primary"
        shadow="xs"
        position="relative"
      >
        {isUnderlyingLoading ? (
          <Box pos="absolute" inset="0" bg="bg/80">
            <Center h="full">
              <Spinner size="lg" color="gray.800" />
            </Center>
          </Box>
        ) : null}
        {items.map((item) => (
          <Flex key={item.label} justifyContent="space-between" alignItems="center" mb={4} _last={{ mb: 0 }}>
            <Text fontWeight={500} fontSize="0.75rem" lineHeight="100%" color="gray.500">
              {item.label}
            </Text>
            {typeof item.value !== 'string' ? (
              item.value
            ) : (
              <Text fontWeight={600} fontSize="0.75rem" lineHeight="100%" color="gray.800" textAlign="right">
                {item.value}
              </Text>
            )}
          </Flex>
        ))}
      </Box>
    </>
  )
}
