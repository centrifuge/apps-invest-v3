import { useMemo } from 'react'
import { MdBrokenImage } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Box, Center, Flex, Grid, Heading, Icon, Image, Separator, Spinner, Text } from '@chakra-ui/react'
import { useChainId } from 'wagmi'
import { PoolId } from '@centrifuge/sdk'
import {
  formatBalanceAbbreviated,
  ipfsToHttp,
  PoolDetails,
  useAllPoolDetails,
  useIsMember,
  usePoolActiveNetworks,
} from '@cfg'
import { PoolCardsSelectSkeleton } from '@components/Skeletons/PoolCardsSelectSkeleton'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { routePaths } from '@routes/routePaths'
import { Card, ValueText } from '@ui'
import { getPoolTVL } from '@utils/getPoolTVL'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

interface DisplayPool {
  id: string
  setId: () => void
  pool: PoolDetails
  isRwaPool: boolean
}

interface PoolSelectorProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export const PoolCardsSelect = ({ poolIds, setSelectedPoolId }: PoolSelectorProps) => {
  const { data: pools, isLoading } = useAllPoolDetails(poolIds)
  const { getIsProductionPool, getIsRestrictedPool, getIsRwaPool } = useGetPoolsByIds()

  const allPools: DisplayPool[] | undefined = useMemo(
    () =>
      pools?.map((pool) => ({
        id: pool.id.toString(),
        setId: () => setSelectedPoolId(pool.id),
        pool,
        isRwaPool: getIsRwaPool(pool.id.toString()),
      })),
    [pools]
  )

  const productionPools = useMemo(
    () => allPools?.filter((pool) => getIsProductionPool(pool.id)),
    [allPools, getIsProductionPool]
  )
  const displayPools = import.meta.env.VITE_CENTRIFUGE_ENV === 'testnet' ? allPools : productionPools
  const rwaPools = displayPools?.filter((pool) => pool.isRwaPool) ?? []
  const deRwaPools = displayPools?.filter((pool) => !pool.isRwaPool) ?? []

  if (isLoading) return <PoolCardsSelectSkeleton />

  if (!displayPools || displayPools.length === 0) return <h3>Sorry, there are no pools available at this time.</h3>

  return (
    <>
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={2}>
          RWA
        </Heading>
        <Text fontSize="sm" mb={4}>
          Tokenized real-world assets issued under various legal structures. KYB onboarding required.
        </Text>
        <RenderPoolCards pools={rwaPools} getIsRestrictedPool={getIsRestrictedPool} isRwaPool />
      </Box>

      <Heading as="h2" size="lg" mb={2}>
        deRWA
      </Heading>
      <Text fontSize="sm" mb={4}>
        Decentralized real-world asset tokens. Freely transferable tokens with on-chain transparency and liquidity.
      </Text>
      <RenderPoolCards pools={deRwaPools} getIsRestrictedPool={getIsRestrictedPool} isRwaPool={false} />
    </>
  )
}

function RenderPoolCards({
  pools,
  getIsRestrictedPool,
  isRwaPool,
}: {
  pools: DisplayPool[]
  getIsRestrictedPool: (poolId?: string | undefined) => boolean
  isRwaPool: boolean
}) {
  return (
    <>
      {pools.length > 0 ? (
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }}
          gap="6"
        >
          {pools.map((pool) => (
            <Link to={`${routePaths.poolPage}/${pool.id}`} onClick={pool.setId} key={pool.id}>
              <PoolCard poolDetails={pool.pool} isRwaPool={pool.isRwaPool} getIsRestrictedPool={getIsRestrictedPool} />
            </Link>
          ))}
        </Grid>
      ) : (
        <Card>
          <Text fontSize="md">{`There are currently no ${isRwaPool ? 'RWA' : 'deRWA'} pools to display`}.</Text>
        </Card>
      )}
    </>
  )
}

function PoolCard({
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
      enabled: !!poolDetails?.shareClasses[0]?.shareClass.id && !!currentNetworkChainId,
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
            <Text fontSize="x-small" color="gray.500">
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
      {isRestrictedPool ? null : (
        <>
          <Separator my={4} />
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
      <Text color="gray.400" fontSize="sm">
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
