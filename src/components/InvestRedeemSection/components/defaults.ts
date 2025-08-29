export const InvestSyncAction = {
  INVEST_AMOUNT: 'INVEST_AMOUNT',
  INVESTOR_REQUIREMENTS: 'INVESTOR_REQUIREMENTS',
  CONFIRM: 'CONFIRM',
} as const

export type InvestSyncActionType = (typeof InvestAction)[keyof typeof InvestAction]

export const InvestSyncFormDefaultValues = {
  investAmount: '',
  receiveAmount: '0',
  investorRequirements: [false, false, false],
}

export const InvestAction = {
  INVEST_AMOUNT: 'INVEST_AMOUNT',
  CONFIRM: 'CONFIRM',
} as const

export type InvestActionType = (typeof InvestAction)[keyof typeof InvestAction]

export const InvestFormDefaultValues = {
  investAmount: '',
  receiveAmount: '0',
}

export const RedeemSyncAction = {
  REDEEM_AMOUNT: 'REDEEM_AMOUNT',
  CANCEL: 'CANCEL',
  CONFIRM: 'CONFIRM',
} as const

export type RedeemSyncActionType = (typeof RedeemAction)[keyof typeof RedeemAction]

export const RedeemSyncFormDefaultValues = {
  redeemAmount: '',
  receiveAmount: '0',
}

export const RedeemAction = {
  REDEEM_AMOUNT: 'REDEEM_AMOUNT',
  CONFIRM: 'CONFIRM',
} as const

export type RedeemActionType = (typeof RedeemAction)[keyof typeof RedeemAction]

export const RedeemFormDefaultValues = {
  redeemAmount: '',
  receiveAmount: '0',
}
