import { Flex, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { formatBalance, useInvestment, useShareClassDetails } from '@cfg'
import type { PoolDetails } from '@cfg'
import { NetworkIcon } from '@ui'
import { getVaultPath } from '@routes/routePaths'
import { useNavigate } from 'react-router-dom'
import type { ActiveTab, ExpandedPosition, VaultRow } from './types'
import { getExpandedCellBorder } from './utils'

interface VaultSubRowProps {
  vaultRow: VaultRow
  poolId: string
  setSelectedPoolId: (poolId: PoolId) => void
  poolDetails: PoolDetails
  activeTab: ActiveTab
  expandedPosition?: ExpandedPosition
}

export function VaultSubRow({
  vaultRow,
  poolId,
  setSelectedPoolId,
  poolDetails,
  activeTab,
  expandedPosition,
}: VaultSubRowProps) {
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
      <Table.Cell pl={12} {...getExpandedCellBorder(expandedPosition, 'first')}>
        <Flex alignItems="center" gap={2}>
          <NetworkIcon centrifugeId={vaultRow.centrifugeId} boxSize="20px" />
          <Text fontSize="sm" color="fg.muted">
            {vaultRow.networkDisplayName}
          </Text>
        </Flex>
      </Table.Cell>

      {activeTab === 'access' ? (
        <AccessVaultCells vault={vaultRow} assetSymbol={assetSymbol} expandedPosition={expandedPosition} />
      ) : (
        <FundsVaultCells vaultRow={vaultRow} expandedPosition={expandedPosition} />
      )}
    </Table.Row>
  )
}

const numericCellProps = { textAlign: 'right' as const }
const numericTextProps = { fontSize: 'xs' as const, fontVariantNumeric: 'tabular-nums' as const }

function AccessVaultCells({
  vault,
  assetSymbol,
  expandedPosition,
}: {
  vault: VaultRow
  assetSymbol: string
  expandedPosition?: ExpandedPosition
}) {
  const { data: investment } = useInvestment(vault.vault)

  const fmt = (value: unknown) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell textAlign="center" {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text fontSize="xs">{assetSymbol}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(investment?.assetBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(investment?.shareBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(investment?.pendingDepositAssets)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(investment?.pendingRedeemShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(investment?.claimableDepositShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'last')}>
        <Text {...numericTextProps}>{fmt(investment?.claimableRedeemAssets)}</Text>
      </Table.Cell>
    </>
  )
}

function FundsVaultCells({ vaultRow, expandedPosition }: { vaultRow: VaultRow; expandedPosition?: ExpandedPosition }) {
  const { data: shareClassDetails } = useShareClassDetails(vaultRow.vault.shareClass)
  const networkData = shareClassDetails?.navPerNetwork.find((n) => n.centrifugeId === vaultRow.centrifugeId)

  const fmt = (value: unknown) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell textAlign="center" {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text fontSize="xs">{vaultRow.vaultDetails.asset.symbol}</Text>
      </Table.Cell>
      <Table.Cell textAlign="center" {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text fontSize="xs">{shareClassDetails?.symbol ?? '-'}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(networkData?.nav)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(networkData?.totalIssuance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')}>
        <Text {...numericTextProps}>{fmt(networkData?.pricePerShare)}</Text>
      </Table.Cell>
      <Table.Cell {...getExpandedCellBorder(expandedPosition, 'last')} />
    </>
  )
}
