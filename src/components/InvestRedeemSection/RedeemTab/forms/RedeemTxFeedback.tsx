import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { Balance } from '@centrifuge/sdk'
import { BalanceDisplay, Tooltip } from '@ui'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useFormContext } from '@forms'
import { IoClose } from 'react-icons/io5'
import { IoMdInformationCircleOutline, IoMdTimer } from 'react-icons/io'
import { useTxStateFeedback } from '@components/InvestRedeemSection/hooks/useTxStateFeedback'
import { StepIndicator } from '@components/elements/StepIndicator'

interface CancelRedeemProps {
  currencies: { redeemCurrency: string; receiveCurrency: string }
  isDisabled: boolean
  parsedRedeemAmount: 0 | Balance
  parsedReceiveAmount: 0 | Balance
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTxFeedback({
  currencies: { redeemCurrency, receiveCurrency },
  isDisabled,
  parsedRedeemAmount,
  parsedReceiveAmount,
  setActionType,
}: CancelRedeemProps) {
  const { txState, resetTxState, isTxInProgress } = useTxStateFeedback({ type: 'redeem' })
  const { reset } = useFormContext()

  const handleClose = () => {
    setActionType(RedeemAction.REDEEM_AMOUNT)
    resetTxState()
    reset()
  }

  useEffect(() => {
    resetTxState()
  }, [])

  return (
    <Box>
      <Flex alignItems="center" gap={2} justifyContent="space-between">
        <Heading>{txState.header}</Heading>
        <Icon size="lg">
          {txState.isSuccessful || txState.isFailed ? (
            <IoClose onClick={handleClose} cursor="pointer" />
          ) : (
            <IoMdTimer color="fg.subtle" />
          )}
        </Icon>
      </Flex>
      <Box opacity={txState.isSuccessful || txState.isFailed ? 1 : 0.5}>
        <InfoWrapper
          type={txState.isFailed ? 'error' : 'info'}
          text={txState.isFailed ? infoText().redeemFailed : infoText().asyncRedeem}
        />
        <Flex mt={4} justify="space-between">
          <Text fontWeight={500} fontSize="md">
            Redeeming
          </Text>
          <Text fontSize="md" whiteSpace="normal" wordWrap="break-word" textAlign="right">
            <BalanceDisplay balance={parsedRedeemAmount} currency={redeemCurrency} />
          </Text>
        </Flex>
        <Flex mt={4} justify="space-between">
          <Tooltip
            content={
              <>
                <Flex alignItems="flex-start">
                  <Icon size="md" mr={2}>
                    <IoMdInformationCircleOutline />
                  </Icon>
                  <Box>
                    <Heading size="sm" mb={2}>
                      Estimated Amount
                    </Heading>
                    <Text>
                      The amount provided is the estimated redemption value of your tokens. However, the final amount is
                      subject to change based on the final redemption price.
                    </Text>
                  </Box>
                </Flex>
              </>
            }
          >
            <Flex alignItems="center" justifyContent="flex-start">
              <Icon size="md" mr={2}>
                <IoMdInformationCircleOutline />
              </Icon>
              <Text fontWeight={500} fontSize="md">
                Est. Receive amount
              </Text>
            </Flex>
          </Tooltip>
          <Text fontSize="md" whiteSpace="normal" wordWrap="break-word" textAlign="right">
            <BalanceDisplay balance={parsedReceiveAmount} currency={receiveCurrency} />
          </Text>
        </Flex>
      </Box>
      <Button
        colorPalette="yellow"
        type="button"
        width="100%"
        disabled={isTxInProgress || isDisabled}
        my={4}
        onClick={handleClose}
      >
        Redeem more
      </Button>
      <Flex w="full" alignItems="center" justifyContent="center">
        <StepIndicator
          action="Redeem"
          isFailed={txState.isFailed}
          isStep1Successful={txState.isApproved}
          isStep2Successful={txState.isSuccessful}
        />
      </Flex>
    </Box>
  )
}
