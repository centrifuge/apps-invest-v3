import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Icon, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { useInvestmentsPerVaults } from '@cfg'
import { getVaultPath } from '@routes/routePaths'
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu'
import type { ActiveTab, ExpandedPosition, PoolInvestmentTotals, PoolRow, SortConfig, SortField } from './types'
import { computeInvestmentTotals, getExpandedCellBorder, sortPoolRows } from './utils'
import { PoolTableRow } from './PoolTableRow'
import { VaultSubRow } from './VaultSubRow'
import { PoolTableSkeleton } from '@components/pools/poolTable/PoolTableSkeleton'
import {
  POOL_COLUMNS_ACCESS,
  POOL_COLUMNS_FUNDS,
  VAULT_COLUMNS_ACCESS,
  VAULT_COLUMNS_FUNDS,
} from '@components/pools/poolTable/columnsConfig'

interface PoolTableProps {
  poolRows: PoolRow[]
  setSelectedPoolId: (poolId: PoolId) => void
  isLoading?: boolean
  activeTab: ActiveTab
}

export function PoolTable({ poolRows, setSelectedPoolId, isLoading, activeTab }: PoolTableProps) {
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
      setSelectedPoolId(poolRow.poolDetails.id)
      const path = getVaultPath(poolRow.poolId, vault.networkName, vault.vaultDetails.asset.symbol)
      navigate(path)
    },
    [navigate, setSelectedPoolId]
  )

  const isAccessTable = activeTab === 'access'

  const allVaults = useMemo(
    () => (isAccessTable ? poolRows.flatMap((row) => row.vaults.map((v) => v.vault)) : undefined),
    [poolRows, isAccessTable]
  )
  const { data: allInvestments } = useInvestmentsPerVaults(allVaults)

  const investmentTotalsMap = useMemo(() => {
    const map = new Map<string, PoolInvestmentTotals>()
    if (!allInvestments || !isAccessTable) return map

    let offset = 0
    for (const row of poolRows) {
      const count = row.vaults.length
      const investments = allInvestments.slice(offset, offset + count)
      offset += count
      const totals = computeInvestmentTotals(investments)
      if (totals) map.set(row.poolId, totals)
    }
    return map
  }, [allInvestments, poolRows, isAccessTable])

  const sortedRows = sortPoolRows(poolRows, sortConfig, investmentTotalsMap)
  const poolColumns = isAccessTable ? POOL_COLUMNS_ACCESS : POOL_COLUMNS_FUNDS

  if (isLoading) {
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
          {sortedRows.map((poolRow, index) => {
            const isExpanded = expandedPools.has(poolRow.poolId)
            const nextRow = sortedRows[index + 1]
            const nextIsExpanded = nextRow ? expandedPools.has(nextRow.poolId) : false
            return (
              <PoolTableRowGroup
                key={poolRow.poolId}
                poolRow={poolRow}
                isExpanded={isExpanded}
                nextIsExpanded={nextIsExpanded}
                onToggle={() => togglePool(poolRow.poolId)}
                onClick={() => handlePoolClick(poolRow)}
                setSelectedPoolId={setSelectedPoolId}
                activeTab={activeTab}
                investmentTotals={investmentTotalsMap.get(poolRow.poolId)}
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
  nextIsExpanded,
  onToggle,
  onClick,
  setSelectedPoolId,
  activeTab,
  investmentTotals,
}: {
  poolRow: PoolRow
  isExpanded: boolean
  nextIsExpanded: boolean
  onToggle: () => void
  onClick: () => void
  setSelectedPoolId: (poolId: PoolId) => void
  activeTab: ActiveTab
  investmentTotals?: PoolInvestmentTotals
}) {
  const lastVaultIndex = poolRow.vaults.length - 1

  return (
    <>
      <PoolTableRow
        poolRow={poolRow}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onClick={onClick}
        activeTab={activeTab}
        expandedPosition={isExpanded ? 'top' : undefined}
        hideBottomBorder={!isExpanded && nextIsExpanded}
        investmentTotals={investmentTotals}
      />
      {isExpanded && <VaultHeaderRow activeTab={activeTab} expandedPosition="middle" />}
      {isExpanded &&
        poolRow.vaults.map((vault, i) => (
          <VaultSubRow
            key={`${vault.centrifugeId}-${vault.vaultDetails.asset.address}`}
            vaultRow={vault}
            poolId={poolRow.poolId}
            setSelectedPoolId={setSelectedPoolId}
            poolDetails={poolRow.poolDetails}
            activeTab={activeTab}
            expandedPosition={i === lastVaultIndex ? 'bottom' : 'middle'}
          />
        ))}
    </>
  )
}

function VaultHeaderRow({
  activeTab,
  expandedPosition,
}: {
  activeTab: ActiveTab
  expandedPosition?: ExpandedPosition
}) {
  const columns = activeTab === 'access' ? VAULT_COLUMNS_ACCESS : VAULT_COLUMNS_FUNDS

  return (
    <Table.Row bg="border.muted">
      {columns.map((col, i) => {
        const cellPos =
          i === 0 ? ('first' as const) : i === columns.length - 1 ? ('last' as const) : ('middle' as const)
        return (
          <Table.Cell
            key={col.label || `empty-${i}`}
            width={col.width}
            py={2}
            px={4}
            fontSize="xs"
            fontWeight={400}
            color="fg.solid"
            textAlign={col.align ?? 'left'}
            {...getExpandedCellBorder(expandedPosition, cellPos)}
          >
            {col.label}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}
