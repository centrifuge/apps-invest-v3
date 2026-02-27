import type { Dispatch, SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type RedeemActionType, RedeemAction } from '@components/InvestRedeemSection/components/defaults'
import { RedeemAmount } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemAmount'
import { RedeemTxFeedback } from '@components/InvestRedeemSection/RedeemTab/forms/RedeemTxFeedback'
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
  switch (actionType) {
    case RedeemAction.REDEEM_AMOUNT:
      return (
        <RedeemAmount
          isDisabled={isDisabled}
          maxRedeemAmount={maxRedeemAmount}
          parsedRedeemAmount={parsedRedeemAmount}
          parsedReceiveAmount={parsedReceiveAmount}
        />
      )
    case RedeemAction.CONFIRM:
      return (
        <RedeemTxFeedback
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
