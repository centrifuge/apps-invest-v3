import { CiCoins1 } from 'react-icons/ci'
import { FaCoins } from 'react-icons/fa'
import { RxTarget } from 'react-icons/rx'
import { formatBigintToString } from '@cfg'
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { InvestorsOnlyValueBlock } from '@components/elements/InvestorsOnlyValueBlock'
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
      value: isRestrictedPool ? <InvestorsOnlyValueBlock /> : (poolTVL ?? '0.00'),
      icon: <FaCoins size={16} color="#A4A7AE" style={{ marginRight: '2px' }} />,
    },
    {
      label: 'Token price (USD)',
      value: formatBigintToString(
        shareClass?.details.pricePerShare.toBigInt() ?? 0n,
        shareClass?.details.pricePerShare.decimals ?? 6,
        6
      ),
      icon: <CiCoins1 size={16} color="#A4A7AE" style={{ marginRight: '2px' }} />,
    },
    {
      label: 'APY',
      value: isRestrictedPool ? <InvestorsOnlyValueBlock /> : `${apy}%`,
      icon: <RxTarget size={16} color="#A4A7AE" style={{ marginRight: '2px' }} />,
    },
  ]

  return (
    <Box bg="bg.subtle" padding={{ base: 4, md: 6 }} borderRadius={10} border="1px solid" borderColor="border.solid" shadow="xs">
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={{ base: 2, md: 4 }}>
        {items.map((item, index) => (
          <GridItem minW={0} overflow="hidden" position="relative" key={item.label}>
            <Box
              padding={{ base: 0, md: '0 1rem' }}
              borderLeft={index > 0 ? { base: 'none', md: '1px solid #E7E7E7' } : 'none'}
              borderTop={index > 0 ? { base: '1px solid #E7E7E7', md: 'none' } : 'none'}
              pt={index > 0 ? { base: 2, md: 0 } : 0}
            >
              <Flex alignItems="center" gap={1}>
                {item.icon}
                <Text fontSize="0.75rem" color="fg.muted" fontWeight={500}>
                  {item.label}
                </Text>
              </Flex>
              {typeof item.value === 'string' ? (
                <Text
                  fontSize={{ base: 'md', md: 'clamp(1rem, 1.25rem, 1.5rem)' }}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  fontWeight={600}
                >
                  {item.value}
                </Text>
              ) : (
                item.value
              )}
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}
