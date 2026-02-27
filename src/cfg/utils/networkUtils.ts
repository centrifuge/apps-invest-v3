import { chains } from '@centrifuge/sdk'

/**
 * Network slug utilities for URL-safe chain names.
 *
 * There are three chain identifiers in the app:
 *   1. EVM Chain ID (e.g., 1, 56, 42161) — from wagmi, viem, SDK chains[].id
 *   2. Centrifuge ID — internal SDK identifier from PoolNetwork.centrifugeId, Blockchain.centrifugeId
 *   3. Network slug (e.g., "ethereum", "bnb-smart-chain") — derived from chain.name for URLs
 *
 * This module provides bidirectional lookups between EVM Chain ID (#1) and slug (#3).
 * To go from Centrifuge ID (#2) to slug (#3), first use useBlockchainsMapByCentrifugeId
 * to get the EVM Chain ID, then use getNetworkSlug().
 */

// Slug is the URL-safe lowercase chain name (e.g., "ethereum", "bnb-smart-chain", "arbitrum-one")
export type NetworkSlug = string

const chainIdToSlug = new Map<number, string>()
const slugToChainId = new Map<string, number>()
const chainIdToDisplayName = new Map<number, string>()
const validSlugs = new Set<string>()

for (const chain of chains) {
  const chainId = Number(chain.id)
  const slug = chain.name.toLowerCase().replace(/\s+/g, '-')
  chainIdToSlug.set(chainId, slug)
  slugToChainId.set(slug, chainId)
  chainIdToDisplayName.set(chainId, chain.name)
  validSlugs.add(slug)
}

export const VALID_NETWORK_SLUGS: string[] = Array.from(validSlugs)

export function isValidNetworkSlug(name: string): name is NetworkSlug {
  return validSlugs.has(name.toLowerCase())
}

// Get the URL slug for an EVM chain ID (e.g., 42161 → "arbitrum-one")
export function getNetworkSlug(chainId: number): NetworkSlug | undefined {
  return chainIdToSlug.get(chainId)
}

// Get the EVM chain ID for a URL slug (e.g., "arbitrum-one" → 42161)
export function getChainIdFromSlug(slug: string): number | undefined {
  return slugToChainId.get(slug.toLowerCase())
}

// Get the display name for an EVM chain ID (e.g., 42161 → "Arbitrum One")
export function getDisplayName(chainId: number): string {
  return chainIdToDisplayName.get(chainId) ?? 'Unknown Network'
}

// Format a slug into a display name (e.g., "bnb-smart-chain" → "BNB Smart Chain")
export function formatNetworkName(slug: NetworkSlug): string {
  const chainId = slugToChainId.get(slug.toLowerCase())
  if (chainId !== undefined) {
    return chainIdToDisplayName.get(chainId) ?? slug
  }

  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
