import { Box, Heading, Text } from '@chakra-ui/react'
import { PoolId } from '@centrifuge/sdk'
import { Card } from '@ui'
import { PoolTable } from './PoolTable'
import type { PoolRow } from './types'

interface PoolTableSectionProps {
  heading: string
  subtitle?: string
  poolRows: PoolRow[]
  setSelectedPoolId: (poolId: PoolId) => void
  isLoading?: boolean
}

export function PoolTableSection({ heading, subtitle, poolRows, setSelectedPoolId, isLoading }: PoolTableSectionProps) {
  if (!isLoading && poolRows.length === 0) {
    return (
      <Box mb={8}>
        <Heading as="h3" size="md" mb={1}>
          {heading}
        </Heading>
        {subtitle && (
          <Text fontSize="sm" color="fg.muted" mb={4}>
            {subtitle}
          </Text>
        )}
        <Card>
          <Text fontSize="md">There are currently no {heading.toLowerCase()} funds to display.</Text>
        </Card>
      </Box>
    )
  }

  return (
    <Box mb={8}>
      <Heading as="h3" size="md" mb={1}>
        {heading}
      </Heading>
      {subtitle && (
        <Text fontSize="sm" color="fg.muted" mb={4}>
          {subtitle}
        </Text>
      )}
      <PoolTable poolRows={poolRows} setSelectedPoolId={setSelectedPoolId} isLoading={isLoading} />
    </Box>
  )
}
