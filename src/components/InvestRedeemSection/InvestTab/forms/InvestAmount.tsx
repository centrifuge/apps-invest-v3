import { useCallback, useMemo } from 'react'
import { Balance, PoolNetwork, Price } from '@centrifuge/sdk'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { debounce, divideBigInts, formatBalanceToString, useAddress } from '@cfg'
import { BalanceInput, SubmitButton, useFormContext } from '@forms'
import { BalanceDisplay, NetworkIcons } from '@ui'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { PendingInvestmentBanner } from '@components/InvestRedeemSection/components/PendingInvestmentBanner'
import { useGetPendingInvestments } from '@components/InvestRedeemSection/hooks/useGetPendingInvestments'
import { useVaultsContext } from '@contexts/VaultsContext'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'
import { infoText } from '@utils/infoText'

interface InvestAmountProps {
  isDisabled: boolean
  formattedMaxInvestAmount: string
  maxInvestAmount: string
  networs?: PoolNetwork[]
  parsedInvestAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
}

export function InvestAmount({
  isDisabled,
  formattedMaxInvestAmount,
  maxInvestAmount,
  parsedInvestAmount,
  parsedReceiveAmount,
}: InvestAmountProps) {
  const { poolDetails, networks } = usePoolContext()
  const { vaultDetails, vaultsDetails, vaults, setVault } = useVaultsContext()
  const { portfolioBalance, hasInvestmentCurrency: hasEvmInvestmentCurrency } = useGetPortfolioDetails(vaultDetails)
  const { hasPendingInvestments, investmentCurrency, pendingInvestCurrency } = useGetPendingInvestments()
  const { setValue } = useFormContext()
  const { isSolanaWallet } = useAddress()
  const networkIds = networks?.map((network) => network.chainId)

  const hasInvestmentCurrency = isSolanaWallet ? Number(maxInvestAmount) > 0 : hasEvmInvestmentCurrency

  const investmentCurrencySymbol = isSolanaWallet ? 'USDC' : vaultDetails?.investmentCurrency.symbol
  const investmentCurrencyDecimals = isSolanaWallet ? 6 : vaultDetails?.investmentCurrency.decimals

  // Investment Currencies for changing asset to invest
  // For Solana wallets, only show USDC option
  const investmentCurrencies = useMemo(() => {
    const allCurrencies = vaultsDetails?.map((vault) => ({
      label: vault.investmentCurrency.symbol,
      value: vault.address,
    }))

    if (isSolanaWallet) {
      return allCurrencies?.filter((currency) => currency.label === 'USDC')
    }

    return allCurrencies
  }, [vaultsDetails, isSolanaWallet])

  // Get the share class info for calculating shares amount to receive
  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare

  const calculateReceiveAmountValue = useCallback(
    (investBalance: Balance, pricePerShare?: Price) => {
      if (!investBalance || !pricePerShare) {
        return ''
      }

      const investAmountDecimals = investBalance.decimals
      const investAmountBigint = investBalance.toBigInt()
      const pricePerShareBigint = pricePerShare.toBigInt()

      return divideBigInts(investAmountBigint, pricePerShareBigint, pricePerShare.decimals).formatToString(
        investAmountDecimals,
        2
      )
    },
    [investmentCurrencyDecimals]
  )

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, investInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !investInputAmount || !pricePerShare) {
        return setValue('receiveAmount', '')
      }

      const calculatedReceiveAmount = calculateReceiveAmountValue(investInputAmount, pricePerShare)
      return setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare, calculateReceiveAmountValue, setValue]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 250), [calculateReceiveAmount])

  const changeVault = useCallback(
    (value: string | number) => {
      const newVault = vaults?.find((vault) => vault.address === value)
      setVault(newVault)
    },
    [vaults]
  )

  const setMaxInvestAmount = useCallback(() => {
    if (!portfolioBalance || !maxInvestAmount || !pricePerShare) return
    setValue('investAmount', maxInvestAmount)
    const calculatedReceiveAmount = formatBalanceToString(
      portfolioBalance.mul(pricePerShare),
      portfolioBalance.decimals
    )
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxInvestAmount])

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        {hasPendingInvestments && pendingInvestCurrency ? (
          <PendingInvestmentBanner
            label="Pending investments"
            amount={pendingInvestCurrency}
            currencySymbol={investmentCurrency?.symbol}
          />
        ) : null}
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight={500}>You pay</Text>
            {parsedInvestAmount !== 0 ? (
              <BalanceDisplay
                balance={parsedInvestAmount}
                currency={investmentCurrencySymbol}
                precision={2}
                ml={4}
                fontSize="xs"
                color="fg.muted"
              />
            ) : null}
          </Flex>
          <BalanceInput
            name="investAmount"
            decimals={investmentCurrencyDecimals}
            placeholder="0.00"
            selectOptions={isSolanaWallet ? undefined : investmentCurrencies}
            currency={isSolanaWallet ? 'USDC' : undefined}
            onSelectChange={changeVault}
            onChange={debouncedCalculateReceiveAmount}
            disabled={!hasInvestmentCurrency}
          />
          <Flex mt={2} justify="space-between">
            <Flex>
              <Badge
                background="bg.subtle"
                color="fg.solid"
                opacity={0.5}
                borderRadius={10}
                px={3}
                h="24px"
                onClick={setMaxInvestAmount}
                borderColor="border.dark-muted !important"
                border="1px solid"
                cursor="pointer"
              >
                MAX
              </Badge>
              <Text color="fg.solid" opacity={0.5} alignSelf="flex-end" ml={2}>
                {formattedMaxInvestAmount} available
              </Text>
            </Flex>
            <NetworkIcons networkIds={networkIds} />
          </Flex>
          {parsedInvestAmount !== 0 && (
            <>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontWeight={500} mt={6}>
                  Estimated tokens received
                </Text>
                <BalanceDisplay
                  balance={parsedReceiveAmount}
                  currency={vaultDetails?.shareCurrency.symbol}
                  precision={2}
                  mt={6}
                  fontSize="xs"
                  color="fg.muted"
                />
              </Flex>
              <BalanceInput
                name="receiveAmount"
                decimals={vaultDetails?.shareCurrency.decimals}
                placeholder="0.00"
                disabled
                currency={vaultDetails?.shareCurrency.symbol}
              />
            </>
          )}
        </Box>
        <Box>
          <SubmitButton colorPalette="yellow" width="100%" disabled={isDisabled} mt={6}>
            Invest
          </SubmitButton>
          {!hasInvestmentCurrency ? (
            <InfoWrapper text={infoText(investmentCurrencySymbol).portfolioMissingInvestmentCurrency} type="error" />
          ) : null}
        </Box>
      </Flex>
    </Box>
  )
}
