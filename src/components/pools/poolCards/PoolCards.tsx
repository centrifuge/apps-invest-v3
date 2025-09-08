import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, Heading, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { PoolDetails, useAllPoolDetails, useDebugFlags } from '@cfg'
import { PoolCardsSkeleton } from '@components/skeletons/PoolCardsSkeleton'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { routePaths } from '@routes/routePaths'
import { Card } from '@ui'
import { PoolCard } from '@components/pools/poolCards/PoolCard'

interface DisplayPool {
  id: string
  setId: () => void
  pool: PoolDetails
  isRwaPool: boolean
  isDeRwaPool: boolean
}

interface PoolCardsProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export const PoolCards = ({ poolIds, setSelectedPoolId }: PoolCardsProps) => {
  const { showMainnet } = useDebugFlags()
  const { data: pools, isLoading } = useAllPoolDetails(poolIds)
  const { getIsProductionPool, getIsRestrictedPool, getIsDeRwaPool, getIsRwaPool } = useGetPoolsByIds()

  const allPools: DisplayPool[] | undefined = useMemo(
    () =>
      pools?.map((pool) => ({
        id: pool.id.toString(),
        setId: () => setSelectedPoolId(pool.id),
        pool,
        isRwaPool: getIsRwaPool(pool.id.toString()),
        isDeRwaPool: getIsDeRwaPool(pool.id.toString()),
      })),
    [pools]
  )

  const productionPools = useMemo(
    () => allPools?.filter((pool) => getIsProductionPool(pool.id)),
    [allPools, getIsProductionPool]
  )
  const isMainnet = showMainnet || import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet'
  const displayPools = isMainnet ? productionPools : allPools
  const rwaPools = displayPools?.filter((pool) => pool.isRwaPool) ?? []
  const deRwaPools = displayPools?.filter((pool) => pool.isDeRwaPool) ?? []

  if (isLoading) return <PoolCardsSkeleton />

  console.log({ allPools, displayPools })

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
