import { useCallback, useState } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { type HexString, type OperationStatus } from '@centrifuge/sdk'
import { useAddress, useBlockchainsMapByCentrifugeId, useCentrifugeTransaction } from '@cfg'
import {
  type BridgeActionType,
  BridgeAction,
  BridgeFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { BridgeForm } from '@components/InvestRedeemSection/BridgeTab/forms/BridgeForm'
import {
  BridgeInProgress,
  type BridgeProgress,
  type BridgeStep,
} from '@components/InvestRedeemSection/BridgeTab/forms/BridgeInProgress'
import { BridgeSuccess, type BridgeSuccessData } from '@components/InvestRedeemSection/BridgeTab/forms/BridgeSuccess'
import { TabProps } from '@components/InvestRedeemSection'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { Form, useForm, addressInput, createBalanceSchema } from '@forms'

function makeSteps(
  statuses: Array<BridgeStep['status']>,
  labels = ['Approving tokens', 'Confirmation on source chain', 'Sending over bridge', 'Minting on destination chain']
): BridgeStep[] {
  return labels.map((label, i) => ({
    label,
    status: statuses[i],
    ...(i === 2 ? { timeEstimate: '±10 - 20 minutes' } : {}),
  }))
}

export function BridgeTab({ isLoading: isTabLoading }: TabProps) {
  const { vaultDetails, isVaultDetailsLoading } = useVaultsContext()
  const { shareClass } = usePoolContext()
  const { address } = useAddress()
  const { executeWithStatus, ensureSigner, isPending } = useCentrifugeTransaction()
  const { data: blockchainsMap } = useBlockchainsMapByCentrifugeId()
  const [actionType, setActionType] = useState<BridgeActionType>(BridgeAction.BRIDGE_FORM)
  const [bridgeProgress, setBridgeProgress] = useState<BridgeProgress | undefined>()
  const [bridgeSuccessData, setBridgeSuccessData] = useState<BridgeSuccessData | undefined>()

  const shareSymbol = vaultDetails?.share.symbol ?? ''

  const schema = z.object({
    fromChain: z.string().min(1, 'Select a source chain'),
    toChain: z.string().min(1, 'Select a destination chain'),
    amount: createBalanceSchema(vaultDetails?.share.decimals ?? 18, { min: 0.0001 }),
    sendToDifferentAddress: z.boolean(),
    recipientAddress: addressInput().or(z.literal('')),
  })

  const handleStatusChange = useCallback((status: OperationStatus, fromExplorer: string | null | undefined) => {
    switch (status.type) {
      case 'SigningTransaction':
        setBridgeProgress({
          steps: makeSteps(['active', 'pending', 'pending', 'pending']),
        })
        break
      case 'TransactionPending':
        setBridgeProgress({
          explorerUrl: fromExplorer ? `${fromExplorer}/tx/${status.hash}` : undefined,
          steps: makeSteps(['completed', 'active', 'pending', 'pending']),
        })
        break
      case 'TransactionConfirmed':
        setBridgeProgress({
          explorerUrl: fromExplorer ? `${fromExplorer}/tx/${status.hash}` : undefined,
          steps: makeSteps(['completed', 'completed', 'active', 'pending']),
        })
        break
    }
  }, [])

  const form = useForm({
    schema,
    defaultValues: BridgeFormDefaultValues,
    mode: 'onChange',
    onSubmit: async (values) => {
      if (!shareClass?.shareClass || !address) return

      const receiver = (
        values.sendToDifferentAddress && values.recipientAddress ? values.recipientAddress : address
      ) as HexString

      const fromId = Number(values.fromChain)
      const toId = Number(values.toChain)
      const fromChainName = blockchainsMap?.get(fromId)?.name ?? 'Source'
      const toChainName = blockchainsMap?.get(toId)?.name ?? 'Destination'
      const fromExplorer = blockchainsMap?.get(fromId)?.explorer

      // Set signer on the entity's own Centrifuge instance — it may differ from
      // the context instance if the SDK was recreated (e.g. environment switch)
      // while React Query still holds entities from the previous instance.
      const signer = ensureSigner()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(shareClass.shareClass as any)._root?.setSigner?.(signer)

      const tx = shareClass.shareClass.crosschainTransferShares(fromId, toId, receiver, values.amount.toBigInt())

      setBridgeProgress({ steps: makeSteps(['active', 'pending', 'pending', 'pending']) })
      setActionType(BridgeAction.IN_PROGRESS)

      try {
        const result = await executeWithStatus(tx, {
          onStatusChange: (status) => handleStatusChange(status, fromExplorer),
        })

        setBridgeSuccessData({
          asset: shareSymbol,
          assetAmount: `${values.amount.toDecimal()} ${shareSymbol}`,
          fromChainName,
          toChainName,
          recipientAddress: receiver,
          sourceTx: result.hash
            ? {
                chainName: fromChainName,
                hash: result.hash,
                explorerUrl: fromExplorer ? `${fromExplorer}/tx/${result.hash}` : '#',
              }
            : undefined,
        })
        setActionType(BridgeAction.SUCCESS)
      } catch {
        form.reset()
        setBridgeProgress(undefined)
        setActionType(BridgeAction.BRIDGE_FORM)
      }
    },
    onSubmitError: (error) => console.error('Bridge form submission error:', error),
  })

  const isLoading = isTabLoading || isVaultDetailsLoading
  const isDisabled = isPending || !vaultDetails || !shareClass?.shareClass

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
        {actionType === BridgeAction.IN_PROGRESS && (
          <BridgeInProgress setActionType={setActionType} progress={bridgeProgress} />
        )}
        {actionType === BridgeAction.SUCCESS && (
          <BridgeSuccess setActionType={setActionType} data={bridgeSuccessData} />
        )}
      </Box>
    </Form>
  )
}
