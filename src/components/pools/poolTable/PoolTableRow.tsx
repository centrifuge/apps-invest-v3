import { useMemo } from 'react'
import { MdBrokenImage } from 'react-icons/md'
import { Badge, Flex, Icon, Image, Table, Text } from '@chakra-ui/react'
import type { Balance } from '@centrifuge/sdk'
import { formatBalance, ipfsToHttp, useInvestmentsPerVaults } from '@cfg'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'
import type { ActiveTab, ExpandedPosition, PoolRow } from './types'
import { getExpandedCellBorder } from './utils'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

interface PoolTableRowProps {
  poolRow: PoolRow
  isExpanded: boolean
  onToggle: () => void
  onClick: () => void
  activeTab: ActiveTab
  expandedPosition?: ExpandedPosition
  hideBottomBorder?: boolean
}

const noBorderBottom = { borderBottomWidth: '0' } as const

export function PoolTableRow({
  poolRow,
  isExpanded,
  onToggle,
  onClick,
  activeTab,
  expandedPosition,
  hideBottomBorder,
}: PoolTableRowProps) {
  const isExpandable = poolRow.vaults.length > 1
  const poolType = poolRow.poolDetails.metadata?.pool?.asset.class ?? ''
  const borderBottom = hideBottomBorder ? noBorderBottom : {}

  const handleClick = () => {
    if (isExpandable) {
      onToggle()
    } else {
      onClick()
    }
  }

  return (
    <Table.Row onClick={handleClick} cursor="pointer" _hover={{ bg: 'bg.subtle' }} transition="background 150ms">
      <Table.Cell {...getExpandedCellBorder(expandedPosition, 'first')} {...borderBottom}>
        <Flex alignItems="center" gap={2}>
          {isExpandable ? (
            <Icon size="sm" color="fg.muted">
              {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
            </Icon>
          ) : (
            <Icon size="sm" color="transparent">
              <LuChevronRight />
            </Icon>
          )}
          {poolRow.iconUri ? (
            <Image
              src={ipfsToHttp(poolRow.iconUri, pinataGateway)}
              alt={poolRow.poolName}
              height="28px"
              width="28px"
              borderRadius="4px"
              flexShrink={0}
            />
          ) : (
            <Icon size="md" color="fg.muted" flexShrink={0}>
              <MdBrokenImage />
            </Icon>
          )}
          <Text fontSize="sm" fontWeight={500} lineClamp={1}>
            {poolRow.poolName}
          </Text>
        </Flex>
      </Table.Cell>

      <Table.Cell textAlign="center" {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        {poolType ? (
          <Badge size="sm" variant="solid" colorPalette="gray">
            {poolType}
          </Badge>
        ) : null}
      </Table.Cell>

      {activeTab === 'access' ? (
        <AccessPoolCells poolRow={poolRow} expandedPosition={expandedPosition} hideBottomBorder={hideBottomBorder} />
      ) : (
        <FundsPoolCells poolRow={poolRow} expandedPosition={expandedPosition} hideBottomBorder={hideBottomBorder} />
      )}
    </Table.Row>
  )
}

const numericCellProps = { textAlign: 'right' as const }
const numericTextProps = { fontSize: 'xs' as const, fontVariantNumeric: 'tabular-nums' as const }

function FundsPoolCells({
  poolRow,
  expandedPosition,
  hideBottomBorder,
}: {
  poolRow: PoolRow
  expandedPosition?: ExpandedPosition
  hideBottomBorder?: boolean
}) {
  const borderBottom = hideBottomBorder ? noBorderBottom : {}

  return (
    <>
      <Table.Cell textAlign="right" {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        {poolRow.isRestricted ? (
          <InvestorsOnlyValueBlock />
        ) : (
          <Text fontSize="sm" fontVariantNumeric="tabular-nums">
            {poolRow.tvl}
          </Text>
        )}
      </Table.Cell>

      <Table.Cell textAlign="center" {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        {poolRow.isRestricted ? (
          <Text fontSize="sm" color="fg.muted">
            --
          </Text>
        ) : (
          <Text fontSize="sm" fontVariantNumeric="tabular-nums">
            {poolRow.apy}
          </Text>
        )}
      </Table.Cell>

      <Table.Cell {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text fontSize="xs">{poolRow.assetType}</Text>
      </Table.Cell>

      <Table.Cell {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text fontSize="xs">{poolRow.investorType}</Text>
      </Table.Cell>

      <Table.Cell textAlign="right" {...getExpandedCellBorder(expandedPosition, 'last')} {...borderBottom}>
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {poolRow.minInvestment}
        </Text>
      </Table.Cell>
    </>
  )
}

function AccessPoolCells({
  poolRow,
  expandedPosition,
  hideBottomBorder,
}: {
  poolRow: PoolRow
  expandedPosition?: ExpandedPosition
  hideBottomBorder?: boolean
}) {
  const borderBottom = hideBottomBorder ? noBorderBottom : {}
  const vaults = useMemo(() => poolRow.vaults.map((v) => v.vault), [poolRow.vaults])
  const { data: investments } = useInvestmentsPerVaults(vaults)

  const totals = useMemo(() => {
    if (!investments || investments.length === 0) return null

    const [first, ...rest] = investments
    return rest.reduce(
      (acc, inv) => ({
        assetBalance: acc.assetBalance.add(inv.assetBalance),
        shareBalance: acc.shareBalance.add(inv.shareBalance),
        pendingDepositAssets: acc.pendingDepositAssets.add(inv.pendingDepositAssets),
        pendingRedeemShares: acc.pendingRedeemShares.add(inv.pendingRedeemShares),
        claimableDepositShares: acc.claimableDepositShares.add(inv.claimableDepositShares),
        claimableRedeemAssets: acc.claimableRedeemAssets.add(inv.claimableRedeemAssets),
      }),
      {
        assetBalance: first.assetBalance,
        shareBalance: first.shareBalance,
        pendingDepositAssets: first.pendingDepositAssets,
        pendingRedeemShares: first.pendingRedeemShares,
        claimableDepositShares: first.claimableDepositShares,
        claimableRedeemAssets: first.claimableRedeemAssets,
      }
    )
  }, [investments])

  const fmt = (value: Balance | undefined) => formatBalance(value as Parameters<typeof formatBalance>[0], undefined, 2)

  return (
    <>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text {...numericTextProps}>{fmt(totals?.assetBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text {...numericTextProps}>{fmt(totals?.shareBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text {...numericTextProps}>{fmt(totals?.pendingDepositAssets)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text {...numericTextProps}>{fmt(totals?.pendingRedeemShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'middle')} {...borderBottom}>
        <Text {...numericTextProps}>{fmt(totals?.claimableDepositShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps} {...getExpandedCellBorder(expandedPosition, 'last')} {...borderBottom}>
        <Text {...numericTextProps}>{fmt(totals?.claimableRedeemAssets)}</Text>
      </Table.Cell>
    </>
  )
}
