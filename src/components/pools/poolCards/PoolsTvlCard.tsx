import { Balance, PoolId } from '@centrifuge/sdk'
import { formatBalance, formatDate, useAllPoolDetails } from '@cfg'
import { Flex, Skeleton, Text } from '@chakra-ui/react'
import { IoBarChart } from 'react-icons/io5'

export function PoolsTvlCard({ poolIds }: { poolIds: PoolId[] }) {
  const { data: poolsDetails, isLoading } = useAllPoolDetails(poolIds, { enabled: poolIds.length > 0 })
  const zeroBalance: Balance = new Balance(0n, 18)

  const totalTVL = poolsDetails?.reduce((acc, pool) => {
    const poolTVL = pool.shareClasses.reduce((innerAcc, shareClass) => {
      const { totalIssuance, pricePerShare } = shareClass.details
      const tvl = pricePerShare.mul(totalIssuance)
      return innerAcc.add(tvl)
    }, zeroBalance)

    return acc.add(poolTVL)
  }, zeroBalance)

  const formattedTotalTVL = totalTVL ? formatBalance(totalTVL, { currency: 'USD', precision: 0 }) : 'unknown'

  if (isLoading) {
    return <Skeleton height="68px" width="360px" borderRadius="md" />
  }

  return (
    <Flex alignItems="center" gap={3}>
      <IoBarChart size="3rem" color="#FFC012" style={{ marginTop: '0.75rem' }} />
      <Flex flexDirection="column" alignItems="flex-end">
        <Text color="fg.subtle" fontSize="sm" fontWeight={500} lineHeight="20px">
          TVL on {formatDate(new Date(), 'short')}
        </Text>
        <Text color="fg.inverted" fontSize="4xl" fontWeight={600} lineHeight="44px" letterSpacing="-0.72px">
          $ {formattedTotalTVL}
        </Text>
      </Flex>
    </Flex>
  )
}
