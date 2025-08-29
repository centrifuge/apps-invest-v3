import { Balance, CurrencyDetails, Vault } from '@centrifuge/sdk'
import { formatBalance, useCentrifugeTransaction } from '@cfg'
import { Tooltip } from '@ui'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { IoMdCheckmarkCircleOutline, IoMdInformationCircleOutline } from 'react-icons/io'

interface InvestRedeemClaimFormProps {
  claimableInvestShares?: Balance
  claimableRedeemCurrency?: Balance
  claimableInvestCurrencyEquivalent?: Balance
  claimableRedeemSharesEquivalent?: Balance
  investmentCurrency?: CurrencyDetails
  shareCurrency?: CurrencyDetails
  vault: Vault
  setIsClaimFormDisplayed: Dispatch<SetStateAction<boolean>>
}

export function InvestRedeemClaimForm({
  claimableInvestShares,
  claimableRedeemCurrency,
  claimableInvestCurrencyEquivalent,
  claimableRedeemSharesEquivalent,
  investmentCurrency,
  shareCurrency,
  vault,
  setIsClaimFormDisplayed,
}: InvestRedeemClaimFormProps) {
  const { execute, isPending } = useCentrifugeTransaction()

  const claim = useCallback(() => execute(vault.claim()).then(() => setIsClaimFormDisplayed(false)), [vault, execute])

  return (
    <Box mt={4} height="100%">
      <Flex flexDirection="column" justifyContent="space-between" height="100%">
        <Box>
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Heading>You must claim your tokens</Heading>
            <Icon size="xl">
              <IoMdCheckmarkCircleOutline />
            </Icon>
          </Flex>
          {claimableInvestShares && !claimableInvestShares.isZero() && (
            <Box mt={6}>
              <Text fontWeight={500}>Claimable shares</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">
                  {formatBalance(claimableInvestShares ?? 0, shareCurrency?.symbol ?? '', 2)}
                </Heading>
              </Flex>
            </Box>
          )}
          {claimableInvestCurrencyEquivalent && !claimableInvestCurrencyEquivalent.isZero() && (
            <Box mt={3}>
              <Text fontWeight={500}>Claimable invest currency equivalent</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">
                  {formatBalance(claimableInvestCurrencyEquivalent ?? 0, investmentCurrency?.symbol ?? '', 2)}
                </Heading>
              </Flex>
            </Box>
          )}
          {claimableRedeemCurrency && !claimableRedeemCurrency.isZero() && (
            <Box mt={3}>
              <Text fontWeight={500}>Claimable redeem amount</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">
                  {formatBalance(claimableRedeemCurrency ?? 0, shareCurrency?.symbol ?? '', 2)}
                </Heading>
              </Flex>
            </Box>
          )}
          {claimableRedeemSharesEquivalent && !claimableRedeemSharesEquivalent.isZero() && (
            <Box mt={3}>
              <Text fontWeight={500}>Claimable redeem currency equivalent</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">
                  {formatBalance(claimableRedeemSharesEquivalent ?? 0, investmentCurrency?.symbol ?? '', 2)}
                </Heading>
              </Flex>
            </Box>
          )}
        </Box>
        <Box pt={6}>
          <Button w="100%" onClick={claim} disabled={isPending}>
            Claim
          </Button>
          <Tooltip
            content={
              <>
                <Flex alignItems="flex-start">
                  <Icon size="md" mr={2}>
                    <IoMdInformationCircleOutline />
                  </Icon>
                  <Box>
                    <Heading size="sm" mb={2}>
                      Invest More
                    </Heading>
                    <Text>First claim before investing or redeeming more</Text>
                  </Box>
                </Flex>
              </>
            }
          >
            <Flex alignItems="center" justifyContent="center" mt={2}>
              <Icon size="md" mr={2}>
                <IoMdInformationCircleOutline />
              </Icon>
              <Text>Invest more once claimed</Text>
            </Flex>
          </Tooltip>
        </Box>
      </Flex>
    </Box>
  )
}
