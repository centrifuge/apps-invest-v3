import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { createBalanceSchema, createBalanceValidation, Form, safeParse, useForm } from '@forms'
import { Balance } from '@centrifuge/sdk'
import { formatBalanceToString, useCentrifugeTransaction } from '@cfg'
import {
  RedeemAction,
  RedeemFormDefaultValues,
  type RedeemActionType,
} from '@components/InvestRedeemSection/components/defaults'
import { TabProps } from '@components/InvestRedeemSection'
import { RedeemTabForm } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTabForm'
import { useVaultsContext } from '@contexts/VaultsContext'

export function RedeemTab({ isLoading: isTabLoading, vault }: TabProps) {
  const { isInvestmentLoading, isVaultDetailsLoading, investment, vaultDetails } = useVaultsContext()
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<RedeemActionType>(RedeemAction.REDEEM_AMOUNT)
  const maxRedeemBalance = investment?.shareBalance ?? 0

  const maxRedeemAmount = useMemo(() => {
    if (maxRedeemBalance === 0) return ''
    // Don't pass precision parameter to preserve full decimal precision for validation
    return formatBalanceToString(maxRedeemBalance) ?? ''
  }, [maxRedeemBalance])

  function redeem(amount: Balance) {
    execute(vault.increaseRedeemOrder(amount))
  }

  const schema = z.object({
    redeemAmount: createBalanceSchema(
      investment?.shareBalance.decimals ?? 18,
      createBalanceValidation({ min: 1, max: maxRedeemAmount }, investment?.shareBalance.decimals ?? 18)
    ),
    receiveAmount: createBalanceSchema(vaultDetails?.investmentCurrency.decimals ?? 6).optional(),
  })

  const form = useForm({
    schema,
    defaultValues: RedeemFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      redeem(values.redeemAmount)
      setActionType(RedeemAction.CONFIRM)
    },
    onSubmitError: (error) => console.error('Redeem form submission error:', error),
  })

  const { watch } = form
  const [redeemAmount, receiveAmount] = watch(['redeemAmount', 'receiveAmount'])

  const parsedRedeemAmount = useMemo(
    () => safeParse(schema.shape.redeemAmount, redeemAmount) ?? 0,
    [redeemAmount, schema.shape.redeemAmount]
  )
  const parsedReceiveAmount = useMemo(
    () => safeParse(schema.shape.receiveAmount, receiveAmount) ?? 0,
    [receiveAmount, schema.shape.receiveAmount]
  )
  const isDisabled = isPending || !vaultDetails || !investment || parsedRedeemAmount === 0
  const isLoading = isTabLoading || isVaultDetailsLoading || isInvestmentLoading

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
        <RedeemTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          maxRedeemAmount={maxRedeemAmount}
          parsedRedeemAmount={parsedRedeemAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          setActionType={setActionType}
        />
      </Box>
    </Form>
  )
}
