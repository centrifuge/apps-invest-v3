import { chains } from '@centrifuge/sdk'

// Network type is derived from SDK chains - uses lowercase network name for URL compatibility
export type Network = string

const idToNetwork: Record<number, string> = {}
const idToDisplayName = new Map<number, string>()
const validNetworks = new Set<string>()

for (const chain of chains) {
  const centrifugeId = Number(chain.id)
  // Use lowercase network name for URL compatibility (e.g., "ethereum", "base")
  const networkName = chain.name.toLowerCase().replace(/\s+/g, '-')
  idToNetwork[centrifugeId] = networkName
  idToDisplayName.set(centrifugeId, chain.name)
  validNetworks.add(networkName)
}

export const NETWORK_IDS: Record<number, string> = idToNetwork
export const VALID_NETWORKS: string[] = Array.from(validNetworks)

export function isValidNetwork(name: string): name is Network {
  return VALID_NETWORKS.includes(name.toLowerCase())
}

export function getNetworkNameFromCentrifugeId(centrifugeId: number): Network | undefined {
  return NETWORK_IDS[centrifugeId]
}

export function formatNetworkName(network: Network): string {
  const specialCases: Record<string, string> = {
    bnb: 'BNB Chain',
    'bnb-chain': 'BNB Chain',
  }

  if (specialCases[network.toLowerCase()]) {
    return specialCases[network.toLowerCase()]
  }

  return network
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function networkToName(networkId: number): string {
  return idToDisplayName.get(networkId) ?? 'Unknown Network'
}
