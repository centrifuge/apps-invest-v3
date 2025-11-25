import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema, createBalanceValidation } from '@forms'
import { Balance } from '@centrifuge/sdk'
import { formatBalance, formatBalanceToString, useCentrifugeTransaction, useInvestment, useVaultDetails } from '@cfg'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'
import { TabProps } from '@components/InvestRedeemSection'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'

export function InvestTab({ isLoading: isTabLoading, vault }: TabProps) {
  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault)
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault)
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
    return formatBalance(portfolioBalance, investment?.investmentCurrency.symbol, 0) ?? '0'
  }, [portfolioBalance])

  function invest(amount: Balance) {
    execute(vault.increaseInvestOrder(amount))
  }

  const schema = z.object({
    investAmount: createBalanceSchema(
      vaultDetails?.investmentCurrency.decimals ?? 18,
      createBalanceValidation({ min: 1, max: maxInvestAmount }, vaultDetails?.investmentCurrency.decimals ?? 18)
    ),
    receiveAmount: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18).optional(),
    // TODO: Use these when we need to add the sync invest action
    // requirement_nonUsCitizen: z.boolean().refine((val) => val === true, {
    //   message: 'Non-US citizen requirement must be confirmed',
    // }),
    // requirement_nonSanctionedList: z.boolean().refine((val) => val === true, {
    //   message: 'Non-sanctioned list requirement must be confirmed',
    // }),
    // requirement_redeemLater: z.boolean().refine((val) => val === true, {
    //   message: 'Redeem later requirement must be confirmed',
    // }),
    // investorRequirements: z.array(z.boolean()).length(3, 'Array must contain exactly 3 requirements'),
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
