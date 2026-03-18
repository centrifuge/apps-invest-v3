import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { Pool, PoolId, PoolNetwork, ShareClassId } from '@centrifuge/sdk'
import {
  getNetworkSlug,
  Holdings,
  isValidNetworkSlug,
  NetworkSlug,
  PoolDetails,
  ShareClassWithDetails,
  useBlockchainsMapByCentrifugeId,
  useBlockchainsMapByChainId,
  useHoldings,
  usePool,
  usePoolActiveNetworks,
  usePoolDetails,
  usePools,
} from '@cfg'
import { type ActiveTab, POOL_TABLE_TABS } from '@components/pools/poolTable/types'
import { getPoolTVL } from '@utils/getPoolTVL'

const PoolContext = createContext<
  | {
      activeHomeTab: ActiveTab
      assetFromUrl: string | undefined
      connectedChainId: number | undefined
      holdings?: Holdings
      isLoading: boolean
      isNetworksLoading: boolean
      isPoolsLoading: boolean
      isPoolDataReady: boolean
      isPoolDetailsLoading: boolean
      isHoldingsLoading: boolean
      network: PoolNetwork | undefined
      networkFromUrl: NetworkSlug | undefined
      networks: PoolNetwork[] | undefined
      pool: Pool | undefined
      poolId: string | undefined
      pools: Pool[] | undefined
      poolDetails: PoolDetails | undefined
      poolTVL: string | undefined
      selectedPoolId: PoolId | undefined
      shareClass: ShareClassWithDetails | undefined
      shareClassId: ShareClassId | undefined
      setActiveHomeTab: (tab: ActiveTab) => void
    }
  | undefined
>(undefined)

export const PoolProvider = ({ children }: { children: ReactNode }) => {
  const { data: pools, isLoading: isPoolsLoading } = usePools()
  const { data: blockchainsMapByChainId } = useBlockchainsMapByChainId()
  const { data: blockchainsMapByCentrifugeId } = useBlockchainsMapByCentrifugeId()
  const connectedChainId = useChainId()
  const [activeHomeTab, setActiveHomeTab] = useState<ActiveTab>(POOL_TABLE_TABS.products)

  const { poolId, network: networkParam, asset: assetParam } = useParams()

  // Derive selectedPoolId synchronously from URL params + pools data.
  const selectedPoolId = useMemo((): PoolId | undefined => {
    if (!pools?.length) return undefined
    if (poolId) {
      return pools.find((pool) => pool.id.toString() === poolId)?.id ?? pools[0]?.id
    }
    return undefined
  }, [pools, poolId])

  const { data: pool, isLoading: isPoolLoading } = usePool(selectedPoolId, { enabled: !!selectedPoolId })

  const { data: poolDetails, isLoading: isPoolDetailsLoading } = usePoolDetails(selectedPoolId, {
    enabled: !!selectedPoolId,
  })
  const { data: networks, isLoading: isNetworksLoading } = usePoolActiveNetworks(poolDetails?.id, {
    enabled: !!selectedPoolId,
  })

  const shareClass = poolDetails?.shareClasses?.[0]
  const shareClassId = shareClass?.shareClass.id
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass?.shareClass, {
    enabled: !!selectedPoolId,
  })

  const networkFromUrl = useMemo((): NetworkSlug | undefined => {
    if (!networkParam) return undefined
    const normalizedNetwork = networkParam.toLowerCase()
    return isValidNetworkSlug(normalizedNetwork) ? normalizedNetwork : undefined
  }, [networkParam])

  const assetFromUrl = useMemo((): string | undefined => {
    return assetParam?.toLowerCase()
  }, [assetParam])

  // Derive network synchronously from networks + URL/wallet state.
  // Priority: 1) URL slug match, 2) connected wallet chain, 3) first available.
  const network = useMemo((): PoolNetwork | undefined => {
    if (!networks?.length) return undefined

    if (networkFromUrl && blockchainsMapByCentrifugeId) {
      const matchingNetwork = networks.find((n) => {
        const blockchain = blockchainsMapByCentrifugeId.get(n.centrifugeId)
        if (!blockchain) return false
        return getNetworkSlug(blockchain.chainId) === networkFromUrl
      })
      if (matchingNetwork) return matchingNetwork
    }

    if (connectedChainId && blockchainsMapByChainId) {
      const connectedCentrifugeId = blockchainsMapByChainId.get(connectedChainId)?.centrifugeId
      const connectedNetwork = networks.find((n) => n.centrifugeId === connectedCentrifugeId)
      if (connectedNetwork) return connectedNetwork
    }

    return networks[0]
  }, [networks, networkFromUrl, connectedChainId, blockchainsMapByChainId, blockchainsMapByCentrifugeId])

  // Checks that both selectedPoolId and network.pool have been updated on pool page load
  const paramsPoolId = BigInt(poolId ?? 0)
  const isPoolDataReady = selectedPoolId?.raw === paramsPoolId && network?.pool.id.raw === paramsPoolId

  const poolTVL = getPoolTVL(poolDetails as PoolDetails | undefined)

  const isLoading = isPoolsLoading || isHoldingsLoading || isPoolLoading || isPoolDetailsLoading || isNetworksLoading

  return (
    <PoolContext.Provider
      value={{
        activeHomeTab,
        assetFromUrl,
        connectedChainId,
        holdings,
        isHoldingsLoading,
        isLoading,
        isPoolsLoading,
        isPoolDataReady,
        isNetworksLoading,
        isPoolDetailsLoading,
        network,
        networkFromUrl,
        networks,
        pool,
        poolId,
        pools,
        poolDetails: poolDetails as PoolDetails,
        poolTVL,
        selectedPoolId,
        shareClass,
        shareClassId,
        setActiveHomeTab,
      }}
    >
      {children}
    </PoolContext.Provider>
  )
}

export const usePoolContext = () => {
  const context = useContext(PoolContext)
  if (!context) {
    throw new Error('usePoolContext must be used within a PoolProvider')
  }
  return context
}
