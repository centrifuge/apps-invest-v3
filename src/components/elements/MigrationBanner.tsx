import { Text } from '@chakra-ui/react'
import { InfoPanel } from '@components/elements/InfoPanel'

export function MigrationBanner() {
  return (
    <InfoPanel>
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
    </InfoPanel>
  )
}
