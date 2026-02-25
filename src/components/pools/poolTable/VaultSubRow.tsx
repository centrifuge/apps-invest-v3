import { Badge, Flex, Table, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { NetworkIcon } from '@ui'
import { getVaultPath } from '@routes/routePaths'
import { useNavigate } from 'react-router-dom'
import type { VaultRow } from './types'

interface VaultSubRowProps {
  vaultRow: VaultRow
  poolId: string
  setSelectedPoolId: (poolId: PoolId) => void
  poolDetails: { id: PoolId }
}

export function VaultSubRow({ vaultRow, poolId, setSelectedPoolId, poolDetails }: VaultSubRowProps) {
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
            {vaultRow.networkName
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')}
          </Text>
          <Badge colorPalette="yellow" size="sm" fontWeight={700} color="yellow.emphasized">
            {assetSymbol}
          </Badge>
        </Flex>
      </Table.Cell>

      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
    </Table.Row>
  )
}
