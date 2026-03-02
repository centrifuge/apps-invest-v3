import { useMemo } from 'react'
import { Box, Tabs, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import {
  type PoolAccessStatus,
  useAddress,
  useAllPoolsVaultsQuery,
  useDebugFlags,
  usePoolsAccessStatusQuery,
} from '@cfg'
import { PoolTableSection } from '@components/pools/poolTable/PoolTableSection'
import { POOL_TABLE_TABS, type PoolRow } from '@components/pools/poolTable//types'
import { groupVaultsByPool } from '@components/pools/poolTable//utils'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { maxScreenSize } from '@layouts/MainLayout'

interface PoolTableTabsProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export function PoolTableTabs({ poolIds, setSelectedPoolId }: PoolTableTabsProps) {
  const { showMainnet } = useDebugFlags()
  const { data: allVaults, isLoading: isPoolsVaultsLoading } = useAllPoolsVaultsQuery(poolIds)
  const { getIsProductionPool, getIsRestrictedPool, getIsRwaPool, getIsDeRwaPool } = useGetPoolsByIds()
  const { address } = useAddress()
  const { data: accessData } = usePoolsAccessStatusQuery(poolIds)

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

  const rwaPoolRows = useMemo(
    () => groupVaultsByPool(rwaVaults, { getIsRestrictedPool }),
    [rwaVaults, getIsRestrictedPool]
  )

  const deRwaPoolRows = useMemo(
    () => groupVaultsByPool(deRwaVaults, { getIsRestrictedPool }),
    [deRwaVaults, getIsRestrictedPool]
  )

  const accessRwaPoolRows = useMemo(() => filterByAccess(rwaPoolRows, accessData), [rwaPoolRows, accessData])
  const accessDeRwaPoolRows = useMemo(() => filterByAccess(deRwaPoolRows, accessData), [deRwaPoolRows, accessData])

  const deRwaHeading = {
    label: 'Secondary Markets',
    subtitle: 'Freely transferable tokens that can be traded on secondary markets.',
  }

  return (
    <Tabs.Root defaultValue={POOL_TABLE_TABS.access} colorPalette="yellow" size="lg" variant="line">
      {/* Tab triggers - z-3 so they render above the wave separator overlay (z-2) */}
      <Tabs.List borderBottomColor="border.solid" width="fit-content" gap={8} position="relative" zIndex={3}>
        <Tabs.Trigger
          value={POOL_TABLE_TABS.access}
          height="44px"
          alignItems="flex-end"
          pb={4}
          px={2}
          fontSize="2xl"
          fontWeight={400}
          color="fg.muted"
          _selected={{ fontWeight: 500, color: 'fg.solid' }}
        >
          Your Positions
        </Tabs.Trigger>
        <Tabs.Trigger
          value={POOL_TABLE_TABS.funds}
          height="44px"
          alignItems="flex-end"
          pb={4}
          px={2}
          fontSize="2xl"
          fontWeight={400}
          color="fg.muted"
          _selected={{ fontWeight: 500, color: 'fg.solid' }}
        >
          Funds
        </Tabs.Trigger>
        <Tabs.Indicator bg="fg.emphasized" height="2px" borderRadius="1px" bottom="0" />
      </Tabs.List>

      <Box
        bg="white"
        width="100vw"
        position="relative"
        left="50%"
        marginLeft="-50vw"
        pb={16}
        pt={8}
        px={{ base: 4, md: 16 }}
      >
        <Box maxW={maxScreenSize} mx="auto" mt={8}>
          <Tabs.Content value={POOL_TABLE_TABS.access} pt={0}>
            {!address ? (
              <Box py={8} textAlign="center">
                <Text color="fg.muted" fontSize="md">
                  Connect your wallet to see pools you have access to and your positions.
                </Text>
              </Box>
            ) : (
              <>
                <PoolTableSection
                  poolRows={accessRwaPoolRows}
                  setSelectedPoolId={setSelectedPoolId}
                  isLoading={isPoolsVaultsLoading}
                  activeTab={POOL_TABLE_TABS.access}
                />
                <PoolTableSection
                  heading={deRwaHeading.label}
                  subtitle={deRwaHeading.subtitle}
                  poolRows={accessDeRwaPoolRows}
                  setSelectedPoolId={setSelectedPoolId}
                  isLoading={isPoolsVaultsLoading}
                  activeTab={POOL_TABLE_TABS.access}
                />
              </>
            )}
          </Tabs.Content>

          <Tabs.Content value={POOL_TABLE_TABS.funds} pt={0}>
            <PoolTableSection
              poolRows={rwaPoolRows}
              setSelectedPoolId={setSelectedPoolId}
              isLoading={isPoolsVaultsLoading}
              activeTab={POOL_TABLE_TABS.funds}
            />
            <PoolTableSection
              heading={deRwaHeading.label}
              subtitle={deRwaHeading.subtitle}
              poolRows={deRwaPoolRows}
              setSelectedPoolId={setSelectedPoolId}
              isLoading={isPoolsVaultsLoading}
              activeTab={POOL_TABLE_TABS.funds}
            />
          </Tabs.Content>
        </Box>
      </Box>
    </Tabs.Root>
  )
}

function filterByAccess(poolRows: PoolRow[], accessData: Map<string, PoolAccessStatus> | undefined): PoolRow[] {
  if (!accessData || accessData.size === 0) return poolRows
  return poolRows
    .map((row) => {
      const status = accessData.get(row.poolId)
      if (!status?.hasAccess) return null
      // Only show vault sub-rows for networks where the user is a member
      const filteredVaults = row.vaults.filter((v) => status.memberNetworkIds.has(v.centrifugeId))
      if (filteredVaults.length === 0) return null
      return { ...row, vaults: filteredVaults }
    })
    .filter((row): row is PoolRow => row !== null)
}
