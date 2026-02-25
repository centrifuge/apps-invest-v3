import { Flex, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { formatBalance, useInvestment, useShareClassDetails } from '@cfg'
import type { PoolDetails } from '@cfg'
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
        </Flex>
      </Table.Cell>

      {activeTab === 'access' ? (
        <AccessVaultCells vault={vaultRow} assetSymbol={assetSymbol} />
      ) : (
        <FundsVaultCells vaultRow={vaultRow} />
      )}
    </Table.Row>
  )
}

const numericCellProps = { textAlign: 'right' as const }
const numericTextProps = { fontSize: 'sm' as const, fontVariantNumeric: 'tabular-nums' as const }

function AccessVaultCells({ vault, assetSymbol }: { vault: VaultRow; assetSymbol: string }) {
  const { data: investment } = useInvestment(vault.vault)

  const fmt = (value: unknown) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell textAlign="center">
        <Text fontSize="sm">{assetSymbol}</Text>
      </Table.Cell>
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

function FundsVaultCells({ vaultRow }: { vaultRow: VaultRow }) {
  const { data: shareClassDetails } = useShareClassDetails(vaultRow.vault.shareClass)
  const networkData = shareClassDetails?.navPerNetwork.find((n) => n.centrifugeId === vaultRow.centrifugeId)

  const fmt = (value: unknown) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell textAlign="center">
        <Text fontSize="sm">{vaultRow.vaultDetails.asset.symbol}</Text>
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Text fontSize="sm">{shareClassDetails?.symbol ?? '-'}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(networkData?.nav)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(networkData?.totalIssuance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(networkData?.pricePerShare)}</Text>
      </Table.Cell>
      <Table.Cell />
    </>
  )
}
