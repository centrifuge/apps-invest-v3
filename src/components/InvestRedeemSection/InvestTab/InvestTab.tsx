import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema } from '@forms'
import { Balance } from '@centrifuge/sdk'
import { formatBalance, formatBalanceToString, useCentrifugeTransaction } from '@cfg'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'
import { TabProps } from '@components/InvestRedeemSection'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'
import { useVaultsContext } from '@contexts/VaultsContext'

export function InvestTab({ isLoading: isTabLoading, vault }: TabProps) {
  const { vaultDetails, investment, isVaultDetailsLoading, isInvestmentLoading } = useVaultsContext()
  const { portfolioBalance, isPortfolioLoading } = useGetPortfolioDetails(vaultDetails)
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  const maxInvestAmount = useMemo(() => {
    if (!portfolioBalance) return '0'
    // Don't pass precision parameter to preserve full decimal precision for validation
    return formatBalanceToString(portfolioBalance)
  }, [portfolioBalance])

  const formattedMaxInvestAmount = useMemo(() => {
    if (!portfolioBalance) return '0'
    return formatBalance(portfolioBalance, investment?.asset.symbol, 0) ?? '0'
  }, [portfolioBalance])

  function invest(amount: Balance) {
    if (investment?.isSyncDeposit) {
      execute(vault.syncDeposit(amount))
    } else {
      execute(vault.asyncDeposit(amount))
    }
  }

  const investCurrencyDecimals = vaultDetails?.asset.decimals ?? 18

  const schema = z.object({
    investAmount: createBalanceSchema(investCurrencyDecimals, {
      min: new Balance(1n, investCurrencyDecimals),
      max: portfolioBalance,
    }),
    receiveAmount: createBalanceSchema(vaultDetails?.share.decimals ?? 18).optional(),
  })

  const form = useForm({
    schema,
    defaultValues: InvestFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      invest(values.investAmount)
      setActionType(InvestAction.CONFIRM)
    },
    onSubmitError: (error) => console.error('Invest form submission error:', error),
  })

  const { watch } = form
  const [investAmount, receiveAmount] = watch(['investAmount', 'receiveAmount'])

  const parsedInvestAmount = useMemo(
    () => safeParse(schema.shape.investAmount, investAmount) ?? 0,
    [investAmount, schema.shape.investAmount]
  )

  const parsedReceiveAmount = useMemo(
    () => safeParse(schema.shape.receiveAmount, receiveAmount) ?? 0,
    [receiveAmount, schema.shape.receiveAmount]
  )

  const isLoading = isTabLoading || isVaultDetailsLoading || isInvestmentLoading || isPortfolioLoading
  const isDisabled = isPending || !investment || !vaultDetails

  if (isLoading) {
    return (
      <Box height="182px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="fg.solid" />
      </Box>
    )
  }

  return (
    <Form form={form} style={{ height: '100%' }}>
      <Box mt={4} height="100%">
        <InvestTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          formattedMaxInvestAmount={formattedMaxInvestAmount}
          maxInvestAmount={maxInvestAmount}
          parsedInvestAmount={parsedInvestAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          setActionType={setActionType}
        />
      </Box>
    </Form>
  )
}
