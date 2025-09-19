import { useCallback, useMemo } from 'react'
import { Balance, PoolNetwork } from '@centrifuge/sdk'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { debounce, formatBalanceToString, formatBalance, divideBigInts } from '@cfg'
import { BalanceInput, SubmitButton, useFormContext } from '@forms'
import { BalanceDisplay, NetworkIcons } from '@ui'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { PendingInvestmentBanner } from '@components/InvestRedeemSection/components/PendingInvestmentBanner'
import { useGetPendingInvestments } from '@components/InvestRedeemSection/hooks/useGetPendingInvestments'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'

interface RedeemAmountProps {
  isDisabled: boolean
  maxRedeemAmount: string
  networks?: PoolNetwork[]
  parsedRedeemAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
}

export function RedeemAmount({
  isDisabled,
  maxRedeemAmount,
  networks,
  parsedRedeemAmount,
  parsedReceiveAmount,
}: RedeemAmountProps) {
  const { poolDetails } = usePoolContext()
  const { investment, vaults, vaultDetails, vaultsDetails, setVault } = useVaultsContext()
  const { hasPendingRedeems, pendingRedeemShares, shareCurrency } = useGetPendingInvestments()
  const { setValue } = useFormContext()

  // Get networkIds and currencies for receiveAmount select currency list
  const networkIds = networks?.map((network) => network.chainId)
  const investmentCurrencies = vaultsDetails?.map((vault) => ({
    label: vault.investmentCurrency.symbol,
    value: vault.address,
  }))

  // Get the pricePerShare
  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare
  const investCurrencySymbol = investment?.investmentCurrency.symbol ?? ''

  // Get info on the users shares holdings in their wallet
  const shareCurrencySymbol = investment?.shareCurrency.symbol ?? ''
  const maxRedeemBalance = investment?.shareBalance ?? 0
  const hasRedeemableShares = !investment?.shareBalance.isZero()

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, redeemInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !redeemInputAmount || !pricePerShare) return

      const calculatedReceiveAmount = formatBalanceToString(
        redeemInputAmount.mul(pricePerShare),
        redeemInputAmount.decimals
      )
      setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 250), [calculateReceiveAmount])

  const calculateRedeemAmountValue = useCallback(
    (receiveInputAmount?: Balance) => {
      if (!receiveInputAmount || !pricePerShare) {
        return ''
      }

      const receiveAmountDecimals = receiveInputAmount.decimals
      const receiveAmountBigint = receiveInputAmount.toBigInt()
      const pricePerShareBigint = pricePerShare.toBigInt()

      return divideBigInts(receiveAmountBigint, pricePerShareBigint, pricePerShare.decimals).formatToString(
        receiveAmountDecimals,
        pricePerShare?.decimals
      )
    },
    [pricePerShare]
  )

  const calculateRedeemAmount = useCallback(
    (inputStringValue: string, receiveInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !receiveInputAmount || !pricePerShare) {
        return setValue('redeemAmount', '')
      }

      const calculatedRedeemAmount = calculateRedeemAmountValue(receiveInputAmount)

      return setValue('redeemAmount', calculatedRedeemAmount)
    },
    [pricePerShare, setValue]
  )

  const debouncedCalculateRedeemAmount = useMemo(() => debounce(calculateRedeemAmount, 250), [calculateRedeemAmount])

  const changeVault = useCallback(
    (value: string | number) => {
      const newVault = vaults?.find((vault) => vault.address === value)
      setVault(newVault)
    },
    [vaults]
  )

  const setMaxRedeemAmount = useCallback(() => {
    if (!maxRedeemAmount || !pricePerShare || !hasRedeemableShares || maxRedeemBalance === 0) return

    const calculatedReceiveAmount = formatBalanceToString(
      maxRedeemBalance.mul(pricePerShare),
      maxRedeemBalance.decimals
    )

    setValue('redeemAmount', maxRedeemAmount)
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxRedeemAmount, pricePerShare])

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        {hasPendingRedeems && pendingRedeemShares ? (
          <PendingInvestmentBanner
            label="Pending redemptions"
            amount={pendingRedeemShares}
            currencySymbol={shareCurrency?.symbol}
          />
        ) : null}
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight={500}>Redeem</Text>
            {parsedRedeemAmount !== 0 ? (
              <BalanceDisplay
                balance={parsedRedeemAmount}
                currency={shareCurrencySymbol}
                precision={2}
                ml={4}
                fontSize="xs"
                color="fg.subtle"
              />
            ) : null}
          </Flex>
          <BalanceInput
            name="redeemAmount"
            decimals={vaultDetails?.shareCurrency.decimals}
            placeholder="0.00"
            onChange={debouncedCalculateReceiveAmount}
            currency={shareCurrencySymbol}
            disabled={!hasRedeemableShares}
          />
          <Flex mt={2} justify="space-between">
            <Flex>
              <Badge
                background="bg.tertiary"
                color="fg.solid"
                opacity={0.5}
                borderRadius={10}
                px={3}
                h="24px"
                borderColor="gray.600 !important"
                border="1px solid"
                cursor="pointer"
                onClick={setMaxRedeemAmount}
              >
                MAX
              </Badge>
              <Text color="fg.solid" opacity={0.5} alignSelf="flex-end" ml={2}>
                {formatBalance(maxRedeemBalance, shareCurrencySymbol, 0)} avaialbe
              </Text>
            </Flex>
            <NetworkIcons networkIds={networkIds} />
          </Flex>
          {parsedRedeemAmount !== 0 && (
            <>
              <Flex alignItems="center" justifyContent="space-between" mt={6}>
                <Text fontWeight={500}>Estimated receive amount</Text>
                <BalanceDisplay
                  balance={parsedReceiveAmount}
                  currency={investCurrencySymbol}
                  precision={2}
                  ml={4}
                  fontSize="xs"
                  color="fg.subtle"
                />
              </Flex>
              <BalanceInput
                name="receiveAmount"
                placeholder="0.00"
                decimals={vaultDetails?.investmentCurrency.decimals}
                onChange={debouncedCalculateRedeemAmount}
                selectOptions={investmentCurrencies}
                onSelectChange={changeVault}
              />
            </>
          )}
        </Box>
        <Box>
          <SubmitButton colorPalette="yellow" disabled={isDisabled} width="100%" mt={6}>
            Redeem
          </SubmitButton>
          {!hasRedeemableShares ? (
            <InfoWrapper text="You do not have any tokens available to redeem" type="info" />
          ) : null}
        </Box>
      </Flex>
    </Box>
  )
}
