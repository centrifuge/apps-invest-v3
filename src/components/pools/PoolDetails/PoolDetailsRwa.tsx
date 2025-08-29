import { PoolKeyFacts } from '@components/pools/PoolDetails/PoolKeyFacts/PoolKeyFacts'
import { PoolHoldings } from '@components/pools/PoolDetails/PoolHoldings'
import { PoolOverview } from '@components/pools/PoolDetails/PoolOverview'
import { PoolPerformanceChart } from '@components/pools/PoolDetails/PoolPerformanceChart'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'

export function PoolDetailsRwa() {
  const { isRestrictedPool } = useGetPoolsByIds()

  return (
    <>
      {isRestrictedPool ? null : <PoolPerformanceChart />}
      <PoolOverview />
      <PoolKeyFacts />
      {isRestrictedPool ? null : <PoolHoldings />}
    </>
  )
}
