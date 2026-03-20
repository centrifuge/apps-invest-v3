import { PoolPerformanceChart } from '@components/pools/poolDetails/PoolPerformanceChart'
import { PoolUnderlyingAssets } from './PoolUnderlyingAssets'

export function PoolDetailsDeRwa() {
  return (
    <>
      <PoolPerformanceChart />
      <PoolUnderlyingAssets />
    </>
  )
}
