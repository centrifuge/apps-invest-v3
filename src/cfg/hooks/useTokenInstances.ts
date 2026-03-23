import { useCentrifuge } from './CentrifugeContext'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queries/queryKeys'
import { firstValueWithTimeout } from './utils'
import { HexString, Price } from '@centrifuge/sdk'

const TOKEN_INSTANCES_STALE_TIME = 5 * 60 * 1000

interface RawTokenInstance {
  address: string
  centrifugeId: string
  tokenId: string
  tokenPrice: string
}

export interface TokenInstance {
  address: HexString
  centrifugeId: number
  tokenId: string
  tokenPrice: Price
}

function transformTokenInstance(item: RawTokenInstance): TokenInstance {
  return {
    address: item.address as HexString,
    centrifugeId: Number(item.centrifugeId),
    tokenId: item.tokenId,
    tokenPrice: new Price(BigInt(item.tokenPrice ?? '0')),
  }
}

export function useTokenInstances(addresses: HexString[]) {
  const centrifuge = useCentrifuge()
  const sortedAddresses = [...addresses].sort()

  return useQuery({
    queryKey: queryKeys.tokenInstances(sortedAddresses),
    queryFn: () =>
      firstValueWithTimeout(
        centrifuge._queryIndexer<{ tokenInstances: { items: RawTokenInstance[] } }>(
          `query ($addresses: [String!]!) {
            tokenInstances(where: { address_in: $addresses }) {
              items {
                tokenId
                tokenPrice
                centrifugeId
                address
              }
            }
          }`,
          { addresses: sortedAddresses }
        )
      ),
    enabled: sortedAddresses.length > 0,
    staleTime: TOKEN_INSTANCES_STALE_TIME,
    select: (data) => data.tokenInstances.items.map(transformTokenInstance),
  })
}
