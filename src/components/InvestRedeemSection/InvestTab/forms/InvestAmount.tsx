import { useCallback, useMemo } from 'react'
import { Balance, PoolNetwork } from '@centrifuge/sdk'
import { Badge, Box, Flex, Switch, Text } from '@chakra-ui/react'
import { debounce } from '@cfg'
import { balanceToString, divideBalanceByPrice } from '@utils/balance'
import { BalanceInput, SubmitButton, useFormContext } from '@forms'
import { NetworkIcon } from '@ui'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { PendingInvestmentBanner } from '@components/InvestRedeemSection/components/PendingInvestmentBanner'
import { useGetPendingInvestments } from '@components/InvestRedeemSection/hooks/useGetPendingInvestments'
import { useVaultsContext } from '@contexts/VaultsContext'
import { usePoolContext } from '@contexts/PoolContext'
import { usePermitToggle } from '@hooks/usePermitToggle'
import { infoText } from '@utils/infoText'

interface InvestAmountProps {
  isDisabled: boolean
  formattedMaxInvestAmount: string
  maxInvestAmount: string
  networs?: PoolNetwork[]
  parsedInvestAmount: 0 | Balance
}

export function InvestAmount({
  isDisabled,
  formattedMaxInvestAmount,
  maxInvestAmount,
  parsedInvestAmount,
}: InvestAmountProps) {
  const { poolDetails, network } = usePoolContext()
  const { investment, vaultDetails } = useVaultsContext()
  const assetBalance = investment?.assetBalance
  const hasInvestmentCurrency = !assetBalance?.isZero()
  const { hasPendingInvestments, asset, pendingDepositAssets } = useGetPendingInvestments()
  const { setValue } = useFormContext()
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

  const setMaxInvestAmount = useCallback(() => {
    if (!assetBalance || !maxInvestAmount || !pricePerShare) return
    setValue('investAmount', maxInvestAmount, { shouldValidate: true })
    const receiveBalance = divideBalanceByPrice(assetBalance, pricePerShare)
    setValue('receiveAmount', balanceToString(receiveBalance))
  }, [assetBalance, maxInvestAmount, pricePerShare, setValue])

  const { permitDisabled, setPermitDisabled } = usePermitToggle()

  const isDepositDisabled =
    !hasInvestmentCurrency || !assetBalance || assetBalance?.isZero() || !isDepositAllowed || isDisabled

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
          <Text fontWeight={500}>You pay</Text>
          <BalanceInput
            name="investAmount"
            decimals={vaultDetails?.asset.decimals}
            placeholder="0.00"
            currency={vaultDetails?.asset.symbol}
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
                borderColor="border.dark-muted !important"
                border="1px solid"
                cursor={isDepositDisabled ? 'not-allowed' : 'pointer'}
                onClick={isDepositDisabled ? undefined : setMaxInvestAmount}
              >
                MAX
              </Badge>
              <Text color="fg.solid" opacity={0.5} alignSelf="flex-end" ml={2}>
                {formattedMaxInvestAmount} available
              </Text>
            </Flex>
            <NetworkIcon centrifugeId={network?.centrifugeId} />
          </Flex>
          {parsedInvestAmount !== 0 && (
            <>
              <Text fontWeight={500} mt={6}>
                Estimated tokens received
              </Text>
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
          <Flex mt={3} align="center" justify="space-between">
            <Text fontSize="sm" color="fg.muted">
              Approve with permit signature
            </Text>
            <Switch.Root
              size="sm"
              checked={!permitDisabled}
              onCheckedChange={({ checked }) => setPermitDisabled(!checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </Flex>
          {!hasInvestmentCurrency && (
            <InfoWrapper text={infoText(investment?.asset.symbol).portfolioMissingInvestmentCurrency} type="error" />
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
