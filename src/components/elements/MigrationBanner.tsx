import { Text } from '@chakra-ui/react'
import { Panel } from '@components/elements/Panel'

export function MigrationBanner() {
  return (
    <Panel>
      <Text fontWeight={600} fontSize="sm">
        Haven't migrated your CFG yet?{' '}
        <a
          href="https://migrate.centrifuge.io"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          Migrate here now.
        </a>
      </Text>
    </Panel>
  )
}
