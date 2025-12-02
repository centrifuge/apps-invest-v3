import { useMemo } from 'react'
import { usePoolContext } from '@contexts/PoolContext'
import { useIsUserWhitelisted } from '@hooks/useIsUserWhitelisted'

const RWA_POOLS = {
  // Production accounts
  '281474976710662': 'AAA_CLO',
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
  '281474976710662': 'AAA_CLO',
  '281474976710663': 'JAAA',
  '281474976710664': 'ACRDX',
  '281474976710665': 'SPXA',
} as const

const CHRONICLE_POOLS: Record<string, { name: string; ipfsUri: string }> = {
  '281474976710662': {
    name: 'AAA_CLO',
    ipfsUri:
      'ipfs://QmPgCBS2mUzYoGd5Zx5DRRU8tyHqunEGVjHKvgDf29TnwK?checksum=0x39f63929f6e561825ddb6f8a1b84fdced7e30f879f40b03771d2119f9ee61d04',
  },
}

const SOLANA_POOLS = {
  '281474976710662': 'AAA_CLO',
} as const

export function useGetPoolsByIds() {
  const { poolId } = usePoolContext()
  const { isWhitelisted } = useIsUserWhitelisted()
  const productionPoolIds = Object.keys(PRODUCTION_POOLS)
  const rwaPoolIds = Object.keys(RWA_POOLS)
  const deRwaPoolIds = Object.keys(DE_RWA_POOLS)
  const restrictedPoolIds = Object.keys(RESTRICTED_POOLS)
  const chroniclePoolIds = Object.keys(CHRONICLE_POOLS)
  const solanaPoolIds = Object.keys(SOLANA_POOLS)
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
  const getChroniclePoolIpfsUri = (poolId: string) => CHRONICLE_POOLS[poolId].ipfsUri
  const getIsSolanaPool = (poolId?: string) => (poolId ? solanaPoolIds.includes(poolId) : false)

  return {
    deRwaPoolIds,
    rwaPoolIds,
    productionPoolIds,
    restrictedPoolIds,
    isRestrictedPool,
    chroniclePoolIds,
    solanaPoolIds,
    getIsDeRwaPool,
    getIsRwaPool,
    getIsProductionPool,
    getIsRestrictedPool,
    getIsChroniclePool,
    getChroniclePoolIpfsUri,
    getIsSolanaPool,
  }
}
