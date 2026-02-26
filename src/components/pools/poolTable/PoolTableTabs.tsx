import { useMemo, useState } from 'react'
import { Box, Tabs, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { useAllPoolsVaults, useDebugFlags, useAddress, usePoolsAccessStatus, UsePoolsAccessStatusResult } from '@cfg'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { PoolTableSection } from '@components/pools/poolTable/PoolTableSection'
import { groupVaultsByPool } from '@components/pools/poolTable//utils'
import type { ActiveTab, PoolRow } from '@components/pools/poolTable//types'

interface PoolTableTabsProps {
  poolIds: PoolId[]
  setSelectedPoolId: (poolId: PoolId) => void
}

export function PoolTableTabs({ poolIds, setSelectedPoolId }: PoolTableTabsProps) {
  const { showMainnet } = useDebugFlags()
  const { data: allVaults, isLoading } = useAllPoolsVaults(poolIds)
  const { getIsProductionPool, getIsRestrictedPool, getIsRwaPool, getIsDeRwaPool } = useGetPoolsByIds()
  const { address } = useAddress()
  const accessStatus = usePoolsAccessStatus(poolIds)

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

  const accessRwaPoolRows = useMemo(() => filterByAccess(rwaPoolRows, accessStatus), [rwaPoolRows, accessStatus])
  const accessDeRwaPoolRows = useMemo(() => filterByAccess(deRwaPoolRows, accessStatus), [deRwaPoolRows, accessStatus])

  const deRwaHeading = {
    label: 'Secondary Markets',
    subtitle: 'Freely transferable tokens that can be traded on secondary markets.',
  }

  const [activeTab, setActiveTab] = useState<ActiveTab>('funds')

  return (
    <Tabs.Root
      defaultValue="funds"
      colorPalette="yellow"
      size="lg"
      variant="line"
      onValueChange={(details) => setActiveTab(details.value as ActiveTab)}
    >
      {/* Tab triggers - z-3 so they render above the wave separator overlay (z-2) */}
      <Tabs.List borderBottomColor="border.solid" gap={8} position="relative" zIndex={3}>
        <Tabs.Trigger
          value="access"
          height="44px"
          alignItems="flex-end"
          pb={4}
          px={2}
          fontSize="2xl"
          fontWeight={400}
          color="fg.muted"
          _selected={{ fontWeight: 500, color: 'fg.solid' }}
        >
          Access & Positions
        </Tabs.Trigger>
        <Tabs.Trigger
          value="funds"
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
        <Box maxW={{ base: '95vw', xl: '75vw' }} mx="auto" mt={8}>
          <Tabs.Content value="access" pt={0}>
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
                  isLoading={isLoading || accessStatus.isLoading}
                  activeTab={activeTab}
                />
                <PoolTableSection
                  heading={deRwaHeading.label}
                  subtitle={deRwaHeading.subtitle}
                  poolRows={accessDeRwaPoolRows}
                  setSelectedPoolId={setSelectedPoolId}
                  isLoading={isLoading || accessStatus.isLoading}
                  activeTab={activeTab}
                />
              </>
            )}
          </Tabs.Content>

          <Tabs.Content value="funds" pt={0}>
            <PoolTableSection
              poolRows={rwaPoolRows}
              setSelectedPoolId={setSelectedPoolId}
              isLoading={isLoading}
              activeTab={activeTab}
            />
            <PoolTableSection
              heading={deRwaHeading.label}
              subtitle={deRwaHeading.subtitle}
              poolRows={deRwaPoolRows}
              setSelectedPoolId={setSelectedPoolId}
              isLoading={isLoading}
              activeTab={activeTab}
            />
          </Tabs.Content>
        </Box>
      </Box>
    </Tabs.Root>
  )
}

function filterByAccess(poolRows: PoolRow[], accessStatus: UsePoolsAccessStatusResult): PoolRow[] {
  if (accessStatus.isLoading || accessStatus.data.size === 0) return poolRows
  return poolRows
    .map((row) => {
      const status = accessStatus.data.get(row.poolId)
      if (!status?.hasAccess) return null
      // Only show vault sub-rows for networks where the user is a member
      const filteredVaults = row.vaults.filter((v) => status.memberNetworkIds.has(v.centrifugeId))
      if (filteredVaults.length === 0) return null
      return { ...row, vaults: filteredVaults }
    })
    .filter((row): row is PoolRow => row !== null)
}
