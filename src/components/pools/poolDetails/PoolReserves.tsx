import {
  formatBalance,
  formatPercentage,
  truncateAddress,
  useHoldingEscrowBalances,
  type HoldingEscrowBalance,
} from '@cfg'
import { Heading, Text, Box } from '@chakra-ui/react'
import { usePoolContext } from '@contexts/PoolContext'
import { type ColumnDefinition, DataTable, NetworkIcon, Tooltip } from '@ui'

type TableRow = HoldingEscrowBalance & { id: number }

export function PoolReserves() {
  const { shareClassId, poolDetails } = usePoolContext()
  const { data: balances, isLoading } = useHoldingEscrowBalances(shareClassId?.raw)
  const addressLabels = poolDetails?.metadata?.addressLabels

  if (!isLoading && (!balances || balances.length === 0)) return null

  const rows: TableRow[] = balances?.map((b, i) => ({ ...b, id: i })) ?? []

  const getLabel = (address: string) => {
    if (!addressLabels) return undefined
    const normalized = address.toLowerCase()
    const entry = Object.entries(addressLabels).find(([addr]) => addr.toLowerCase() === normalized)
    return entry?.[1]
  }

  const columns: ColumnDefinition<TableRow>[] = [
    {
      header: 'Wallet',
      sortKey: 'escrowAddress',
      render: (row) => {
        const label = getLabel(row.escrowAddress)
        return (
          <Box>
            {label && (
              <Text fontSize="sm" fontWeight={600}>
                {label}
              </Text>
            )}
            <Tooltip content={<Text>{row.escrowAddress}</Text>}>
              <Text fontFamily="mono" fontSize="sm" color={label ? 'fg.muted' : undefined}>
                {truncateAddress(row.escrowAddress, 3, 3)}
              </Text>
            </Tooltip>
          </Box>
        )
      },
    },
    {
      header: 'Asset',
      sortKey: 'assetSymbol',
      render: (row) => row.assetSymbol,
    },
    {
      header: 'Network',
      sortKey: 'centrifugeId',
      textAlign: 'center',
      render: (row) => (
        <Box display="flex" justifyContent="center">
          <NetworkIcon centrifugeId={row.centrifugeId} boxSize="20px" />
        </Box>
      ),
    },
    {
      header: 'Amount',
      sortKey: 'amount',
      textAlign: 'end',
      render: (row) => formatBalance(row.amount, { precision: 2 }),
    },
    {
      header: 'Value',
      sortKey: 'valueUsd',
      textAlign: 'end',
      render: (row) => formatBalance(row.valueUsd, { precision: 2, currency: 'USD' }),
    },
    {
      header: 'Percentage',
      sortKey: 'percentage',
      textAlign: 'end',
      render: (row) => formatPercentage(row.percentage),
    },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={2}>
        Transparency
      </Heading>
      <Text fontSize="sm" mb={4}>
        A transparent overview of all on-chain holdings, organized by Balance Sheet Manager and blockchain network.
      </Text>
      <DataTable columns={columns} data={rows} isLoading={isLoading} skeletonRowNumber={3} />
    </>
  )
}
