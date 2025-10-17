import { useMemo } from 'react'
import { usePoolContext } from '@contexts/PoolContext'
import { useIsUserWhitelisted } from '@hooks/useIsUserWhitelisted'

const RWA_POOLS = {
  // Production accounts
  '281474976710662': 'JTRSY',
  '281474976710663': 'JAAA',
  '281474976710664': 'ACRDX',
  '281474976710665': 'SPXA',
  // test accounts
  '281474976710657': 'Sepolia Janus Henderson Anemoy Treasury Fund',
} as const

const DE_RWA_POOLS = {
  // Production accounts
  '281474976710659': 'deJAAA',
  '281474976710660': 'deJTRSY',
  // test accounts
  '281474976710658': 'Sepolia Anemoy Treasury Fund',
  '562949953421313': 'Base Sepolia Test Pool',
  '562949953421314': 'Base Sepolia Test Pool',
} as const

const RESTRICTED_POOLS = {
  '281474976710665': 'SPXA',
  // test accounts
  '281474976710657': 'Sepolia Janus Henderson Anemoy Treasury Fund',
} as const

const PRODUCTION_POOLS = {
  '281474976710659': 'deJAAA',
  '281474976710660': 'deJTRSY',
  '281474976710662': 'JTRSY',
  '281474976710663': 'JAAA',
  '281474976710664': 'ACRDX',
  '281474976710665': 'SPXA',
} as const

export function useGetPoolsByIds() {
  const { poolId } = usePoolContext()
  const { isWhitelisted } = useIsUserWhitelisted()
  const productionPoolIds = Object.keys(PRODUCTION_POOLS)
  const rwaPoolIds = Object.keys(RWA_POOLS)
  const deRwaPoolIds = Object.keys(DE_RWA_POOLS)
  const restrictedPoolIds = Object.keys(RESTRICTED_POOLS)
  const isRestrictedPool = useMemo(
    () => restrictedPoolIds.includes(poolId ?? '0') && !isWhitelisted,
    [poolId, isWhitelisted]
  )
  const getIsProductionPool = (poolId?: string) => (poolId ? productionPoolIds.includes(poolId) : false)
  const getIsRestrictedPool = (poolId?: string) =>
    poolId ? restrictedPoolIds.includes(poolId) && !isWhitelisted : false

  const getIsRwaPool = (poolId?: string) => (poolId ? rwaPoolIds.includes(poolId) : false)
  const getIsDeRwaPool = (poolId?: string) => (poolId ? deRwaPoolIds.includes(poolId) : false)

  return {
    deRwaPoolIds,
    rwaPoolIds,
    productionPoolIds,
    restrictedPoolIds,
    isRestrictedPool,
    getIsDeRwaPool,
    getIsRwaPool,
    getIsProductionPool,
    getIsRestrictedPool,
  }
}
