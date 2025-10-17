import { Box, Flex, Text } from '@chakra-ui/react'
import { IconInfo } from '@ui'

export function InvestorsOnlyValueBlock() {
  return (
    <Box bgColor="gray.300" borderRadius="6px" px={2} py={1}>
      <Flex alignItems="center" justifyContent="flex-start">
        <IconInfo size={16} color="#717680" />
        <Text color="gray.600" fontSize="sm" fontWeight={400} ml={1} strokeWidth="2">
          Investors only
        </Text>
      </Flex>
    </Box>
  )
}
