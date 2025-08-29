import { usePoolContext } from '@contexts/usePoolContext'
import { useIsUserWhitelisted } from '@hooks/useIsUserWhitelisted'

const RWA_POOLS = {
  // Production accounts
  '281474976710662': 'Tokenized AAA CLO',
  '281474976710663': '',
  // test accounts
  '281474976710657': 'Sepolia Janus Henderson Anemoy Treasury Fund',
} as const

const DE_RWA_POOLS = {
  // Production accounts
  '281474976710659': '',
  '281474976710660': '',
  // test accounts
  '281474976710658': 'Sepolia Anemoy Treasury Fund',
  '562949953421313': 'Base Sepolia Test Pool',
  '562949953421314': 'Base Sepolia Test Pool',
} as const

const RESTRICTED_POOLS = {
  '': '',
} as const

export function useGetPoolsByIds() {
  const { poolId } = usePoolContext()
  const { isWhitelisted } = useIsUserWhitelisted()
  const productionPoolIds = ['281474976710659', '281474976710660', '281474976710662', '281474976710663']
  const rwaPoolIds = Object.keys(RWA_POOLS)
  const deRwaPoolIds = Object.keys(DE_RWA_POOLS)
  const restrictedPoolIds = Object.keys(RESTRICTED_POOLS)
  const isRestrictedPool = restrictedPoolIds.includes(poolId ?? '0') && !isWhitelisted

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
  }
}
