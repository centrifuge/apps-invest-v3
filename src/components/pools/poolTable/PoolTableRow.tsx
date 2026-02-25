import { MdBrokenImage } from 'react-icons/md'
import { Badge, Flex, Icon, Image, Table, Text } from '@chakra-ui/react'
import { ipfsToHttp } from '@cfg'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'
import type { PoolRow } from './types'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

interface PoolTableRowProps {
  poolRow: PoolRow
  isExpanded: boolean
  onToggle: () => void
  onClick: () => void
}

export function PoolTableRow({ poolRow, isExpanded, onToggle, onClick }: PoolTableRowProps) {
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
    <Table.Row onClick={handleClick} cursor="pointer" _hover={{ bg: 'bg.subtle' }} transition="background 150ms">
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

      <Table.Cell textAlign="center">
        {poolType ? (
          <Badge size="sm" variant="subtle" colorPalette="gray">
            {poolType}
          </Badge>
        ) : null}
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

      <Table.Cell>
        <Text fontSize="sm">{poolRow.assetType}</Text>
      </Table.Cell>

      <Table.Cell>
        <Text fontSize="sm">{poolRow.investorType}</Text>
      </Table.Cell>

      <Table.Cell textAlign="right">
        <Text fontSize="sm" fontVariantNumeric="tabular-nums">
          {poolRow.minInvestment}
        </Text>
      </Table.Cell>
    </Table.Row>
  )
}
