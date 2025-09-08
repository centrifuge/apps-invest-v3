import { type Dispatch, type SetStateAction } from 'react'
import type { Balance } from '@centrifuge/sdk'
import { type InvestActionType, InvestAction } from '@components/InvestRedeemSection/components/defaults'
import { InvestAmount } from '@components/InvestRedeemSection/InvestTab/forms/InvestAmount'
// import { InvestRequirements } from '@components/InvestRedeemSection/InvestTab/forms/InvestRequirements'
import { InvestTxFeedback } from '@components/InvestRedeemSection/InvestTab/forms/InvestTxFeedback'

interface InvestTabFormProps {
  actionType: InvestActionType
  isDisabled: boolean
  formattedMaxInvestAmount: string
  maxInvestAmount: string
  parsedInvestAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<InvestActionType>>
  onSubmit: () => void
}

export function InvestTabForm({
  actionType,
  isDisabled,
  formattedMaxInvestAmount,
  maxInvestAmount,
  parsedInvestAmount,
  parsedReceiveAmount,
  setActionType,
  onSubmit,
}: InvestTabFormProps) {
  switch (actionType) {
    case InvestAction.INVEST_AMOUNT:
      return (
        <InvestAmount
          formattedMaxInvestAmount={formattedMaxInvestAmount}
          maxInvestAmount={maxInvestAmount}
          parsedInvestAmount={parsedInvestAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          isDisabled={isDisabled}
          onSubmit={onSubmit}
        />
      )
    // TODO: add this for sync invest form
    // case InvestAction.INVESTOR_REQUIREMENTS:
    //   return <InvestRequirements />
    case InvestAction.CONFIRM:
      return (
        <InvestTxFeedback
          parsedInvestAmount={parsedInvestAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          setActionType={setActionType}
        />
      )
  }
}
