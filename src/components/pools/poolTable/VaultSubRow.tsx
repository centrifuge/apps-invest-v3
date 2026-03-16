import { Flex, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { formatBalance, useShareClassDetails } from '@cfg'
import type { FormattableBalance, Investment, PoolDetails } from '@cfg'
import { VAULT_COLUMNS_ACCESS, VAULT_COLUMNS_PRODUCTS } from '@components/pools/poolTable/columnsConfig'
import { NetworkIcon } from '@ui'
import { getVaultPath } from '@routes/routePaths'
import { useNavigate } from 'react-router-dom'
import { type ActiveTab, type VaultRow, POOL_TABLE_TABS } from './types'

interface VaultSubRowProps {
  vaultRow: VaultRow
  poolId: string
  setSelectedPoolId: (poolId: PoolId) => void
  poolDetails: PoolDetails
  activeTab: ActiveTab
  investment?: Investment
  isLast?: boolean
  isDuplicateNav?: boolean
}

export function VaultSubRow({
  vaultRow,
  poolId,
  setSelectedPoolId,
  poolDetails,
  activeTab,
  investment,
  isLast,
  isDuplicateNav,
}: VaultSubRowProps) {
  const navigate = useNavigate()
  const assetSymbol = vaultRow.vaultDetails.asset.symbol

  const handleClick = () => {
    setSelectedPoolId(poolDetails.id)
    const path = getVaultPath(poolId, vaultRow.networkName, assetSymbol)
    navigate(path)
  }

  const borderBottom = isLast ? { borderBottomWidth: 0 } : {}

  return (
    <Table.Row
      onClick={handleClick}
      cursor="pointer"
      bg="#f1f5f7"
      _hover={{ bg: 'bg.muted' }}
      transition="background 150ms"
      height="3rem"
    >
      <Table.Cell pl={8} {...borderBottom} borderColor="charcoal.200">
        <Flex alignItems="center" gap={2}>
          <NetworkIcon centrifugeId={vaultRow.centrifugeId} boxSize="20px" />
          <Text fontSize="xs" fontWeight={500} color="fg.solid">
            {vaultRow.networkDisplayName}
          </Text>
        </Flex>
      </Table.Cell>

      {activeTab === POOL_TABLE_TABS.access ? (
        <AccessVaultCells investment={investment} assetSymbol={assetSymbol} isLast={isLast} />
      ) : (
        <FundsVaultCells vaultRow={vaultRow} investment={investment} isLast={isLast} isDuplicateNav={isDuplicateNav} />
      )}
    </Table.Row>
  )
}

const numericTextProps = { fontSize: 'xs' as const, fontVariantNumeric: 'tabular-nums' as const }

function AccessVaultCells({
  investment,
  assetSymbol,
  isLast,
}: {
  investment?: Investment
  assetSymbol: string
  isLast?: boolean
}) {
  const cols = VAULT_COLUMNS_ACCESS
  const fmt = (value: unknown) => formatBalance(value as FormattableBalance, { precision: 2 })
  const borderBottom = isLast ? { borderBottomWidth: 0 } : {}

  return (
    <>
      <Table.Cell textAlign={cols[1].align} {...borderBottom} borderColor="charcoal.200">
        <Text fontSize="xs">{assetSymbol}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[2].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.assetBalance)}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[3].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.shareBalance)}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[4].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.pendingDepositAssets)}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[5].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.pendingRedeemShares)}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[6].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.claimableDepositShares)}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[7].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.claimableRedeemAssets)}</Text>
      </Table.Cell>
    </>
  )
}

function FundsVaultCells({
  vaultRow,
  investment,
  isLast,
  isDuplicateNav,
}: {
  vaultRow: VaultRow
  investment?: Investment
  isLast?: boolean
  isDuplicateNav?: boolean
}) {
  const cols = VAULT_COLUMNS_PRODUCTS
  const { data: shareClassDetails } = useShareClassDetails(vaultRow.vault.shareClass)
  const networkData = shareClassDetails?.navPerNetwork.find((n) => n.centrifugeId === vaultRow.centrifugeId)

  const fmt = (value: unknown) => formatBalance(value as FormattableBalance, { precision: 2 })
  const borderBottom = isLast ? { borderBottomWidth: 0 } : {}
  const duplicateProps = isDuplicateNav ? { opacity: 0.35 } : {}

  return (
    <>
      <Table.Cell textAlign={cols[1].align} {...borderBottom} borderColor="charcoal.200">
        <Text fontSize="xs">{vaultRow.vaultDetails.asset.symbol}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[2].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps}>{fmt(investment?.assetBalance)}</Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[3].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps} {...duplicateProps}>
          {fmt(networkData?.nav)}
        </Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[4].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps} {...duplicateProps}>
          {fmt(networkData?.totalIssuance)}
        </Text>
      </Table.Cell>
      <Table.Cell textAlign={cols[5].align} {...borderBottom} borderColor="charcoal.200">
        <Text {...numericTextProps} {...duplicateProps}>
          {fmt(networkData?.pricePerShare)}
        </Text>
      </Table.Cell>
    </>
  )
}
