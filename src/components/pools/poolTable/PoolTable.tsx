import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Icon, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { getVaultPath } from '@routes/routePaths'
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu'
import type { PoolRow, SortConfig, SortField } from './types'
import { sortPoolRows } from './utils'
import { PoolTableRow } from './PoolTableRow'
import { VaultSubRow } from './VaultSubRow'
import { PoolTableSkeleton } from '@components/pools/poolTable/PoolTableSkeleton'

interface PoolTableProps {
  poolRows: PoolRow[]
  setSelectedPoolId: (poolId: PoolId) => void
  isLoading?: boolean
}

export interface PoolTableColumns {
  label: string
  field?: SortField
  width: string
}

const COLUMNS: PoolTableColumns[] = [
  { label: 'Fund', field: 'name', width: '25%' },
  { label: 'Type', width: '8%' },
  { label: 'TVL (USD)', field: 'tvl', width: '15%' },
  { label: 'APY', field: 'apy', width: '8%' },
  { label: 'Asset type', width: '15%' },
  { label: 'Investor type', width: '14%' },
  { label: 'Min. Investment', width: '15%' },
]

export function PoolTable({ poolRows, setSelectedPoolId, isLoading }: PoolTableProps) {
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

  const sortedRows = sortPoolRows(poolRows, sortConfig)

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

  if (isLoading) {
    return <PoolTableSkeleton columns={COLUMNS} />
  }

  if (poolRows.length === 0) return null

  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row bg="bg.muted">
            {COLUMNS.map((col) => (
              <Table.ColumnHeader
                key={col.label}
                width={col.width}
                cursor={col.field ? 'pointer' : 'default'}
                onClick={col.field ? () => handleSort(col.field!) : undefined}
                userSelect="none"
                py={3}
                px={4}
                fontSize="xs"
                fontWeight={600}
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                <Text as="span" display="inline-flex" alignItems="center" gap={1}>
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
                setSelectedPoolId={setSelectedPoolId}
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
  setSelectedPoolId,
}: {
  poolRow: PoolRow
  isExpanded: boolean
  onToggle: () => void
  onClick: () => void
  setSelectedPoolId: (poolId: PoolId) => void
}) {
  return (
    <>
      <PoolTableRow poolRow={poolRow} isExpanded={isExpanded} onToggle={onToggle} onClick={onClick} />
      {isExpanded &&
        poolRow.vaults.map((vault) => (
          <VaultSubRow
            key={`${vault.centrifugeId}-${vault.vaultDetails.asset.address}`}
            vaultRow={vault}
            poolId={poolRow.poolId}
            setSelectedPoolId={setSelectedPoolId}
            poolDetails={poolRow.poolDetails}
          />
        ))}
    </>
  )
}
