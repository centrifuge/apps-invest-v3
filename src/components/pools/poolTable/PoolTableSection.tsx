import { Box, Text } from '@chakra-ui/react'
import { Card } from '@ui'
import { PoolTable } from './PoolTable'
import type { ActiveTab, PoolRow } from './types'

interface PoolTableSectionProps {
  activeTab: ActiveTab
  isLoading?: boolean
  poolRows: PoolRow[]
  heading?: string
  subtitle?: string
}

export function PoolTableSection({ heading, subtitle, poolRows, isLoading, activeTab }: PoolTableSectionProps) {
  if (!isLoading && poolRows.length === 0) {
    return (
      <Box mb={12}>
        {sectionHeader({ heading, subtitle })}
        <Card>
          <Text fontSize="md">There are currently no funds to display.</Text>
        </Card>
      </Box>
    )
  }

  return (
    <Box mb={12}>
      {sectionHeader({ heading, subtitle })}
      <PoolTable poolRows={poolRows} isLoading={isLoading} activeTab={activeTab} />
    </Box>
  )
}

function sectionHeader({ heading, subtitle }: { heading?: string; subtitle?: string }) {
  if (!heading) return null

  return (
    <>
      <Text fontSize="md" fontWeight={600} color="fg.solid" mb={1} px={2}>
        {heading}
      </Text>
      {subtitle && (
        <Text fontSize="sm" fontWeight={500} color="fg.muted" mb={6} px={2}>
          {subtitle}
        </Text>
      )}
    </>
  )
}
