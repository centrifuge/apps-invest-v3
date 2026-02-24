import { useMemo } from 'react'
import { MdBrokenImage } from 'react-icons/md'
import { Badge, Box, Center, Flex, Icon, Image, Separator, Spinner, Text } from '@chakra-ui/react'
import { useChainId } from 'wagmi'
import {
  formatBalanceAbbreviated,
  ipfsToHttp,
  PoolDetails,
  useBlockchainsMapByChainId,
  useIsMember,
  usePoolActiveNetworks,
  VaultDetails,
} from '@cfg'
import { Card, NetworkIcon, ValueText } from '@ui'
import { getPoolTVL } from '@utils/getPoolTVL'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

interface PoolCardProps {
  poolDetails: PoolDetails
  getIsRestrictedPool: (poolId?: string | undefined) => boolean
  isRwaPool: boolean
  vaultDetails?: VaultDetails
  networkCentrifugeId?: number
}

export function PoolCard({
  poolDetails,
  getIsRestrictedPool,
  isRwaPool,
  vaultDetails,
  networkCentrifugeId,
}: PoolCardProps) {
  const connectedChainId = useChainId()
  const { data: blockchainsMap } = useBlockchainsMapByChainId()

  // If networkCentrifugeId is provided (new vault card mode), use it directly
  // Otherwise, fetch networks and find matching one (legacy pool card mode)
  const { data: networks, isLoading: isNetworksLoading } = usePoolActiveNetworks(poolDetails?.id, {
    enabled: !!poolDetails && !networkCentrifugeId,
  })

  // We need to find the pool network and check if the current wallet is whitelisted
  const connectedCentrifugeId = blockchainsMap?.get(connectedChainId)?.centrifugeId
  const currentNetwork = networks?.find((n) => n.centrifugeId === connectedCentrifugeId)
  const currentNetworkCentrifugeId = networkCentrifugeId ?? currentNetwork?.centrifugeId
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(
    poolDetails?.shareClasses[0]?.shareClass.id,
    currentNetworkCentrifugeId,
    {
      enabled: !!poolDetails?.shareClasses[0]?.shareClass.id.toString() && !!currentNetworkCentrifugeId,
    }
  )
  const isWhitelisted = isMember ?? false
  const isRestrictedPoolId = getIsRestrictedPool(poolDetails.id.toString())
  const isRestrictedPool = isRestrictedPoolId && !isWhitelisted
  const poolTVL = useMemo(() => getPoolTVL(poolDetails), [poolDetails.shareClasses])
  const poolMetadata = poolDetails.metadata?.pool
  const iconUri = poolMetadata?.icon?.uri || null
  const shareClasses = poolDetails.metadata?.shareClasses
  const shareClassDetails = shareClasses ? Object.values(shareClasses)[0] : undefined
  const poolName = poolMetadata?.name ?? 'Pool'
  const poolIssuerName = poolMetadata?.issuer.name
  const shortDescription = poolMetadata?.issuer?.shortDescription.trim() ?? ''
  const isPoolCardLoading = (!networkCentrifugeId && isNetworksLoading) || isMemberLoading
  const subClass = poolMetadata?.asset.subClass === 'S&P 500' ? 'Equities' : (poolMetadata?.asset.subClass ?? '')

  // If vaultDetails is provided, show the asset symbol
  const assetSymbol = vaultDetails?.asset.symbol

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
        <Box flex={1}>
          <Flex alignItems="center" gap={2}>
            <Text fontSize="sm" color="fg.solid" fontWeight={600}>
              {poolName}
            </Text>
            {assetSymbol && (
              <Badge colorPalette="yellow" size="sm" fontWeight={700} color="yellow.emphasized">
                {assetSymbol}
              </Badge>
            )}
          </Flex>
          {!isRwaPool && poolIssuerName ? (
            <Text fontSize="x-small" color="fg.muted">
              {poolIssuerName}
            </Text>
          ) : null}
        </Box>
        <Flex alignItems="center" gap={2}>
          {networkCentrifugeId && <NetworkIcon centrifugeId={networkCentrifugeId} boxSize="24px" />}
          {iconUri ? (
            <Image src={ipfsToHttp(iconUri, pinataGateway)} alt={poolMetadata?.name} height="36px" width="36px" />
          ) : (
            <Icon size="md">
              <MdBrokenImage />
            </Icon>
          )}
        </Flex>
      </Flex>
      <Separator my={4} />
      {isRestrictedPool ? (
        <Box>
          <Flex alignItems="center" justifyContent="space-between" overflow="hidden">
            <Text color="fg.muted" fontSize="0.75rem" fontWeight={500}>
              TVL(USD)
            </Text>
            <Text color="fg.muted" fontSize="0.75rem" fontWeight={500} mr={8}>
              APY
            </Text>
          </Flex>
          <InvestorsOnlyValueBlock />
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
      <Text color="fg.muted" fontSize="sm">
        {shortDescription.length > 0 ? shortDescription : `${poolName} pool`}
      </Text>
      <Separator my={4} />
      <Flex flexDirection="column" gap={2}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xs" fontWeight={500}>
            Asset type
          </Text>
          <Text fontSize="xs" fontWeight={500} textAlign="right">
            {subClass}
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
