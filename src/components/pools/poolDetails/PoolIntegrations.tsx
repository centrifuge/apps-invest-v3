import { LuExternalLink } from 'react-icons/lu'
import { Flex, Heading, Icon, Image, Link, Text } from '@chakra-ui/react'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPoolsByIds, type PoolIntegration } from '@hooks/useGetPoolsByIds'
import { type ColumnDefinition, DataTable, NetworkIcon } from '@ui'
import { useBlockchainsMapByChainId } from '@cfg'

type IntegrationRow = PoolIntegration & { id: number }

export function PoolIntegrations() {
  const { poolId } = usePoolContext()
  const { getPoolIntegrations } = useGetPoolsByIds()
  const integrations = getPoolIntegrations(poolId)
  const { data: blockchains } = useBlockchainsMapByChainId()

  if (integrations.length === 0) return null

  const rows: IntegrationRow[] = integrations.map((integration, i) => ({ ...integration, id: i }))

  const columns: ColumnDefinition<IntegrationRow>[] = [
    {
      header: 'Asset',
      width: '40%',
      render: (row) => (
        <Flex alignItems="center" gap={2}>
          <Image src={row.icon} alt={row.name} height="20px" width="20px" borderRadius="4px" flexShrink={0} />
          <Text fontSize="sm" fontWeight={500}>
            {row.name}
          </Text>
        </Flex>
      ),
    },
    {
      header: 'Network',
      width: '26%',
      render: (row) => (
        <Flex gap={2} flexWrap="wrap" alignItems="center">
          {row.chainIds?.map((chainId) => {
            const centrifugeId = blockchains?.get(chainId)?.centrifugeId
            return (
              <NetworkIcon
                key={chainId}
                centrifugeId={centrifugeId}
                chainId={chainId}
                withLabel
                fontSize="sm"
                fontWeight={500}
                boxSize="20px"
              />
            )
          })}
        </Flex>
      ),
    },
    {
      header: 'Type',
      width: '22%',
      render: (row) => (
        <Text fontSize="sm" fontWeight={500}>
          {row.type}
        </Text>
      ),
    },
    {
      header: '',
      width: '12%',
      textAlign: 'end',
      render: (row) => (
        <Link href={row.url} target="_blank" rel="noopener noreferrer" color="fg.muted" _hover={{ color: 'fg.solid' }}>
          <Icon size="sm">
            <LuExternalLink />
          </Icon>
        </Link>
      ),
    },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Integrations
      </Heading>
      <DataTable columns={columns} data={rows} pageSize={10} skeletonRowNumber={3} />
    </>
  )
}
