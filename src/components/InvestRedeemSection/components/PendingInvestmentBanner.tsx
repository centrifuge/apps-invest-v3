import { IoMdTimer } from 'react-icons/io'
import { Balance } from '@centrifuge/sdk'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { BalanceDisplay } from '@ui'

interface PendingInvestmentBannerProps {
  label: string
  amount: Balance
  currencySymbol?: string
}

export function PendingInvestmentBanner({ label, amount, currencySymbol }: PendingInvestmentBannerProps) {
  return (
    <Box border="1px solid" borderColor="border.dark" borderRadius="12px" p={4} mb={4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" justifyContent="flex-start">
          <Icon size="sm" mr={2} mt={1}>
            <IoMdTimer color="fg.subtle" />
          </Icon>
          <Text fontSize="sm">{label}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <BalanceDisplay balance={amount} fontSize="md" fontWeight={600} />
          <Text fontSize="md" fontWeight={600} ml={2}>
            {currencySymbol}
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
