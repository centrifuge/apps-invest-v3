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

  const rwaHeading = {
    label: 'RWA',
    subtitle: 'Tokenized real-world assets issued under various legal structures. KYB onboarding required.',
  }

  const deRwaHeading = {
    label: 'Secondary Markets (deRWA)',
    subtitle:
      'Decentralized real-world asset tokens. Freely transferable tokens with on-chain transparency and liquidity.',
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
      <Tabs.List>
        <Tabs.Trigger value="access" height="55px" alignItems="flex-end">
          Access & Positions
        </Tabs.Trigger>
        <Tabs.Trigger value="funds" height="55px" alignItems="flex-end">
          Funds
        </Tabs.Trigger>
        <Tabs.Indicator bg="fg.emphasized" height="2px" borderRadius="1px" bottom="0" />
      </Tabs.List>

      <Tabs.Content value="access" pt={6}>
        {!address ? (
          <Box py={8} textAlign="center">
            <Text color="fg.muted" fontSize="md">
              Connect your wallet to see pools you have access to and your positions.
            </Text>
          </Box>
        ) : (
          <>
            <PoolTableSection
              heading={rwaHeading.label}
              subtitle={rwaHeading.subtitle}
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

      <Tabs.Content value="funds" pt={6}>
        <PoolTableSection
          heading={rwaHeading.label}
          subtitle={rwaHeading.subtitle}
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
    </Tabs.Root>
  )
}

function filterByAccess(poolRows: PoolRow[], accessStatus: UsePoolsAccessStatusResult): PoolRow[] {
  if (accessStatus.isLoading || accessStatus.data.size === 0) return poolRows
  return poolRows.filter((row) => {
    const status = accessStatus.data.get(row.poolId)
    return status?.hasAccess ?? false
  })
}
