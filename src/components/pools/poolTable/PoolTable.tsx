import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Icon, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { getVaultPath } from '@routes/routePaths'
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from 'react-icons/lu'
import type { ActiveTab, PoolRow, SortConfig, SortField } from './types'
import { sortPoolRows } from './utils'
import { PoolTableRow } from './PoolTableRow'
import { VaultSubRow } from './VaultSubRow'
import { PoolTableSkeleton } from '@components/pools/poolTable/PoolTableSkeleton'

interface PoolTableProps {
  poolRows: PoolRow[]
  setSelectedPoolId: (poolId: PoolId) => void
  isLoading?: boolean
  activeTab: ActiveTab
}

export interface PoolTableColumns {
  label: string
  field?: SortField
  width: string
  align?: 'left' | 'center' | 'right'
}

const POOL_COLUMNS_ACCESS: PoolTableColumns[] = [
  { label: 'Fund', field: 'name', width: '20%' },
  { label: 'Type', width: '8%', align: 'center' },
  { label: 'Total Assets', field: 'totalAssets', width: '12%', align: 'right' },
  { label: 'Total Shares', field: 'totalShares', width: '12%', align: 'right' },
  { label: 'Total Pending Deposits', field: 'pendingDeposits', width: '12%', align: 'right' },
  { label: 'Total Pending Redemptions', field: 'pendingRedemptions', width: '12%', align: 'right' },
  { label: 'Total Deposit Claims', field: 'depositClaims', width: '12%', align: 'right' },
  { label: 'Total Redeem Claims', field: 'redeemClaims', width: '12%', align: 'right' },
]

const POOL_COLUMNS_FUNDS: PoolTableColumns[] = [
  { label: 'Fund', field: 'name', width: '25%' },
  { label: 'Type', width: '8%', align: 'center' },
  { label: 'TVL (USD)', field: 'tvl', width: '15%', align: 'right' },
  { label: 'APY', field: 'apy', width: '8%', align: 'center' },
  { label: 'Asset type', width: '15%' },
  { label: 'Investor type', width: '14%' },
  { label: 'Min. Investment', width: '15%', align: 'right' },
]

interface VaultColumn {
  label: string
  width: string
  align?: 'left' | 'center' | 'right'
}

const VAULT_COLUMNS_ACCESS: VaultColumn[] = [
  { label: 'Vault', width: '14%' },
  { label: 'Asset', width: '8%', align: 'center' },
  { label: 'Asset Balance', width: '13%', align: 'right' },
  { label: 'Share Balance', width: '13%', align: 'right' },
  { label: 'Pending Deposit', width: '13%', align: 'right' },
  { label: 'Pending Redeem', width: '13%', align: 'right' },
  { label: 'Claimable Deposit', width: '14%', align: 'right' },
  { label: 'Claimable Redeem', width: '14%', align: 'right' },
]

const VAULT_COLUMNS_FUNDS: VaultColumn[] = [
  { label: 'Vault', width: '25%' },
  { label: 'Asset', width: '10%', align: 'center' },
  { label: 'Token', width: '10%', align: 'center' },
  { label: 'NAV', width: '13%', align: 'right' },
  { label: 'Total Issuance', width: '13%', align: 'right' },
  { label: 'Price/Share', width: '12%', align: 'right' },
  { label: '', width: '17%' },
]

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

  const isAccessTable = activeTab === 'access'
  const poolColumns = isAccessTable ? POOL_COLUMNS_ACCESS : POOL_COLUMNS_FUNDS

  if (isLoading) {
    return <PoolTableSkeleton columns={POOL_COLUMNS_FUNDS} />
  }

  if (poolRows.length === 0) return null

  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline">
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
                setSelectedPoolId={setSelectedPoolId}
                activeTab={activeTab}
              />
            )
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}

function VaultHeaderRow({ activeTab }: { activeTab: ActiveTab }) {
  const columns = activeTab === 'access' ? VAULT_COLUMNS_ACCESS : VAULT_COLUMNS_FUNDS

  return (
    <Table.Row bg="border.muted">
      {columns.map((col, i) => (
        <Table.Cell
          key={col.label || `empty-${i}`}
          width={col.width}
          py={2}
          px={4}
          fontSize="xs"
          fontWeight={400}
          color="fg.solid"
          textAlign={col.align ?? 'left'}
        >
          {col.label}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

function PoolTableRowGroup({
  poolRow,
  isExpanded,
  onToggle,
  onClick,
  setSelectedPoolId,
  activeTab,
}: {
  poolRow: PoolRow
  isExpanded: boolean
  onToggle: () => void
  onClick: () => void
  setSelectedPoolId: (poolId: PoolId) => void
  activeTab: ActiveTab
}) {
  return (
    <>
      <PoolTableRow
        poolRow={poolRow}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onClick={onClick}
        activeTab={activeTab}
      />
      {isExpanded && <VaultHeaderRow activeTab={activeTab} />}
      {isExpanded &&
        poolRow.vaults.map((vault) => (
          <VaultSubRow
            key={`${vault.centrifugeId}-${vault.vaultDetails.asset.address}`}
            vaultRow={vault}
            poolId={poolRow.poolId}
            setSelectedPoolId={setSelectedPoolId}
            poolDetails={poolRow.poolDetails}
            activeTab={activeTab}
          />
        ))}
    </>
  )
}
