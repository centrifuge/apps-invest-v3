import { useDebugFlags } from '@cfg'
import { PoolPerformanceChart } from '@components/pools/poolDetails/PoolPerformanceChart'
import { PoolReserves } from './PoolReserves'
import { PoolUnderlyingAssets } from './PoolUnderlyingAssets'

export function PoolDetailsDeRwa() {
  const { showPoolReserves } = useDebugFlags()
  return (
    <>
      <PoolPerformanceChart />
      <PoolUnderlyingAssets />
      {showPoolReserves && <PoolReserves />}
    </>
  )
}
