import { Badge, Flex, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { formatBalance, PoolDetails, useInvestment } from '@cfg'
import { NetworkIcon } from '@ui'
import { getVaultPath } from '@routes/routePaths'
import { useNavigate } from 'react-router-dom'
import type { ActiveTab, VaultRow } from './types'

interface VaultSubRowProps {
  vaultRow: VaultRow
  poolId: string
  setSelectedPoolId: (poolId: PoolId) => void
  poolDetails: PoolDetails
  activeTab: ActiveTab
}

export function VaultSubRow({ vaultRow, poolId, setSelectedPoolId, poolDetails, activeTab }: VaultSubRowProps) {
  const navigate = useNavigate()
  const assetSymbol = vaultRow.vaultDetails.asset.symbol

  const handleClick = () => {
    setSelectedPoolId(poolDetails.id)
    const path = getVaultPath(poolId, vaultRow.networkName, assetSymbol)
    navigate(path)
  }

  return (
    <Table.Row
      onClick={handleClick}
      cursor="pointer"
      bg="bg.subtle"
      _hover={{ bg: 'bg.muted' }}
      transition="background 150ms"
    >
      <Table.Cell pl={12}>
        <Flex alignItems="center" gap={2}>
          <NetworkIcon centrifugeId={vaultRow.centrifugeId} boxSize="20px" />
          <Text fontSize="sm" color="fg.muted">
            {vaultRow.networkDisplayName}
          </Text>
          <Badge colorPalette="yellow" size="sm" fontWeight={700} color="yellow.emphasized">
            {assetSymbol}
          </Badge>
        </Flex>
      </Table.Cell>

      {activeTab === 'access' ? <AccessVaultCells vault={vaultRow} /> : <FundsVaultCells poolDetails={poolDetails} />}
    </Table.Row>
  )
}

const numericCellProps = { textAlign: 'right' as const }
const numericTextProps = { fontSize: 'sm' as const, fontVariantNumeric: 'tabular-nums' as const }

function AccessVaultCells({ vault }: { vault: VaultRow }) {
  const { data: investment } = useInvestment(vault.vault)

  const fmt = (value: unknown) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(investment?.assetBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(investment?.shareBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(investment?.pendingDepositAssets)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(investment?.pendingRedeemShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(investment?.claimableDepositShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(investment?.claimableRedeemAssets)}</Text>
      </Table.Cell>
    </>
  )
}

function FundsVaultCells({ poolDetails }: { poolDetails: PoolDetails }) {
  const shareClassDetails = poolDetails.shareClasses?.[0]?.details

  const fmt = (value: unknown) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell textAlign="center">
        <Text fontSize="sm">{shareClassDetails?.symbol ?? '-'}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(shareClassDetails?.nav)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(shareClassDetails?.totalIssuance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(shareClassDetails?.pricePerShare)}</Text>
      </Table.Cell>
      <Table.Cell />
      <Table.Cell />
    </>
  )
}