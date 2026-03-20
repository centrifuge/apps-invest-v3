import { PoolPerformanceChart } from '@components/pools/poolDetails/PoolPerformanceChart'
import { PoolReserves } from './PoolReserves'
import { PoolUnderlyingAssets } from './PoolUnderlyingAssets'

export function PoolDetailsDeRwa() {
  return (
    <>
      <PoolPerformanceChart />
      <PoolUnderlyingAssets />
      <PoolReserves />
    </>
  )
}
