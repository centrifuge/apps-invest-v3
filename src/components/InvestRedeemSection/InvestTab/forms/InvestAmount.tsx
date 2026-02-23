import { useCallback, useMemo } from 'react'
import { Balance, PoolNetwork } from '@centrifuge/sdk'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { debounce } from '@cfg'
import { balanceToString, divideBalanceByPrice } from '@utils/balance'
import { BalanceInput, SubmitButton, useFormContext } from '@forms'
import { BalanceDisplay, NetworkIcons } from '@ui'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { PendingInvestmentBanner } from '@components/InvestRedeemSection/components/PendingInvestmentBanner'
import { useGetPendingInvestments } from '@components/InvestRedeemSection/hooks/useGetPendingInvestments'
import { useVaultsContext } from '@contexts/VaultsContext'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'
import { infoText } from '@utils/infoText'
import { useGetVaultCurrencyOptions } from '@hooks/useGetVaultCurrencyOptions'

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
  const { investment, vaultDetails, vaults, setVault } = useVaultsContext()
  const { portfolioInvestmentCurrency, portfolioBalance, hasInvestmentCurrency } = useGetPortfolioDetails(vaultDetails)
  const { hasPendingInvestments, asset, pendingDepositAssets } = useGetPendingInvestments()
  const { setValue } = useFormContext()
  const centrifugeIds = networks?.map((network) => network.centrifugeId)
  const depositCurrencies = useGetVaultCurrencyOptions({ isRedeem: false })
  const isDepositAllowed = investment?.isAllowedToDeposit ?? false

  // Get the share class info for calculating shares amount to receive
  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, investInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !investInputAmount || !pricePerShare) {
        return setValue('receiveAmount', '')
      }

      const receiveBalance = divideBalanceByPrice(investInputAmount, pricePerShare)
      return setValue('receiveAmount', balanceToString(receiveBalance))
    },
    [pricePerShare, setValue]
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
    const calculatedReceiveAmount = balanceToString(portfolioBalance.mul(pricePerShare))
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxInvestAmount])

  const isDepositDisabled = !hasInvestmentCurrency || !isDepositAllowed || isDisabled

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        {hasPendingInvestments && pendingDepositAssets ? (
          <PendingInvestmentBanner
            label="Pending investments"
            amount={pendingDepositAssets}
            currencySymbol={asset?.symbol}
          />
        ) : null}
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight={500}>You pay</Text>
            {parsedInvestAmount !== 0 ? (
              <BalanceDisplay
                balance={parsedInvestAmount}
                currency={vaultDetails?.asset.symbol}
                precision={2}
                ml={4}
                fontSize="xs"
                color="fg.muted"
              />
            ) : null}
          </Flex>
          <BalanceInput
            name="investAmount"
            decimals={vaultDetails?.asset.decimals}
            placeholder="0.00"
            selectOptions={depositCurrencies}
            onSelectChange={changeVault}
            onChange={debouncedCalculateReceiveAmount}
            disabled={isDepositDisabled}
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
            <NetworkIcons centrifugeIds={centrifugeIds} />
          </Flex>
          {parsedInvestAmount !== 0 && (
            <>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontWeight={500} mt={6}>
                  Estimated tokens received
                </Text>
                <BalanceDisplay
                  balance={parsedReceiveAmount}
                  currency={vaultDetails?.share.symbol}
                  precision={2}
                  mt={6}
                  fontSize="xs"
                  color="fg.muted"
                />
              </Flex>
              <BalanceInput
                name="receiveAmount"
                decimals={vaultDetails?.share.decimals}
                placeholder="0.00"
                disabled
                currency={vaultDetails?.share.symbol}
              />
            </>
          )}
        </Box>
        <Box>
          <SubmitButton colorPalette="yellow" width="100%" disabled={isDisabled || !isDepositAllowed} mt={6}>
            Invest
          </SubmitButton>
          {!hasInvestmentCurrency && (
            <InfoWrapper
              text={infoText(portfolioInvestmentCurrency?.symbol).portfolioMissingInvestmentCurrency}
              type="error"
            />
          )}
          {!isDepositAllowed && (
            <InfoWrapper
              text="You are currently not allowed to deposit in this vault. Please contact a pool manager."
              type="info"
            />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
