import { useMemo } from 'react'
import { usePoolContext } from '@contexts/PoolContext'
import { useIsUserWhitelisted } from '@hooks/useIsUserWhitelisted'
interface PoolConfig {
  name: string
  isProduction: boolean
  isRwa: boolean
  isDeRwa: boolean
  isRestricted: boolean
  chronicleIpfsUri?: string
}

const POOL_REGISTRY: Record<string, PoolConfig> = {
  // ===== Production RWA Pools =====
  '281474976710662': {
    name: 'JTRSY',
    isProduction: true,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
    chronicleIpfsUri:
      'ipfs://QmPgCBS2mUzYoGd5Zx5DRRU8tyHqunEGVjHKvgDf29TnwK?checksum=0x39f63929f6e561825ddb6f8a1b84fdced7e30f879f40b03771d2119f9ee61d04',
  },
  '281474976710663': {
    name: 'JAAA',
    isProduction: true,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },
  '281474976710664': {
    name: 'ACRDX',
    isProduction: true,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },
  '281474976710665': {
    name: 'SPXA',
    isProduction: true,
    isRwa: true,
    isDeRwa: false,
    isRestricted: true,
  },

  // ===== Production deRWA Pools =====
  '281474976710659': {
    name: 'deJAAA',
    isProduction: true,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
  },
  '281474976710660': {
    name: 'deJTRSY',
    isProduction: true,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
  },

  // ===== Test RWA Pools =====
  '281474976710657': {
    name: 'Sepolia Janus Henderson Anemoy Treasury Fund',
    isProduction: false,
    isRwa: true,
    isDeRwa: false,
    isRestricted: true,
  },
  '281474976710658': {
    name: 'Sepolia Anemoy Treasury Fund',
    isProduction: false,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },
  '281474976710668': {
    name: 'gSavings',
    isProduction: false,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },
  '562949953511312': {
    name: 'Adapter Axelar Async',
    isProduction: false,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },
  '281474976710999': {
    name: 'MIGRATION TEST POOL',
    isProduction: false,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },
  '281474976711656': {
    name: 'Katty test pool',
    isProduction: false,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
  },

  // ===== Test deRWA Pools =====
  '562949953421313': {
    name: 'Base Sepolia Test Pool',
    isProduction: false,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
  },
  '562949953421314': {
    name: 'Base Sepolia Test Pool',
    isProduction: false,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
  },
} as const

const poolIds = Object.keys(POOL_REGISTRY)
const productionPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isProduction)
const rwaPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isRwa)
const deRwaPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isDeRwa)
const restrictedPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isRestricted)
const chroniclePoolIds = poolIds.filter((id) => POOL_REGISTRY[id].chronicleIpfsUri)

export function useGetPoolsByIds() {
  const { poolId } = usePoolContext()
  const { isWhitelisted } = useIsUserWhitelisted()

  const isRestrictedPool = useMemo(
    () => restrictedPoolIds.includes(poolId ?? '0') && !isWhitelisted,
    [poolId, isWhitelisted]
  )

  const getIsProductionPool = (poolId?: string) => (poolId ? productionPoolIds.includes(poolId) : false)
  const getIsRestrictedPool = (poolId?: string) =>
    poolId ? restrictedPoolIds.includes(poolId) && !isWhitelisted : false
  const getIsRwaPool = (poolId?: string) => (poolId ? rwaPoolIds.includes(poolId) : false)
  const getIsDeRwaPool = (poolId?: string) => (poolId ? deRwaPoolIds.includes(poolId) : false)
  const getIsChroniclePool = (poolId?: string) => (poolId ? chroniclePoolIds.includes(poolId) : false)
  const getChroniclePoolIpfsUri = (poolId: string) => POOL_REGISTRY[poolId]?.chronicleIpfsUri

  return {
    chroniclePoolIds,
    deRwaPoolIds,
    rwaPoolIds,
    productionPoolIds,
    restrictedPoolIds,
    isRestrictedPool,
    getChroniclePoolIpfsUri,
    getIsChroniclePool,
    getIsDeRwaPool,
    getIsRwaPool,
    getIsProductionPool,
    getIsRestrictedPool,
  }
}
