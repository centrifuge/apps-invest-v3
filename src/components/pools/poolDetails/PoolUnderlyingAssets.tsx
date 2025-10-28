import { Link } from 'react-router-dom'
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { chainExplorer, usePoolDetails } from '@cfg'
import { ChronicleBadge } from '@components/elements/ChronicleBadge'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { NetworkIcon, Tooltip } from '@ui'

export function PoolUnderlyingAssets() {
  const { networks, poolDetails, pools, poolId } = usePoolContext()
  const { investment } = useVaultsContext()
  const { getIsChroniclePool } = useGetPoolsByIds()

  // Get underlying pool metadata
  const underlyingPoolIdNumber = poolDetails?.metadata?.pool.underlying?.poolId ?? 0
  const underlyPoolId = pools?.find((pool) => pool.id.toString() === underlyingPoolIdNumber.toString())?.id
  const { data: underlyingPoolDetails, isLoading: isUnderlyingLoading } = usePoolDetails(underlyPoolId, {
    enabled: !!underlyPoolId?.toString(),
  })
  const underlyingMetadata = underlyingPoolDetails?.metadata
  const underlyingShareClass = underlyingMetadata ? Object.values(underlyingMetadata.shareClasses)[0] : undefined
  const underlyingApy = underlyingShareClass?.apyPercentage ? `${underlyingShareClass.apyPercentage}%` : '-'
  const underlyingAssetAddress = investment?.shareCurrency.address

  const items = [
    { label: 'Fund', value: underlyingMetadata?.pool.name ?? null },
    { label: 'Asset type', value: underlyingMetadata?.pool.asset.subClass ?? null },
    { label: 'APY', value: underlyingApy },
    { label: 'Investor type', value: underlyingMetadata?.pool.investorType || 'Non-US Professional' },
    {
      label: 'Available networks',
      value: (
        <Flex gap={1}>
          {networks?.map((network, index) => (
            <Tooltip key={network.chainId} content={<Text>View transactions</Text>}>
              <Link
                to={underlyingAssetAddress ? `${chainExplorer[network.chainId]}/token/${underlyingAssetAddress}` : ''}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: '-10px' }}
              >
                <NetworkIcon key={index} networkId={network.chainId} />
              </Link>
            </Tooltip>
          ))}
        </Flex>
      ),
    },
    // Todo: expense ratio in the future would come from onchain and not metadata
    { label: 'Expense ratio', value: (underlyingMetadata?.pool as any)?.expenseRatio || 'Unknown' },
    {
      label: 'Verified by',
      value: getIsChroniclePool(poolId) ? <ChronicleBadge /> : null,
    },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Underlying assets
      </Heading>

      <Box
        bg="bg.solid"
        width="100%"
        padding={{ base: 6, md: 8 }}
        borderRadius={10}
        border="1px solid"
        borderColor="border.solid"
        shadow="xs"
        position="relative"
      >
        {isUnderlyingLoading ? (
          <Box pos="absolute" inset="0" bg="bg/80">
            <Center h="full">
              <Spinner size="lg" color="fg.solid" />
            </Center>
          </Box>
        ) : null}
        {items
          .filter((i) => !!i.value)
          .map((item) => (
            <Flex key={item.label} justifyContent="space-between" alignItems="center" mb={4} _last={{ mb: 0 }}>
              <Text fontWeight={500} fontSize="0.75rem" lineHeight="100%" color="fg.muted">
                {item.label}
              </Text>
              {typeof item.value !== 'string' ? (
                item.value
              ) : (
                <Text fontWeight={600} fontSize="0.75rem" lineHeight="100%" color="fg.solid" textAlign="right">
                  {item.value}
                </Text>
              )}
            </Flex>
          ))}
      </Box>
    </>
  )
}
