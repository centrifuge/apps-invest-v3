import { usePortfolio, VaultDetails } from '@cfg'

export function useGetPortfolioDetails(vaultDetails?: VaultDetails) {
  const { data: portfolio, isLoading: isPortfolioLoading } = usePortfolio()

  const investmentCurrencyAddress = vaultDetails?.asset?.address
  const portfolioInvestmentAsset = portfolio?.find((asset) => asset.currency.address === investmentCurrencyAddress)
  const portfolioInvestmentCurrency = portfolioInvestmentAsset?.currency
  const portfolioBalance = portfolioInvestmentAsset?.balance
  const hasInvestmentCurrency = !portfolioBalance?.isZero()

  return {
    isPortfolioLoading,
    portfolioInvestmentAsset,
    portfolioInvestmentCurrency,
    portfolioBalance,
    hasInvestmentCurrency,
  }
}
