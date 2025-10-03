import { IoMdTimer } from 'react-icons/io'
import { Box, Flex, Grid, Heading, Icon, Spinner, Text } from '@chakra-ui/react'
import { BalanceDisplay } from '@ui'
import { TabProps } from '@components/InvestRedeemSection'
import { useGetPendingInvestments } from '@components/InvestRedeemSection/hooks/useGetPendingInvestments'

export function PendingTab({ isLoading: isTabLoading }: TabProps) {
  const {
    investment,
    investmentCurrency,
    pendingInvestCurrency,
    shareCurrency,
    pendingRedeemShares,
    calculatedInvestSharesEstimate,
    calculatedRedeemAmountEstimate,
  } = useGetPendingInvestments()

  if (isTabLoading) {
    return (
      <Box height="182px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="black.solid" />
      </Box>
    )
  }

  if ((!investment || (!calculatedInvestSharesEstimate && !calculatedRedeemAmountEstimate)) && !isTabLoading) {
    return (
      <Box height="100%" minH="182px">
        <Heading fontSize="lg" mt={2}>
          No pending transactions found.
        </Heading>
      </Box>
    )
  }

  return (
    <Box p={2} mt={2} height="100%">
      <Flex alignItems="center" gap={2} justifyContent="space-between" mb={8}>
        <Heading size="xl">Pending transactions</Heading>
        <Icon size="lg">
          <IoMdTimer color="fg.muted" />
        </Icon>
      </Flex>

      <Text fontSize="md">Investments</Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text fontSize="sm" mt={2} fontWeight="bold">
            {investmentCurrency?.symbol}
          </Text>
          <BalanceDisplay balance={pendingInvestCurrency} fontSize="sm" />
        </Box>
        <Box textAlign={'right'}>
          <Text fontSize="sm" fontWeight="bold">
            Est. {shareCurrency?.symbol}
          </Text>
          <Text fontSize="sm" mt={2}>
            {calculatedInvestSharesEstimate ?? '0.00'}
          </Text>
        </Box>
      </Grid>

      <Text fontSize="md" mt={8}>
        Redemptions
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text fontSize="sm" mt={2} fontWeight="bold">
            {shareCurrency?.symbol}
          </Text>
          <BalanceDisplay balance={pendingRedeemShares} fontSize="sm" />
        </Box>
        <Box textAlign={'right'}>
          <Text fontSize="sm" fontWeight="bold">
            Est. {investmentCurrency?.symbol}
          </Text>
          <Text fontSize="sm" mt={2}>
            {calculatedRedeemAmountEstimate ?? '0.00'}
          </Text>
        </Box>
      </Grid>
    </Box>
  )
}
