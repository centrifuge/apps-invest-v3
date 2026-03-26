import { PoolKeyFacts } from '@components/pools/poolDetails/PoolKeyFacts/PoolKeyFacts'
import { PoolHoldings } from '@components/pools/poolDetails/PoolHoldings'
import { PoolIntegrations } from '@components/pools/poolDetails/PoolIntegrations'
import { PoolOverview } from '@components/pools/poolDetails/PoolOverview'
import { PoolPerformanceChart } from '@components/pools/poolDetails/PoolPerformanceChart'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { TermsAndConditions } from '@components/elements/TermsAndConditions'

export function PoolDetailsRwa() {
  const { isRestrictedPool } = useGetPoolsByIds()

  return (
    <>
      {isRestrictedPool ? null : <PoolPerformanceChart />}
      <PoolIntegrations />
      <PoolOverview />
      <PoolKeyFacts />
      <PoolHoldings />
      <TermsAndConditions />
    </>
  )
}
