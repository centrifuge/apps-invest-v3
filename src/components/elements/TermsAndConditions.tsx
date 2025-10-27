import { Box, Heading, Link, Text } from '@chakra-ui/react'
import { usePoolContext } from '@contexts/PoolContext'

export function TermsAndConditions() {
  const { poolId } = usePoolContext()

  if (poolId !== '281474976710665') {
    return null
  }

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Terms and Conditions
      </Heading>

      <Box
        bg="bg.solid"
        width="100%"
        padding={6}
        borderRadius={10}
        border="1px solid"
        borderColor="border.solid"
        shadow="xs"
      >
        <Text color="fg.muted" fontSize="sm">
          You acknowledge and agree that the price, net asset value and other trade data related to a Anemoy Janus
          Henderson S&P 500 Fund (“Trade Data”) is the exclusive property of S&P Dow Jones Indices LLC, its affiliates
          or licensors (“S&P DJI”). You shall not create derivative works from such Trade Data (including, without
          limitation, an index, investment strategy and/or investment product) without a separate written agreement with
          S&P DJI for such purpose. The Trade Data shall constitute Content (as defined in the Terms and Conditions
          posted here:{' '}
          <Link href="https://www.spglobal.com/en/terms-of-use" target="_blank" rel="noopener noreferrer">
            https://www.spglobal.com/en/terms-of-use
          </Link>
          ) (the “Terms and Conditions”), and such Terms and Conditions shall apply to your access and use of the Trade
          Data.
        </Text>
      </Box>
    </>
  )
}
