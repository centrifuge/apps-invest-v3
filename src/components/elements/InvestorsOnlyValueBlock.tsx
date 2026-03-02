import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { IconInfo } from '@ui'

export function InvestorsOnlyValueBlock() {
  return (
    <Badge size="sm" variant="solid" px={2} py={1}>
      <Flex alignItems="center" justifyContent="flex-start">
        <IconInfo size={16} color="#414651" />
        <Text color="fg.info" fontSize="sm" fontWeight={400} ml={1} strokeWidth="2">
          Investors only
        </Text>
      </Flex>
    </Badge>
  )
}
