export const routePaths = {
  home: '/',
  poolPage: '/pool',
}

/**
 * Generate a vault-specific URL path
 * @param poolId - The pool ID
 * @param network - The network name (e.g., 'ethereum', 'base')
 * @param asset - The vault contract address (e.g., '0x1234...') or asset symbol for legacy URLs
 * @returns The full path (e.g., '/pool/123/ethereum/0x1234...')
 */
export function getVaultPath(poolId: string, network: string, asset: string): string {
  return `${routePaths.poolPage}/${poolId}/${network.toLowerCase()}/${asset.toLowerCase()}`
}
