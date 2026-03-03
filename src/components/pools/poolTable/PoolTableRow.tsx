import { MdBrokenImage } from 'react-icons/md'
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'
import { formatBalance, ipfsToHttp, type FormattableBalance } from '@cfg'
import { Badge, Flex, Icon, Image, Table, Text } from '@chakra-ui/react'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
import { Tooltip } from '@ui'
import type { ActiveTab, PoolInvestmentTotals, PoolRow } from './types'
import { POOL_TABLE_TABS } from './types'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

interface PoolTableRowProps {
  poolRow: PoolRow
  isExpanded: boolean
  onToggle: () => void
  onClick: () => void
  activeTab: ActiveTab
  investmentTotals?: PoolInvestmentTotals
}

export function PoolTableRow({
  poolRow,
  isExpanded,
  onToggle,
  onClick,
  activeTab,
  investmentTotals,
}: PoolTableRowProps) {
  const isExpandable = poolRow.vaults.length > 1
  const poolType = poolRow.poolDetails.metadata?.pool?.asset.class ?? ''

  const handleClick = () => {
    if (isExpandable) {
      onToggle()
    } else {
      onClick()
    }
  }

  return (
    <Table.Row
      onClick={handleClick}
      cursor="pointer"
      _hover={{ bg: 'bg.subtle' }}
      transition="background 150ms"
      css={isExpanded ? { '& td': { borderBottomWidth: 0 } } : undefined}
    >
      <Table.Cell>
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
              border="1px solid"
              borderColor="border.solid"
              bg="white"
            />
          ) : (
            <Icon size="md" color="fg.muted" flexShrink={0}>
              <MdBrokenImage />
            </Icon>
          )}
          <Tooltip content={poolRow.poolName}>
            <Text fontSize="sm" fontWeight={500} lineClamp={1}>
              {poolRow.poolName}
            </Text>
          </Tooltip>
        </Flex>
      </Table.Cell>

      <Table.Cell textAlign="center">
        {poolType ? (
          <Badge size="sm" variant="solid" colorPalette="yellow">
            {poolType}
          </Badge>
        ) : null}
      </Table.Cell>

      {activeTab === POOL_TABLE_TABS.access ? (
        <AccessPoolCells investmentTotals={investmentTotals} />
      ) : (
        <FundsPoolCells poolRow={poolRow} />
      )}
    </Table.Row>
  )
}

const numericCellProps = { textAlign: 'right' as const }
const numericTextProps = { fontSize: 'xs' as const, fontVariantNumeric: 'tabular-nums' as const }

function FundsPoolCells({ poolRow }: { poolRow: PoolRow }) {
  return (
    <>
      <Table.Cell textAlign="center">
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

      <Table.Cell textAlign="right">
        {poolRow.isRestricted ? (
          <InvestorsOnlyValueBlock />
        ) : (
          <Text fontSize="sm" fontVariantNumeric="tabular-nums">
            {poolRow.tvl}
          </Text>
        )}
      </Table.Cell>

      <Table.Cell>
        <Tooltip content={poolRow.assetType}>
          <Text fontSize="xs" lineClamp={1}>
            {poolRow.assetType}
          </Text>
        </Tooltip>
      </Table.Cell>

      <Table.Cell>
        <Tooltip content={poolRow.investorType}>
          <Text fontSize="xs" lineClamp={1}>
            {poolRow.investorType}
          </Text>
        </Tooltip>
      </Table.Cell>

      <Table.Cell textAlign="right">
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {poolRow.minInvestment}
        </Text>
      </Table.Cell>
    </>
  )
}

function AccessPoolCells({ investmentTotals }: { investmentTotals?: PoolInvestmentTotals }) {
  const totals = investmentTotals ?? null

  const fmt = (value: FormattableBalance | undefined) => formatBalance(value, { precision: 2 })

  return (
    <>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(totals?.assetBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(totals?.shareBalance)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(totals?.pendingDepositAssets)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(totals?.pendingRedeemShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(totals?.claimableDepositShares)}</Text>
      </Table.Cell>
      <Table.Cell {...numericCellProps}>
        <Text {...numericTextProps}>{fmt(totals?.claimableRedeemAssets)}</Text>
      </Table.Cell>
    </>
  )
}
