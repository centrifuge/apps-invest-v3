import { useMemo } from 'react'
import { useObservable } from './useObservable'
import { useCentrifuge } from './CentrifugeContext'

export const useAssets = (spokeChainId?: number, hubChainId?: number) => {
  const centrifuge = useCentrifuge()

  const asset$ = useMemo(() => {
    if (!spokeChainId) return undefined
    return hubChainId
      ? centrifuge.assets(Number(spokeChainId), Number(hubChainId))
      : centrifuge.assets(Number(spokeChainId))
  }, [spokeChainId, hubChainId])

  return useObservable(asset$)
}

export const useAssetValuation = (chainId: number) => {
  const centrifuge = useCentrifuge()

  const assetValuation$ = useMemo(() => {
    if (!chainId) return undefined
    return centrifuge.valuations(Number(chainId))
  }, [chainId])

  return useObservable(assetValuation$)
}
