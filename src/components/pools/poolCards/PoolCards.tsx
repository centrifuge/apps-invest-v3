import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { formatNetworkName, NetworkSlug, PoolNetworkVaultData, useAllPoolsVaults, useDebugFlags } from '@cfg'
import { PoolCardsSkeleton } from '@components/skeletons/PoolCardsSkeleton'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { getVaultPath } from '@routes/routePaths'
import { Card, NetworkIcon } from '@ui'
import { PoolCard } from '@components/pools/poolCards/PoolCard'

interface PoolCardsProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

interface NetworkGroupedVaults {
  networkName: NetworkSlug
  centrifugeId: number
  vaults: PoolNetworkVaultData[]
}

export const PoolCards = ({ poolIds, setSelectedPoolId }: PoolCardsProps) => {
  const { showMainnet } = useDebugFlags()
  const { data: allVaults, isLoading } = useAllPoolsVaults(poolIds)
  const { getIsProductionPool, getIsRestrictedPool, getIsDeRwaPool, getIsRwaPool } = useGetPoolsByIds()

  console.log('All vaults:', allVaults) // Debug log to check the structure of allVaults

  const isMainnet = showMainnet || import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet'

  const displayVaults = useMemo(() => {
    if (!allVaults) return []
    if (!isMainnet) return allVaults
    return allVaults.filter((vault) => getIsProductionPool(vault.poolId))
  }, [allVaults, isMainnet, getIsProductionPool])

  const rwaVaults = useMemo(
    () => displayVaults.filter((vault) => getIsRwaPool(vault.poolId)),
    [displayVaults, getIsRwaPool]
  )

  const deRwaVaults = useMemo(
    () => displayVaults.filter((vault) => getIsDeRwaPool(vault.poolId)),
    [displayVaults, getIsDeRwaPool]
  )

  const groupVaultsByNetwork = (vaults: PoolNetworkVaultData[]): NetworkGroupedVaults[] => {
    const networkMap = new Map<number, NetworkGroupedVaults>()

    for (const vault of vaults) {
      const existing = networkMap.get(vault.centrifugeId)
      if (existing) {
        existing.vaults.push(vault)
      } else {
        networkMap.set(vault.centrifugeId, {
          networkName: vault.networkName,
          centrifugeId: vault.centrifugeId,
          vaults: [vault],
        })
      }
    }

    return Array.from(networkMap.values()).sort((a, b) => a.networkName.localeCompare(b.networkName))
  }

  const rwaByNetwork = useMemo(() => groupVaultsByNetwork(rwaVaults), [rwaVaults])
  const deRwaByNetwork = useMemo(() => groupVaultsByNetwork(deRwaVaults), [deRwaVaults])

  if (isLoading) return <PoolCardsSkeleton />

  if (displayVaults.length === 0) {
    return <h3>Sorry, there are no pools available at this time.</h3>
  }

  return (
    <>
      <Box mb={8}>
        <Heading as="h2" size="lg" mb={2}>
          RWA
        </Heading>
        <Text fontSize="sm" mb={4}>
          Tokenized real-world assets issued under various legal structures. KYB onboarding required.
        </Text>
        <RenderNetworkGroupedVaults
          networkGroups={rwaByNetwork}
          getIsRestrictedPool={getIsRestrictedPool}
          isRwaPool
          setSelectedPoolId={setSelectedPoolId}
        />
      </Box>

      <Heading as="h2" size="lg" mb={2}>
        deRWA
      </Heading>
      <Text fontSize="sm" mb={4}>
        Decentralized real-world asset tokens. Freely transferable tokens with on-chain transparency and liquidity.
      </Text>
      <RenderNetworkGroupedVaults
        networkGroups={deRwaByNetwork}
        getIsRestrictedPool={getIsRestrictedPool}
        isRwaPool={false}
        setSelectedPoolId={setSelectedPoolId}
      />
    </>
  )
}

function RenderNetworkGroupedVaults({
  networkGroups,
  getIsRestrictedPool,
  isRwaPool,
  setSelectedPoolId,
}: {
  networkGroups: NetworkGroupedVaults[]
  getIsRestrictedPool: (poolId?: string | undefined) => boolean
  isRwaPool: boolean
  setSelectedPoolId: (poolId: PoolId) => void
}) {
  if (networkGroups.length === 0) {
    return (
      <Card>
        <Text fontSize="md">{`There are currently no ${isRwaPool ? 'RWA' : 'deRWA'} pools to display`}.</Text>
      </Card>
    )
  }

  return (
    <Box>
      {networkGroups.map((group) => (
        <Box key={group.centrifugeId} mb={6}>
          <Flex alignItems="center" gap={2} mb={3}>
            <NetworkIcon centrifugeId={group.centrifugeId} boxSize="24px" />
            <Heading as="h3" size="md">
              {formatNetworkName(group.networkName)}
            </Heading>
          </Flex>
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }}
            gap="6"
          >
            {group.vaults.map((vault) => {
              const vaultKey = `${vault.poolId}-${vault.centrifugeId}-${vault.vaultDetails.asset.address}`
              const path = getVaultPath(vault.poolId, vault.networkName, vault.vaultDetails.asset.symbol)

              return (
                <Link to={path} onClick={() => setSelectedPoolId(vault.poolDetails.id)} key={vaultKey}>
                  <PoolCard
                    poolDetails={vault.poolDetails}
                    isRwaPool={isRwaPool}
                    getIsRestrictedPool={getIsRestrictedPool}
                    vaultDetails={vault.vaultDetails}
                    networkCentrifugeId={vault.centrifugeId}
                  />
                </Link>
              )
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  )
}
