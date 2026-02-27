import { Balance, CurrencyDetails, Vault } from '@centrifuge/sdk'
import { formatBalance, useCentrifugeTransaction } from '@cfg'
import { useQueryClient } from '@tanstack/react-query'
import { Tooltip } from '@ui'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { IoMdCheckmarkCircleOutline, IoMdInformationCircleOutline } from 'react-icons/io'

interface InvestRedeemClaimFormProps {
  claimableDepositShares?: Balance
  claimableRedeemAssets?: Balance
  claimableDepositAssetEquivalent?: Balance
  claimableRedeemSharesEquivalent?: Balance
  asset?: CurrencyDetails
  share?: CurrencyDetails
  vault: Vault
  setIsClaimFormDisplayed: Dispatch<SetStateAction<boolean>>
}

export function InvestRedeemClaimForm({
  claimableDepositShares,
  claimableRedeemAssets,
  claimableDepositAssetEquivalent,
  claimableRedeemSharesEquivalent,
  asset,
  share,
  vault,
  setIsClaimFormDisplayed,
}: InvestRedeemClaimFormProps) {
  const { execute, isPending } = useCentrifugeTransaction()
  const queryClient = useQueryClient()

  const claim = useCallback(
    () =>
      execute(vault.claim()).then(() => {
        queryClient.invalidateQueries({ queryKey: ['poolsAccessStatus'] })
        queryClient.invalidateQueries({ queryKey: ['investmentsPerVaults'] })
        setIsClaimFormDisplayed(false)
      }),
    [vault, execute, queryClient]
  )
  const shareCurrencySymbol = share?.symbol ?? ''
  const investmentCurrencySymbol = asset?.symbol ?? ''

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
          {claimableDepositShares && !claimableDepositShares.isZero() && (
            <Box mt={6}>
              <Text fontWeight={500}>Claimable shares</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">{formatBalance(claimableDepositShares, { currency: shareCurrencySymbol, precision: 2 })}</Heading>
              </Flex>
            </Box>
          )}
          {claimableDepositAssetEquivalent && !claimableDepositAssetEquivalent.isZero() && (
            <Box mt={3}>
              <Text fontWeight={500}>Claimable invest currency equivalent</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">
                  {formatBalance(claimableDepositAssetEquivalent, { currency: investmentCurrencySymbol, precision: 2 })}
                </Heading>
              </Flex>
            </Box>
          )}
          {claimableRedeemSharesEquivalent && !claimableRedeemSharesEquivalent.isZero() && (
            <Box mt={3}>
              <Text fontWeight={500}>Claimable redeem amount</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">
                  {formatBalance(claimableRedeemSharesEquivalent, { currency: shareCurrencySymbol, precision: 2 })}
                </Heading>
              </Flex>
            </Box>
          )}
          {claimableRedeemAssets && !claimableRedeemAssets.isZero() && (
            <Box mt={3}>
              <Text fontWeight={500}>Claimable redeem currency equivalent</Text>
              <Flex alignItems="center" justifyContent="flex-start">
                <Heading fontSize="xl">{formatBalance(claimableRedeemAssets, { currency: investmentCurrencySymbol, precision: 2 })}</Heading>
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
