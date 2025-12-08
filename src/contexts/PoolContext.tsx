import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Pool, PoolId, PoolNetwork, ShareClassId } from '@centrifuge/sdk'
import {
  Holdings,
  PoolDetails,
  ShareClassWithDetails,
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
      connectedChainId: number | undefined
      holdings?: Holdings
      isLoading: boolean
      isNetworksLoading: boolean
      isPoolsLoading: boolean
      isPoolDataReady: boolean
      isPoolDetailsLoading: boolean
      isHoldingsLoading: boolean
      network: PoolNetwork | undefined
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

  // In MVP we assume one share class per pool
  const shareClass = poolDetails?.shareClasses?.[0]
  const shareClassId = shareClass?.shareClass.id
  const { data: holdings, isLoading: isHoldingsLoading } = useHoldings(shareClass?.shareClass, {
    enabled: !!selectedPoolId,
  })

  const { poolId } = useParams()
  const currentPagePoolId = pools?.find((pool) => pool.id.toString() === poolId)?.id
  // Checks that both selectedPoolId and network.pool have been updated on pool page load
  const paramsPoolId = BigInt(poolId ?? 0)
  const isPoolDataReady = selectedPoolId?.raw === paramsPoolId && network?.pool.id.raw === paramsPoolId

  const poolTVL = getPoolTVL(poolDetails as PoolDetails | undefined)

  useEffect(() => {
    if (networks?.length && connectedChainId) {
      const currentNetwork = networks.find((n) => n.chainId === connectedChainId)
      if (currentNetwork && currentNetwork !== network) {
        setNetwork(currentNetwork)
      }
    }
  }, [networks, connectedChainId, network])

  // Use a ref to track if we've already set the initial pool ID
  const hasSetInitialPoolRef = useRef(false)

  useEffect(() => {
    if (!isPoolsLoading && !!pools) {
      if (pools?.length && !hasSetInitialPoolRef.current) {
        setSelectedPoolId(currentPagePoolId ?? pools[0].id)
        hasSetInitialPoolRef.current = true
      } else {
        hasSetInitialPoolRef.current = false
      }
    }
  }, [pools])

  const isLoading = isPoolsLoading || isHoldingsLoading || isPoolLoading || isPoolDetailsLoading || isNetworksLoading

  return (
    <PoolContext.Provider
      value={{
        connectedChainId,
        holdings,
        isHoldingsLoading,
        isLoading,
        isPoolsLoading,
        isPoolDataReady,
        isNetworksLoading,
        isPoolDetailsLoading,
        network,
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
