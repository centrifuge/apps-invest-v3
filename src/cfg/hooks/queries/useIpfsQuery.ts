import { keccak256 } from 'js-sha3'
import { ipfsToHttp } from '@cfg'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export function useIpfsQuery<T = any>(uri: string | null, gateways?: string[]): UseQueryResult<T> {
  return useQuery({
    queryKey: ['ipfs', uri],
    queryFn: async () => {
      if (!uri) throw new Error('IPFS URI is required')
      return fetchIpfsJson<T>(uri, gateways)
    },
    enabled: !!uri,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export async function fetchIpfsJson<T = any>(uri: string, gateways: string[] = ['https://ipfs.io']): Promise<T> {
  const url = ipfsToHttp(uri, gateways)

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`Failed to fetch IPFS data (${res.status}): ${res.statusText}`)
  }

  const json = await res.json()

  // verify checksum if present
  const match = uri.match(/checksum=(0x[0-9a-fA-F]+)/)
  if (match) {
    const expectedChecksum = match[1].toLowerCase()
    const actualChecksum = `0x${keccak256(JSON.stringify(json))}`
    if (actualChecksum !== expectedChecksum) {
      throw new Error(`Checksum mismatch: expected ${expectedChecksum} but received ${actualChecksum}`)
    }
  }

  return json
}
