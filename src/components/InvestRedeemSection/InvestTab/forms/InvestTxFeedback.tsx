import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { IoMdInformationCircleOutline, IoMdTimer } from 'react-icons/io'
import { useFormContext } from '@forms'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { InvestAction, type InvestActionType } from '@components/InvestRedeemSection/components/defaults'
import { IoClose } from 'react-icons/io5'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { infoText } from '@utils/infoText'
import { useVaultsContext } from '@contexts/VaultsContext'
import { StepIndicator } from '@components/elements/StepIndicator'
import { useTxStateFeedback } from '@components/InvestRedeemSection/hooks/useTxStateFeedback'
import { Balance } from '@centrifuge/sdk'
import { BalanceDisplay, Tooltip } from '@ui'
import { useAddress } from '@cfg'

interface InvestTxFeedbackProps {
  parsedInvestAmount: Balance | 0
  parsedReceiveAmount: Balance | 0
  setActionType: Dispatch<SetStateAction<InvestActionType>>
}

export function InvestTxFeedback({ setActionType, parsedInvestAmount, parsedReceiveAmount }: InvestTxFeedbackProps) {
  const { vaultDetails } = useVaultsContext()
  const { reset } = useFormContext()
  const { txState, resetTxState, isTxInProgress } = useTxStateFeedback({ type: 'invest' })
  const { walletType } = useAddress()
  const investCurrencySymbol = walletType === 'solana' ? 'USDC' : (vaultDetails?.investmentCurrency.symbol ?? '')
  const receiveCurrencySymbol = vaultDetails?.shareCurrency.symbol ?? ''

  const handleClose = () => {
    reset()
    resetTxState()
    setActionType(InvestAction.INVEST_AMOUNT)
  }

  useEffect(() => {
    resetTxState()
  }, [])

  return (
    <Box height="100%">
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        gap={2}
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Box width="100%" overflow="hidden">
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
              text={txState.isFailed ? infoText().investFailed : infoText().investClaimable}
            />
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} width="100%">
              <Text fontWeight={500} fontSize="md">
                You invest
              </Text>
              <BalanceDisplay balance={parsedInvestAmount} currency={investCurrencySymbol} />
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mt={2}>
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
                          The amount provided is the estimated token. However, the final amount is subject to change
                          based on the final token price on transaction date.
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
                  <Text fontWeight={500} fontSize="md" display="inline">
                    Est. Token amount
                  </Text>
                </Flex>
              </Tooltip>
              <BalanceDisplay balance={parsedReceiveAmount} currency={receiveCurrencySymbol} />
            </Flex>
          </Box>
        </Box>
        <Button colorPalette="yellow" type="button" my={4} onClick={handleClose} width="100%" disabled={isTxInProgress}>
          Invest more
        </Button>
        <Flex w="full" alignItems="center" justifyContent="center">
          <StepIndicator
            action="Invest"
            isFailed={txState.isFailed}
            isStep1Successful={txState.isApproved}
            isStep2Successful={txState.isSuccessful}
          />
        </Flex>
      </Flex>
    </Box>
  )
}
