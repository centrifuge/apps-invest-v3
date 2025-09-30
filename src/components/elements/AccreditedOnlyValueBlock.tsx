import { Box, Flex, Text } from '@chakra-ui/react'
import { IconInfo } from '@ui'

export function AccreditedOnlyValueBlock() {
  return (
    <Box bgColor="gray.400" borderRadius="6px" px={2} py={1}>
      <Flex alignItems="center" justifyContent="flex-start">
        <IconInfo size={16} color="#717680" />
        <Text color="gray.700" fontSize="sm" fontWeight={400} ml={1} strokeWidth="2">
          Accredited only
        </Text>
      </Flex>
    </Box>
  )
}
