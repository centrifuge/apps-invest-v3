import { useMemo } from 'react'
import { usePoolContext } from '@contexts/PoolContext'
import { useIsUserWhitelisted } from '@hooks/useIsUserWhitelisted'
import aaveLogo from '@assets/logos/aave.svg'
import aerodromeLogo from '@assets/logos/aerodrome.svg'
import morphoLogo from '@assets/logos/morpho.svg'
import { base, mainnet } from 'viem/chains'

export type IntegrationType = 'DEX' | 'Collateral'

export interface PoolIntegration {
  name: string
  icon: string
  type: IntegrationType
  url: string
  chainIds: number[]
}

interface PoolConfig {
  name: string
  isProduction: boolean
  isRwa: boolean
  isDeRwa: boolean
  isRestricted: boolean
  chronicleIpfsUri?: string
  hasTradingWidget?: boolean
  integrations?: PoolIntegration[]
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
    integrations: [
      {
        name: 'Aave Horizon Market',
        icon: aaveLogo,
        type: 'Collateral',
        url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x8c213ee79581ff4984583c6a801e5263418c4b86&marketName=proto_horizon_v3',
        chainIds: [mainnet.id],
      },
    ],
  },
  '281474976710663': {
    name: 'JAAA',
    isProduction: true,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
    integrations: [
      {
        name: 'Aave Horizon Market',
        icon: aaveLogo,
        type: 'Collateral',
        url: 'https://app.aave.com/reserve-overview/?underlyingAsset=0x5a0f93d040de44e78f251b03c43be9cf317dcf64&marketName=proto_horizon_v3',
        chainIds: [mainnet.id],
      },
    ],
  },
  '281474976710664': {
    name: 'ACRDX',
    isProduction: true,
    isRwa: true,
    isDeRwa: false,
    isRestricted: false,
    integrations: [
      {
        name: 'Morpho Market',
        icon: morphoLogo,
        type: 'Collateral',
        url: 'https://app.morpho.org/ethereum/market/0x8d8ab648ffa225f0b6af1c7de5d6bc5f6711771eaa8d48ce6efd83d40281da73/acrdx-usdc',
        chainIds: [mainnet.id],
      },
    ],
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
    hasTradingWidget: true,
    integrations: [
      {
        name: 'Aerodrome Pool',
        icon: aerodromeLogo,
        type: 'DEX',
        url: 'https://aerodrome.finance/swap?from=0xaaa0008c8cf3a7dca931adaf04336a5d808c82cc&to=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&chain0=8453&chain1=8453',
        chainIds: [base.id],
      },
    ],
  },
  '281474976710660': {
    name: 'deJTRSY',
    isProduction: true,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
  },
  '281474976710667': {
    name: 'deCRDX',
    isProduction: true,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
  },
  '281474976710668': {
    name: 'DeFi SPXA Token',
    isProduction: true,
    isRwa: false,
    isDeRwa: true,
    isRestricted: false,
    hasTradingWidget: true,
    integrations: [
      {
        name: 'Aerodrome Pool',
        icon: aerodromeLogo,
        type: 'DEX',
        url: 'https://aerodrome.finance/swap?from=0x9c5c365e764829876243d0b289733b9d2b729685&to=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&chain0=8453&chain1=8453',
        chainIds: [base.id],
      },
    ],
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
  '281474976711006': {
    name: 'poduction coin one',
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

const isTestnet = import.meta.env.VITE_CENTRIFUGE_ENV !== 'mainnet'

const DEFAULT_TESTNET_POOL_CONFIG: PoolConfig = {
  name: '',
  isProduction: false,
  isRwa: true,
  isDeRwa: false,
  isRestricted: false,
}

const getPoolConfig = (poolId: string): PoolConfig | undefined =>
  POOL_REGISTRY[poolId] ?? (isTestnet ? DEFAULT_TESTNET_POOL_CONFIG : undefined)

const poolIds = Object.keys(POOL_REGISTRY)
const productionPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isProduction)
const rwaPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isRwa)
const deRwaPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isDeRwa)
const restrictedPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].isRestricted)
const chroniclePoolIds = poolIds.filter((id) => POOL_REGISTRY[id].chronicleIpfsUri)
const tradingWidgetPoolIds = poolIds.filter((id) => POOL_REGISTRY[id].hasTradingWidget)

export function useGetPoolsByIds() {
  const { poolId } = usePoolContext()
  const { isWhitelisted } = useIsUserWhitelisted()

  const isRestrictedPool = useMemo(
    () => restrictedPoolIds.includes(poolId ?? '0') && !isWhitelisted,
    [poolId, isWhitelisted]
  )

  const getIsProductionPool = (poolId?: string) => (poolId ? (getPoolConfig(poolId)?.isProduction ?? false) : false)
  const getIsRestrictedPool = (poolId?: string) =>
    poolId ? (getPoolConfig(poolId)?.isRestricted ?? false) && !isWhitelisted : false
  const getIsRwaPool = (poolId?: string) => (poolId ? (getPoolConfig(poolId)?.isRwa ?? false) : false)
  const getIsDeRwaPool = (poolId?: string) => (poolId ? (getPoolConfig(poolId)?.isDeRwa ?? false) : false)
  const getIsChroniclePool = (poolId?: string) => (poolId ? chroniclePoolIds.includes(poolId) : false)
  const getChroniclePoolIpfsUri = (poolId: string) => POOL_REGISTRY[poolId]?.chronicleIpfsUri
  const getIsTradingWidgetPool = (poolId?: string) =>
    poolId ? (POOL_REGISTRY[poolId]?.hasTradingWidget ?? false) : false
  const getPoolIntegrations = (poolId?: string): PoolIntegration[] =>
    poolId ? (getPoolConfig(poolId)?.integrations ?? []) : []

  return {
    chroniclePoolIds,
    deRwaPoolIds,
    rwaPoolIds,
    productionPoolIds,
    restrictedPoolIds,
    tradingWidgetPoolIds,
    isRestrictedPool,
    getChroniclePoolIpfsUri,
    getIsChroniclePool,
    getIsDeRwaPool,
    getIsRwaPool,
    getIsProductionPool,
    getIsRestrictedPool,
    getIsTradingWidgetPool,
    getPoolIntegrations,
  }
}
