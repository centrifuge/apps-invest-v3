import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { usePoolContext } from '@contexts/usePoolContext'
import { CiShare1 } from 'react-icons/ci'

interface InvestorOnboardingFeedbackProps {
  investCurrencyAddress?: string
  shareCurrencyAddress?: string
  chainId?: number
}

export function InvestorOnboardingFeedback({
  investCurrencyAddress,
  shareCurrencyAddress,
  chainId,
}: InvestorOnboardingFeedbackProps) {
  const { poolDetails } = usePoolContext()
  // TODO: add filtering for accepted currency pairs once available instead of just USDC to deJAAA on Base
  const isBaseDeJAAA =
    investCurrencyAddress === '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' &&
    shareCurrencyAddress === '0xaaa0008c8cf3a7dca931adaf04336a5d808c82cc' &&
    chainId === 8453
  const marketLink = isBaseDeJAAA
    ? `https://aerodrome.finance/swap?from=${investCurrencyAddress}&to=${shareCurrencyAddress}&chain0=${chainId}&chain1=${chainId}`
    : ''
  const email = poolDetails?.metadata?.pool.issuer.email ?? 'dekyc@centrifuge.io'

  return (
    <Box height="100%">
      <Flex justify="space-between" flexDirection="column" height="100%">
        <Box>
          <Heading mt={4} mb={6}>
            Onboarding required
          </Heading>
          <InfoWrapper
            type="info"
            text={
              <>
                <Text fontSize="sm">Onboarding is required to invest and redeem.</Text>
                <Text fontSize="sm">
                  Email{' '}
                  <a href={`mailto:${email}?subject=Onboarding`} style={{ color: '#FFC012' }}>
                    {email}
                  </a>{' '}
                  to get started.
                </Text>
              </>
            }
          />
        </Box>
        <Button disabled colorPalette="yellow" mt={8}>
          Invest
        </Button>
        {isBaseDeJAAA && (
          <Box mt={6} mb={8}>
            <a href={marketLink} target="_blank" rel="noopener noreferrer">
              <Flex alignItems="center" justifyContent="center">
                <Text fontSize="sm" mr={8} fontWeight={500}>
                  Secondary Market
                </Text>
                <CiShare1 />
              </Flex>
            </a>
          </Box>
        )}
      </Flex>
    </Box>
  )
}
