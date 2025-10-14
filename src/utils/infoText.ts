export const infoText = (currency?: string) => ({
  redeem: `This is a freely transferable token. Redeeming requires the KYC. Click here to KYC with Entity.\
    Alternatively, you can redeem on Uniswap and other secondary markets.`,
  asyncRedeem:
    'Redeeming token happens asynchronously and can take up to 24hrs to reflect on the network. You may close this window.',
  portfolioMissingInvestmentCurrency: `You do not hold any of the currency needed for investing in this fund. Please purchase some ${currency} to invest.`,
  investClaimable: 'Investment happens asynchronously and can take up to 24hrs to process. You may close this window.',
  investFailed: 'Sorry, the investment transaction failed or reverted. Please try again later.',
  redeemFailed: 'Sorry, the redeem transaction failed or reverted. Please try again later.',
})
