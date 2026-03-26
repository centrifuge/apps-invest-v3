import { useDebugFlags } from '@cfg'
import { PoolIntegrations } from '@components/pools/poolDetails/PoolIntegrations'
import { PoolPerformanceChart } from '@components/pools/poolDetails/PoolPerformanceChart'
import { PoolReserves } from './PoolReserves'
import { PoolUnderlyingAssets } from './PoolUnderlyingAssets'

export function PoolDetailsDeRwa() {
  const { showPoolReserves } = useDebugFlags()
  return (
    <>
      <PoolPerformanceChart />
      <PoolIntegrations />
      <PoolUnderlyingAssets />
      {showPoolReserves && <PoolReserves />}
    </>
  )
}
