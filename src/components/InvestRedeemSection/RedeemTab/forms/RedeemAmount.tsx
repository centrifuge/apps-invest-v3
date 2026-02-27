import { useCallback, useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { debounce, formatBalance } from '@cfg'
import { balanceToString, divideBalanceByPrice } from '@utils/balance'
import { BalanceInput, SubmitButton, useFormContext } from '@forms'
import { BalanceDisplay, NetworkIcon } from '@ui'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { PendingInvestmentBanner } from '@components/InvestRedeemSection/components/PendingInvestmentBanner'
import { useGetPendingInvestments } from '@components/InvestRedeemSection/hooks/useGetPendingInvestments'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'

interface RedeemAmountProps {
  isDisabled: boolean
  maxRedeemAmount: string
  parsedRedeemAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
}

export function RedeemAmount({
  isDisabled,
  maxRedeemAmount,
  parsedRedeemAmount,
  parsedReceiveAmount,
}: RedeemAmountProps) {
  const { network, poolDetails } = usePoolContext()
  const { investment, vaultDetails } = useVaultsContext()
  const { hasPendingRedeems, pendingRedeemShares, share } = useGetPendingInvestments()
  const { setValue } = useFormContext()
  const isAllowedToRedeem = investment?.isAllowedToRedeem ?? false

  // Get the pricePerShare
  const poolShareClass = poolDetails?.shareClasses.find(
    (sc) => sc.shareClass.id.toString() === vaultDetails?.shareClass.id.toString()
  )
  const pricePerShare = poolShareClass?.details.pricePerShare
  const investCurrencySymbol = investment?.asset.symbol ?? ''

  // Get info on the users shares holdings in their wallet
  const shareCurrencySymbol = investment?.share.symbol ?? ''
  const maxRedeemBalance = investment?.shareBalance ?? 0
  const hasRedeemableShares = !investment?.shareBalance.isZero()

  const calculateReceiveAmount = useCallback(
    (inputStringValue: string, redeemInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !redeemInputAmount || !pricePerShare) return

      const calculatedReceiveAmount = balanceToString(redeemInputAmount.mul(pricePerShare))
      setValue('receiveAmount', calculatedReceiveAmount)
    },
    [pricePerShare]
  )

  const debouncedCalculateReceiveAmount = useMemo(() => debounce(calculateReceiveAmount, 250), [calculateReceiveAmount])

  const calculateRedeemAmount = useCallback(
    (inputStringValue: string, receiveInputAmount?: Balance) => {
      if (!inputStringValue || inputStringValue === '0' || !receiveInputAmount || !pricePerShare) {
        return setValue('redeemAmount', '')
      }

      const redeemBalance = divideBalanceByPrice(receiveInputAmount, pricePerShare)
      return setValue('redeemAmount', balanceToString(redeemBalance))
    },
    [pricePerShare, setValue]
  )

  const debouncedCalculateRedeemAmount = useMemo(() => debounce(calculateRedeemAmount, 250), [calculateRedeemAmount])

  const setMaxRedeemAmount = useCallback(() => {
    if (!maxRedeemAmount || !pricePerShare || !hasRedeemableShares || maxRedeemBalance === 0) return

    const calculatedReceiveAmount = balanceToString(maxRedeemBalance.mul(pricePerShare))

    setValue('redeemAmount', maxRedeemAmount)
    setValue('receiveAmount', calculatedReceiveAmount)
  }, [maxRedeemAmount, pricePerShare])

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        {hasPendingRedeems && pendingRedeemShares && (
          <PendingInvestmentBanner
            label="Pending redemptions"
            amount={pendingRedeemShares}
            currencySymbol={share?.symbol}
          />
        )}
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight={500}>Redeem</Text>
            {parsedRedeemAmount !== 0 && (
              <BalanceDisplay
                balance={parsedRedeemAmount}
                currency={shareCurrencySymbol}
                precision={2}
                ml={4}
                fontSize="xs"
                color="fg.muted"
              />
            )}
          </Flex>
          <BalanceInput
            name="redeemAmount"
            decimals={vaultDetails?.share.decimals}
            placeholder="0.00"
            onChange={debouncedCalculateReceiveAmount}
            currency={shareCurrencySymbol}
            disabled={!hasRedeemableShares || !isAllowedToRedeem}
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
                borderColor="border.dark-muted !important"
                border="1px solid"
                cursor="pointer"
                onClick={setMaxRedeemAmount}
              >
                MAX
              </Badge>
              <Text color="fg.solid" opacity={0.5} alignSelf="flex-end" ml={2}>
                {formatBalance(maxRedeemBalance, { currency: shareCurrencySymbol, precision: 0 })} available
              </Text>
            </Flex>
            <NetworkIcon centrifugeId={network?.centrifugeId} />
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
                  color="fg.muted"
                />
              </Flex>
              <BalanceInput
                name="receiveAmount"
                placeholder="0.00"
                decimals={vaultDetails?.asset.decimals}
                onChange={debouncedCalculateRedeemAmount}
                currency={vaultDetails?.asset.symbol}
              />
            </>
          )}
        </Box>
        <Box>
          <SubmitButton colorPalette="yellow" disabled={isDisabled || !isAllowedToRedeem} width="100%" mt={6}>
            Redeem
          </SubmitButton>
          {!hasRedeemableShares && <InfoWrapper text="You do not have any tokens available to redeem" type="info" />}
          {!isAllowedToRedeem && (
            <InfoWrapper
              text="Redeeming is currently not allowed for your investment. Please contact a pool manager."
              type="info"
            />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
