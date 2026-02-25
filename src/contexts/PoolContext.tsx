import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Pool, PoolId, PoolNetwork, ShareClassId } from '@centrifuge/sdk'
import {
  Holdings,
  isValidNetwork,
  Network,
  PoolDetails,
  ShareClassWithDetails,
  useBlockchainsMapByCentrifugeId,
  useBlockchainsMapByChainId,
  useHoldings,
  usePool,
  usePoolActiveNetworks,
  usePoolDetails,
  usePoolsQuery,
} from '@cfg'
import { useParams } from 'react-router-dom'
import { getPoolTVL } from '@utils/getPoolTVL'
import { useChainId } from 'wagmi'

const PoolContext = createContext<
  | {
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
      networkFromUrl: Network | undefined
      networks: PoolNetwork[] | undefined
      pool: Pool | undefined
      poolId: string | undefined
      pools: Pool[] | undefined
      poolDetails: PoolDetails | undefined
      poolTVL: string | undefined
      selectedPoolId: PoolId | undefined
      shareClass: ShareClassWithDetails | undefined
      shareClassId: ShareClassId | undefined
      setSelectedPoolId: (poolId: PoolId) => void
    }
  | undefined
>(undefined)

export const PoolProvider = ({ children }: { children: ReactNode }) => {
  const { data: pools, isLoading: isPoolsLoading } = usePoolsQuery()
  const { data: blockchainsMapByChainId } = useBlockchainsMapByChainId()
  const { data: blockchainsMapByCentrifugeId } = useBlockchainsMapByCentrifugeId()
  const connectedChainId = useChainId()
  const [network, setNetwork] = useState<PoolNetwork | undefined>(undefined)
  const [selectedPoolId, setSelectedPoolId] = useState<PoolId | undefined>(undefined)

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

  const { poolId, network: networkParam, asset: assetParam } = useParams()
  const currentPagePoolId = pools?.find((pool) => pool.id.toString() === poolId)?.id

  const networkFromUrl = useMemo((): Network | undefined => {
    if (!networkParam) return undefined
    const normalizedNetwork = networkParam.toLowerCase()
    return isValidNetwork(normalizedNetwork) ? normalizedNetwork : undefined
  }, [networkParam])

  const assetFromUrl = useMemo((): string | undefined => {
    return assetParam?.toLowerCase()
  }, [assetParam])

  // Checks that both selectedPoolId and network.pool have been updated on pool page load
  const paramsPoolId = BigInt(poolId ?? 0)
  const isPoolDataReady = selectedPoolId?.raw === paramsPoolId && network?.pool.id.raw === paramsPoolId

  const poolTVL = getPoolTVL(poolDetails as PoolDetails | undefined)

  useEffect(() => {
    if (!networks?.length) return

    if (networkFromUrl && blockchainsMapByCentrifugeId) {
      const matchingNetwork = networks.find((n) => {
        const blockchain = blockchainsMapByCentrifugeId.get(n.centrifugeId)
        return blockchain?.network === networkFromUrl
      })
      if (matchingNetwork) {
        if (matchingNetwork.centrifugeId !== network?.centrifugeId) {
          setNetwork(matchingNetwork)
        }
        return
      }
    }

    if (connectedChainId && blockchainsMapByChainId) {
      const connectedCentrifugeId = blockchainsMapByChainId.get(connectedChainId)?.centrifugeId
      const connectedNetwork = networks.find((n) => n.centrifugeId === connectedCentrifugeId)
      if (connectedNetwork && connectedNetwork.centrifugeId !== network?.centrifugeId) {
        setNetwork(connectedNetwork)
        return
      }
    }

    if (!network && networks[0]) {
      setNetwork(networks[0])
    }
  }, [
    networks,
    networkFromUrl,
    connectedChainId,
    blockchainsMapByChainId,
    blockchainsMapByCentrifugeId,
    network?.centrifugeId,
  ])

  // Track the last poolId from URL to detect navigation between pools
  const lastPoolIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!isPoolsLoading && pools?.length && poolId) {
      const poolIdChanged = poolId !== lastPoolIdRef.current

      if (poolIdChanged) {
        setNetwork(undefined)
        lastPoolIdRef.current = poolId
      }

      const urlPoolId = currentPagePoolId
      if (urlPoolId && selectedPoolId?.raw !== urlPoolId.raw) {
        setSelectedPoolId(urlPoolId)
      } else if (!selectedPoolId && pools[0]) {
        setSelectedPoolId(pools[0].id)
      }
    }
  }, [pools, isPoolsLoading, poolId, currentPagePoolId, selectedPoolId?.raw])

  const isLoading = isPoolsLoading || isHoldingsLoading || isPoolLoading || isPoolDetailsLoading || isNetworksLoading

  return (
    <PoolContext.Provider
      value={{
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
        setSelectedPoolId,
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
