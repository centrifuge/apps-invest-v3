import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema } from '@forms'
import type { Balance } from '@centrifuge/sdk'
import { formatBalance, useCentrifugeTransaction } from '@cfg'
import { useQueryClient } from '@tanstack/react-query'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'
import { TabProps } from '@components/InvestRedeemSection'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'
import { useVaultsContext } from '@contexts/VaultsContext'
import { balanceToString } from '@utils/balance'

export function InvestTab({ isLoading: isTabLoading, vault }: TabProps) {
  const { vaultDetails, investment, isVaultDetailsLoading, isInvestmentLoading } = useVaultsContext()
  const { portfolioBalance, isPortfolioLoading } = useGetPortfolioDetails(vaultDetails)
  const { execute, isPending } = useCentrifugeTransaction()
  const queryClient = useQueryClient()
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  const maxInvestAmount = useMemo(() => {
    if (!portfolioBalance) return '0'
    return balanceToString(portfolioBalance)
  }, [portfolioBalance])

  const formattedMaxInvestAmount = useMemo(() => {
    if (!portfolioBalance) return '0'
    return formatBalance(portfolioBalance, investment?.asset.symbol, 0)
  }, [portfolioBalance])

  function invest(amount: Balance) {
    const tx = investment?.isSyncDeposit ? vault.syncDeposit(amount) : vault.asyncDeposit(amount)
    execute(tx).then(() => {
      queryClient.invalidateQueries({ queryKey: ['poolsAccessStatus'] })
    })
  }

  const schema = z.object({
    investAmount: createBalanceSchema(vaultDetails?.asset.decimals ?? 18, {
      min: 1,
      max: maxInvestAmount,
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
