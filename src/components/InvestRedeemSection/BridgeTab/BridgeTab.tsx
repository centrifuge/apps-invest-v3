import { useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { type HexString } from '@centrifuge/sdk'
import { useAddress, useCentrifugeTransaction } from '@cfg'
import {
  type BridgeActionType,
  BridgeAction,
  BridgeFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { BridgeForm } from '@components/InvestRedeemSection/BridgeTab/forms/BridgeForm'
import { BridgeInProgress } from '@components/InvestRedeemSection/BridgeTab/forms/BridgeInProgress'
import { BridgeSuccess } from '@components/InvestRedeemSection/BridgeTab/forms/BridgeSuccess'
import { TabProps } from '@components/InvestRedeemSection'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { Form, useForm, addressInput, createBalanceSchema } from '@forms'

export function BridgeTab({ isLoading: isTabLoading }: TabProps) {
  const { vaultDetails, investment, isVaultDetailsLoading, isInvestmentLoading } = useVaultsContext()
  const { shareClass } = usePoolContext()
  const { address } = useAddress()
  const { execute, isPending } = useCentrifugeTransaction()
  const [actionType, setActionType] = useState<BridgeActionType>(BridgeAction.BRIDGE_FORM)

  const schema = z.object({
    fromChain: z.string().min(1, 'Select a source chain'),
    toChain: z.string().min(1, 'Select a destination chain'),
    amount: createBalanceSchema(vaultDetails?.share.decimals ?? 18, { min: 1 }),
    sendToDifferentAddress: z.boolean(),
    recipientAddress: addressInput(),
  })

  const form = useForm({
    schema,
    defaultValues: BridgeFormDefaultValues,
    mode: 'onChange',
    onSubmit: (values) => {
      if (!shareClass?.shareClass || !address) return

      const receiver = (values.sendToDifferentAddress && values.recipientAddress
        ? values.recipientAddress
        : address) as HexString

      const tx = shareClass.shareClass.crosschainTransferShares(
        Number(values.fromChain),
        Number(values.toChain),
        receiver,
        values.amount.toBigInt()
      )

      execute(tx)
      setActionType(BridgeAction.IN_PROGRESS)
    },
    onSubmitError: (error) => console.error('Bridge form submission error:', error),
  })

  const isLoading = isTabLoading || isVaultDetailsLoading || isInvestmentLoading
  const isDisabled = isPending || !investment || !vaultDetails || !shareClass?.shareClass

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
        {actionType === BridgeAction.BRIDGE_FORM && (
          <BridgeForm isDisabled={isDisabled} setActionType={setActionType} />
        )}
        {actionType === BridgeAction.IN_PROGRESS && <BridgeInProgress setActionType={setActionType} />}
        {actionType === BridgeAction.SUCCESS && <BridgeSuccess setActionType={setActionType} />}
      </Box>
    </Form>
  )
}
