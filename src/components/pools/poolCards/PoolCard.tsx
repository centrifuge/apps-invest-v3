import { useMemo } from 'react'
import { MdBrokenImage } from 'react-icons/md'
import { Box, Center, Flex, Icon, Image, Separator, Spinner, Text } from '@chakra-ui/react'
import { useChainId } from 'wagmi'
import { formatBalanceAbbreviated, ipfsToHttp, PoolDetails, useIsMember, usePoolActiveNetworks } from '@cfg'
import { Card, ValueText } from '@ui'
import { getPoolTVL } from '@utils/getPoolTVL'
import { AccreditedOnlyValueBlock } from '@components/elements/AccreditedOnlyValueBlock'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

export function PoolCard({
  poolDetails,
  getIsRestrictedPool,
  isRwaPool,
}: {
  poolDetails: PoolDetails
  getIsRestrictedPool: (poolId?: string | undefined) => boolean
  isRwaPool: boolean
}) {
  const connectedChainId = useChainId()
  const { data: networks, isLoading: isNetworksLoading } = usePoolActiveNetworks(poolDetails?.id, {
    enabled: !!poolDetails,
  })

  // We need to find the pool network and check if the current wallet is whitelisted
  const currentNetwork = networks?.find((n) => n.chainId === connectedChainId)
  const currentNetworkChainId = currentNetwork ? currentNetwork.chainId : undefined
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(
    poolDetails?.shareClasses[0]?.shareClass.id,
    currentNetworkChainId,
    {
      enabled: !!poolDetails?.shareClasses[0]?.shareClass.id.toString() && !!currentNetworkChainId,
    }
  )
  const isWhitelisted = isMember ?? false
  const isRestrictedPoolId = getIsRestrictedPool(poolDetails.id.toString())
  const isRestrictedPool = isRestrictedPoolId && !isWhitelisted
  const poolTVL = useMemo(() => getPoolTVL(poolDetails), [poolDetails.shareClasses])
  const poolMetadata = poolDetails.metadata?.pool
  const iconUri = poolMetadata?.icon?.uri ?? ''
  const shareClasses = poolDetails.metadata?.shareClasses
  const shareClassDetails = shareClasses ? Object.values(shareClasses)[0] : undefined
  const poolName = poolMetadata?.name ?? 'Pool'
  const poolIssuerName = poolMetadata?.issuer.name
  const shortDescription = poolMetadata?.issuer?.shortDescription.trim() ?? ''
  const isPoolCardLoading = isNetworksLoading || isMemberLoading

  return (
    <Card height="100%" position="relative" _hover={{ boxShadow: 'md' }}>
      {isPoolCardLoading ? (
        <Box pos="absolute" inset="0" bg="bg/80">
          <Center h="full">
            <Spinner size="lg" />
          </Center>
        </Box>
      ) : null}
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Text fontSize="sm" color="themeBlack.500" fontWeight={600}>
            {poolName}
          </Text>
          {!isRwaPool && poolIssuerName ? (
            <Text fontSize="x-small" color="fg.subtle">
              {poolIssuerName}
            </Text>
          ) : null}
        </Box>
        {iconUri ? (
          <Image src={ipfsToHttp(iconUri, pinataGateway)} alt={poolMetadata?.name} height="36px" width="36px" />
        ) : (
          <Icon size="md">
            <MdBrokenImage />
          </Icon>
        )}
      </Flex>
      <Separator my={4} />
      {isRestrictedPool ? (
        <Box>
          <Flex alignItems="center" justifyContent="space-between" overflow="hidden">
            <Text color="gray.400" fontSize="0.75rem" fontWeight={500}>
              TVL(USD)
            </Text>
            <Text color="gray.400" fontSize="0.75rem" fontWeight={500} mr={8}>
              APY
            </Text>
          </Flex>
          <AccreditedOnlyValueBlock />
        </Box>
      ) : (
        <>
          <Flex alignItems="center" justifyContent="space-between" overflow="hidden">
            <ValueText
              label="TVL(USD)"
              value={poolTVL}
              valueTextProps={{
                fontSize: 'clamp(1rem, 1rem, 1rem)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 500,
              }}
            />
            <Box mr={8}>
              <ValueText
                label="APY"
                value={`${shareClassDetails?.apyPercentage ?? 0}%`}
                valueTextProps={{ fontSize: '1rem' }}
              />
            </Box>
          </Flex>
        </>
      )}
      <Separator my={4} />
      <Text color="fg.subtle" fontSize="sm">
        {shortDescription.length > 0 ? shortDescription : `${poolName} pool`}
      </Text>
      <Separator my={4} />
      <Flex flexDirection="column" gap={2}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xs" fontWeight={500}>
            Asset type
          </Text>
          <Text fontSize="xs" fontWeight={500} textAlign="right">
            {poolMetadata?.asset.subClass ?? ''}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xs" fontWeight={500}>
            Investor type
          </Text>
          <Text fontSize="xs" fontWeight={500} textAlign="right">
            {poolMetadata?.investorType ?? ''}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xs" fontWeight={500}>
            Minimum investment
          </Text>
          <Text fontSize="xs" fontWeight={500} textAlign="right">
            {shareClassDetails?.minInitialInvestment
              ? formatBalanceAbbreviated(shareClassDetails?.minInitialInvestment ?? 0, 0, 'USD')
              : ''}
          </Text>
        </Flex>
      </Flex>
    </Card>
  )
}
