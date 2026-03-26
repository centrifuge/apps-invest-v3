import { Flex, Text } from '@chakra-ui/react'

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justifyContent="space-between" alignItems="center" mb={1.5}>
      <Text fontSize="sm" color="fg.muted">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight={500}>
        {value}
      </Text>
    </Flex>
  )
}
