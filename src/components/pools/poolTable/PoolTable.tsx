import { useCallback, useMemo, useState } from 'react'
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { type Investment, useInvestmentsPerVaultsQuery } from '@cfg'
import { Box, Icon, Table, Text } from '@chakra-ui/react'
import {
  POOL_COLUMNS_ACCESS,
  POOL_COLUMNS_PRODUCTS,
  VAULT_COLUMNS_ACCESS,
  VAULT_COLUMNS_PRODUCTS,
} from '@components/pools/poolTable/columnsConfig'
import { PoolTableSkeleton } from '@components/pools/poolTable/PoolTableSkeleton'
import { getVaultPath } from '@routes/routePaths'
import { PoolTableRow } from './PoolTableRow'
import type { ActiveTab, PoolInvestmentTotals, PoolRow, SortConfig, SortField } from './types'
import { POOL_TABLE_TABS } from './types'
import { computeInvestmentTotals, sortPoolRows } from './utils'
import { VaultSubRow } from './VaultSubRow'

interface PoolTableProps {
  poolRows: PoolRow[]
  isLoading?: boolean
  activeTab: ActiveTab
}

export function PoolTable({ poolRows, isLoading, activeTab }: PoolTableProps) {
  const navigate = useNavigate()
  const [expandedPools, setExpandedPools] = useState<Set<string>>(new Set())
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)

  const togglePool = useCallback((poolId: string) => {
    setExpandedPools((prev) => {
      const next = new Set(prev)
      if (next.has(poolId)) {
        next.delete(poolId)
      } else {
        next.add(poolId)
      }
      return next
    })
  }, [])

  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => {
      if (prev?.field === field) {
        if (prev.direction === 'asc') return { field, direction: 'desc' }
        return null
      }
      return { field, direction: 'asc' }
    })
  }, [])

  const handlePoolClick = useCallback(
    (poolRow: PoolRow) => {
      const vault = poolRow.vaults[0]
      if (!vault) return
      const path = getVaultPath(poolRow.poolId, vault.networkName, vault.vaultDetails.asset.symbol)
      navigate(path)
    },
    [navigate]
  )

  const showSkeleton = isLoading && poolRows.length === 0

  const allVaults = useMemo(
    () => (!showSkeleton ? poolRows.flatMap((row) => row.vaults.map((v) => v.vault)) : undefined),
    [poolRows, showSkeleton]
  )
  const { data: allInvestments } = useInvestmentsPerVaultsQuery(allVaults)

  const investmentTotalsMap = useMemo(() => {
    const map = new Map<string, PoolInvestmentTotals>()
    if (!allInvestments) return map

    let offset = 0
    for (const row of poolRows) {
      const count = row.vaults.length
      const investments = allInvestments.slice(offset, offset + count)
      offset += count
      const totals = computeInvestmentTotals(investments)
      if (totals) map.set(row.poolId, totals)
    }
    return map
  }, [allInvestments, poolRows])

  // Build per-vault investment map from the batch query for passing to VaultSubRow
  const vaultInvestmentMap = useMemo(() => {
    const map = new Map<string, Investment>()
    if (!allInvestments) return map
    const allVaultsList = poolRows.flatMap((row) => row.vaults)
    allVaultsList.forEach((v, i) => {
      if (allInvestments[i]) map.set(v.vault.address, allInvestments[i])
    })
    return map
  }, [allInvestments, poolRows])

  const sortedRows = sortPoolRows(poolRows, sortConfig, investmentTotalsMap)

  const isAccessTable = activeTab === POOL_TABLE_TABS.access
  const poolColumns = isAccessTable ? POOL_COLUMNS_ACCESS : POOL_COLUMNS_PRODUCTS

  if (showSkeleton) {
    return <PoolTableSkeleton columns={poolColumns} />
  }

  if (poolRows.length === 0) return null

  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="line" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <Table.Header>
          <Table.Row bg="border.muted" borderRadius="10px">
            {poolColumns.map((col) => (
              <Table.ColumnHeader
                key={col.label}
                width={col.width}
                cursor={col.field ? 'pointer' : 'default'}
                onClick={col.field ? () => handleSort(col.field!) : undefined}
                userSelect="none"
                py={4}
                px={4}
                fontSize="xs"
                fontWeight={400}
                color="fg.solid"
                textAlign={col.align ?? 'left'}
                borderBottomWidth={0}
                _first={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}
                _last={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}
              >
                <Text
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                  justifyContent={col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'}
                >
                  {col.label}
                  {col.field && (
                    <Icon size="xs" color={sortConfig?.field === col.field ? 'fg.solid' : 'fg.muted'}>
                      {sortConfig?.field === col.field ? (
                        sortConfig.direction === 'asc' ? (
                          <LuArrowUp />
                        ) : (
                          <LuArrowDown />
                        )
                      ) : (
                        <LuArrowUpDown />
                      )}
                    </Icon>
                  )}
                </Text>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedRows.map((poolRow) => {
            const isExpanded = expandedPools.has(poolRow.poolId)
            return (
              <PoolTableRowGroup
                key={poolRow.poolId}
                poolRow={poolRow}
                isExpanded={isExpanded}
                onToggle={() => togglePool(poolRow.poolId)}
                onClick={() => handlePoolClick(poolRow)}
                activeTab={activeTab}
                investmentTotals={investmentTotalsMap.get(poolRow.poolId)}
                vaultInvestmentMap={vaultInvestmentMap}
                colSpan={poolColumns.length}
              />
            )
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}

function PoolTableRowGroup({
  poolRow,
  isExpanded,
  onToggle,
  onClick,
  activeTab,
  investmentTotals,
  vaultInvestmentMap,
  colSpan,
}: {
  poolRow: PoolRow
  isExpanded: boolean
  onToggle: () => void
  onClick: () => void
  activeTab: ActiveTab
  investmentTotals?: PoolInvestmentTotals
  vaultInvestmentMap: Map<string, Investment>
  colSpan: number
}) {
  const lastVaultIndex = poolRow.vaults.length - 1
  const vaultColumns = activeTab === POOL_TABLE_TABS.access ? VAULT_COLUMNS_ACCESS : VAULT_COLUMNS_PRODUCTS

  return (
    <>
      <PoolTableRow
        poolRow={poolRow}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onClick={onClick}
        activeTab={activeTab}
        investmentTotals={investmentTotals}
      />
      {isExpanded && (
        <Table.Row>
          <Table.Cell colSpan={colSpan} p={0} borderBottomWidth={0}>
            <Box px={4} pb={4}>
              <Box border="1px solid" borderColor="border.solid" borderRadius="10px" overflow="hidden">
                <Table.Root size="sm" variant="line" css={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                  <Table.Header>
                    <Table.Row bg="bg.panel">
                      {vaultColumns.map((col, i) => (
                        <Table.ColumnHeader
                          key={col.label || `empty-${i}`}
                          width={col.width}
                          py={2}
                          px={4}
                          fontSize="xs"
                          fontWeight={400}
                          color="fg.solid"
                          textAlign={col.align ?? 'left'}
                          borderBottomWidth="1px"
                          borderColor="border.solid"
                          {...(i === 0 ? { pl: 8 } : {})}
                        >
                          {col.label}
                        </Table.ColumnHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {poolRow.vaults.map((vault, i) => {
                      const isDuplicateNav = poolRow.vaults
                        .slice(0, i)
                        .some((v) => v.centrifugeId === vault.centrifugeId)
                      return (
                        <VaultSubRow
                          key={`${vault.centrifugeId}-${vault.vaultDetails.asset.address}`}
                          vaultRow={vault}
                          poolId={poolRow.poolId}
                          activeTab={activeTab}
                          investment={vaultInvestmentMap.get(vault.vault.address)}
                          isLast={i === lastVaultIndex}
                          isDuplicateNav={isDuplicateNav}
                        />
                      )
                    })}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          </Table.Cell>
        </Table.Row>
      )}
    </>
  )
}
