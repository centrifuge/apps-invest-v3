import { useMemo, type Dispatch, type SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'
import { RedeemTxFeedback } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTxFeedback'
import { useVaultsContext } from '@contexts/VaultsContext'
import { usePoolContext } from '@contexts/PoolContext'
// import { RedeemTxCancelled } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTxCancelled'

interface RedeemTabFormProps {
  actionType: RedeemActionType
  isDisabled: boolean
  maxRedeemAmount: string
  parsedRedeemAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTabForm({
  actionType,
  isDisabled,
  maxRedeemAmount,
  parsedRedeemAmount,
  parsedReceiveAmount,
  setActionType,
}: RedeemTabFormProps) {
  const { networks } = usePoolContext()
  const { investment } = useVaultsContext()
  const redeemCurrencySymbol = investment?.share.symbol ?? ''
  const receiveCurrencySymbol = investment?.asset.symbol ?? ''

  const currencies = useMemo(
    () => ({
      redeemCurrency: redeemCurrencySymbol,
      receiveCurrency: receiveCurrencySymbol,
    }),
    [redeemCurrencySymbol, receiveCurrencySymbol]
  )

  switch (actionType) {
    case RedeemAction.REDEEM_AMOUNT:
      return (
        <RedeemAmount
          isDisabled={isDisabled}
          maxRedeemAmount={maxRedeemAmount}
          networks={networks}
          parsedRedeemAmount={parsedRedeemAmount}
          parsedReceiveAmount={parsedReceiveAmount}
        />
      )
    case RedeemAction.CONFIRM:
      return (
        <RedeemTxFeedback
          currencies={currencies}
          isDisabled={isDisabled}
          parsedRedeemAmount={parsedRedeemAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          setActionType={setActionType}
        />
      )
    // TODO: add step when adding sync redeem
    // case RedeemAction.CANCEL:
    //   return <RedeemTxCancelled currencies={currencies} setActionType={setActionType} />
  }
}
