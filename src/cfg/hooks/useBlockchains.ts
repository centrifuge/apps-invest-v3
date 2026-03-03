import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { firstValueFrom } from 'rxjs'
import { useCentrifuge } from './CentrifugeContext'
import { queryKeys } from './queries/queryKeys'

export interface Blockchain {
  explorer: string | null
  chainId: number
  centrifugeId: number
  icon: string | null
  name: string
  network: string
}

export function useBlockchains() {
  const centrifuge = useCentrifuge()
  return useQuery({
    queryKey: queryKeys.blockchains(),
    queryFn: () => firstValueFrom(centrifuge.blockchains()),
  })
}

export function useBlockchainByCentrifugeId(centrifugeId?: number) {
  const { data: blockchains, ...rest } = useBlockchains()

  const blockchain = useMemo(() => {
    if (!blockchains || centrifugeId === undefined) return undefined
    return blockchains.find((b) => b.centrifugeId === centrifugeId)
  }, [blockchains, centrifugeId])

  return { data: blockchain, ...rest }
}

export function useBlockchainByChainId(chainId?: number) {
  const { data: blockchains, ...rest } = useBlockchains()

  const blockchain = useMemo(() => {
    if (!blockchains || chainId === undefined) return undefined
    return blockchains.find((b) => b.chainId === chainId)
  }, [blockchains, chainId])

  return { data: blockchain, ...rest }
}

export function useBlockchainsMapByCentrifugeId() {
  const { data: blockchains, ...rest } = useBlockchains()

  const blockchainsMap = useMemo((): Map<number, Blockchain> => {
    const map = new Map<number, Blockchain>()
    if (blockchains) {
      for (const b of blockchains) {
        map.set(b.centrifugeId, b)
      }
    }
    return map
  }, [blockchains])

  return { data: blockchainsMap, ...rest }
}

export function useBlockchainsMapByChainId() {
  const { data: blockchains, ...rest } = useBlockchains()

  const blockchainsMap = useMemo((): Map<number, Blockchain> => {
    const map = new Map<number, Blockchain>()
    if (blockchains) {
      for (const b of blockchains) {
        map.set(b.chainId, b)
      }
    }
    return map
  }, [blockchains])

  return { data: blockchainsMap, ...rest }
}
