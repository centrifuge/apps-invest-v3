import { formatBigintToString } from '@cfg'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { AccreditedOnlyValueBlock } from '@components/elements/AccreditedOnlyValueBlock'
import { usePoolContext } from '@contexts/PoolContext'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { roundToDecimal } from '@utils/nums'

export function PoolMainStats() {
  const { shareClass, poolTVL } = usePoolContext()
  const { isRestrictedPool } = useGetPoolsByIds()
  const apy = roundToDecimal(shareClass?.details.apyPercentage ?? 0)

  const items = [
    {
      label: 'TVL (USD)',
      value: isRestrictedPool ? <AccreditedOnlyValueBlock /> : (poolTVL ?? '0.00'),
    },
    {
      label: 'Token price (USD)',
      value: formatBigintToString(
        shareClass?.details.pricePerShare.toBigInt() ?? 0n,
        shareClass?.details.pricePerShare.decimals ?? 6,
        6
      ),
    },
    {
      label: 'APY',
      value: isRestrictedPool ? <AccreditedOnlyValueBlock /> : `${apy}%`,
    },
  ]

  return (
    <Box bg="bg.solid" padding={6} borderRadius={10} border="1px solid" borderColor="border.solid" shadow="xs">
      <Grid templateColumns={{ base: 'repeat(3, 1fr)' }} gap={4}>
        {items.map((item, index) => (
          <GridItem minW={0} overflow="hidden" position="relative" key={item.label}>
            <Box
              padding={{ base: '1rem 0 0 0', md: '0 1rem' }}
              borderLeft={index > 0 ? { base: 'none', md: '1px solid #E7E7E7' } : 'none'}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Text
                fontSize="0.75rem"
                color="fg.subtle"
                fontWeight={500}
                width="auto"
                textAlign={{ base: 'center', md: 'left' }}
              >
                {item.label}
              </Text>
              <Text
                fontSize="clamp(1rem, 1.25rem, 1.5rem)"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontWeight={600}
              >
                {item.value}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}
