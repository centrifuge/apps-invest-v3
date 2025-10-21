import { ipfsToHttp } from '@cfg'
import { keccak256 } from 'js-sha3'

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
