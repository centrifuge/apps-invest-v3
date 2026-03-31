import { useEffect, useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Pool, PoolId } from '@centrifuge/sdk'
import {
  type PoolAccessStatus,
  useAllPoolsVaults,
  useInvestmentsPerVaults,
  usePoolsAccessStatus,
  useDebugFlags,
  usePools,
} from '@cfg'
import { type PoolRow } from '@components/pools/poolTable/types'
import { groupVaultsByPool } from '@components/pools/poolTable/utils'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { PortfolioAumChart } from './PortfolioAumChart'
import { PortfolioAllocationChart } from './PortfolioAllocationChart'

interface PortfolioHeroProps {
  poolIds: PoolId[]
  fallback: React.ReactNode
  isMobile: boolean
  onDataChange: (hasData: boolean) => void
}

export function PortfolioHero({ poolIds, fallback, isMobile, onDataChange }: PortfolioHeroProps) {
  const { data: pools } = usePools()
  const { showMainnet } = useDebugFlags()
  const { data: allVaults } = useAllPoolsVaults(poolIds)
  const { data: accessData } = usePoolsAccessStatus(poolIds)
  const { getIsProductionPool, getIsRestrictedPool } = useGetPoolsByIds()

  const isMainnet = showMainnet || import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet'

  // Filter vaults to production pools (same logic as PoolTableTabs)
  const displayVaults = useMemo(() => {
    if (!allVaults) return []
    if (!isMainnet) return allVaults
    return allVaults.filter((vault) => getIsProductionPool(vault.poolId))
  }, [allVaults, isMainnet, getIsProductionPool])

  // Group into pool rows and filter by user access
  const accessPoolRows = useMemo(() => {
    const poolRows = groupVaultsByPool(displayVaults, { getIsRestrictedPool })
    return filterByAccess(poolRows, accessData)
  }, [displayVaults, accessData, getIsRestrictedPool])

  // Collect all Vault objects from access pool rows for investment fetching
  const accessVaults = useMemo(() => accessPoolRows.flatMap((row) => row.vaults.map((v) => v.vault)), [accessPoolRows])

  const { data: investments } = useInvestmentsPerVaults(accessVaults.length > 0 ? accessVaults : undefined)

  const investmentMap = useMemo(() => {
    const map = new Map<string, NonNullable<typeof investments>[number]>()
    if (!investments || !accessVaults.length) return map
    accessVaults.forEach((vault, i) => {
      if (investments[i]) map.set(vault.address, investments[i])
    })
    return map
  }, [investments, accessVaults])

  // Build a single ordered list of pools with investment data.
  // Both charts use this same list so pool ordering (and therefore colors) stays consistent.
  const investedPools = useMemo(() => {
    const result: { pool: Pool; poolName: string; investedValue: number; currentPrice: number }[] = []

    if (!pools) return result

    for (const row of accessPoolRows) {
      let totalAssetBalance = 0
      for (const vaultRow of row.vaults) {
        const inv = investmentMap.get(vaultRow.vault.address)
        if (inv) {
          totalAssetBalance += inv.assetBalance.toDecimal().toNumber()
        }
      }

      if (totalAssetBalance > 0) {
        const pool = pools.find((p) => p.id.toString() === row.poolId)
        const pricePerShare = row.poolDetails.shareClasses?.[0]?.details?.pricePerShare
        if (pool && pricePerShare) {
          result.push({
            pool,
            poolName: row.poolName,
            investedValue: totalAssetBalance,
            currentPrice: pricePerShare.toDecimal().toNumber(),
          })
        }
      }
    }

    return result
  }, [accessPoolRows, investmentMap, pools])

  const totalInvested = useMemo(() => investedPools.reduce((sum, p) => sum + p.investedValue, 0), [investedPools])

  const hasData = investedPools.length > 0

  useEffect(() => {
    onDataChange(hasData)
  }, [hasData, onDataChange])

  if (!hasData) return <>{fallback}</>

  return (
    <>
      <Flex gap={8} alignItems="stretch" flexDirection={{ base: 'column', md: 'row' }} px={2} pb={isMobile ? 8 : 2}>
        {!isMobile ? <PortfolioAumChart pools={investedPools} totalInvested={totalInvested} /> : null}
        <PortfolioAllocationChart pools={investedPools.map((p) => ({ poolName: p.poolName, aum: p.investedValue }))} />
      </Flex>
      {!isMobile && (
        <Box position="absolute" bottom="-70px" height="70px" width="100vw" background="#07090A" zIndex={1} />
      )}
    </>
  )
}

function filterByAccess(poolRows: PoolRow[], accessData: Map<string, PoolAccessStatus> | undefined): PoolRow[] {
  if (!accessData || accessData.size === 0) return []
  return poolRows
    .map((row) => {
      const status = accessData.get(row.poolId)
      if (!status?.hasAccess) return null
      const filteredVaults = row.vaults.filter((v) => status.memberNetworkIds.has(v.centrifugeId))
      if (filteredVaults.length === 0) return null
      return { ...row, vaults: filteredVaults }
    })
    .filter((row): row is PoolRow => row !== null)
}
