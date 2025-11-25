/**
 * Detects the type of blockchain address
 * @param address
 * @returns 'evm' | 'solana' | null
 */
export function detectAddressType(address: string): 'evm' | 'solana' | null {
  if (!address) return null

  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return 'evm'
  }

  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return 'solana'
  }

  return null
}

/**
 * Validates if an address is a valid EVM address
 * @param address
 * @returns boolean
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validates if an address is a valid Solana address
 * @param address
 * @returns boolean
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

/**
 * Truncates a wallet address
 * @param address
 * @returns Truncated address string
 */
export function truncateAddress(address: string): string {
  if (!address) return ''

  const first = address.slice(0, 6)
  const last = address.slice(-4)
  return `${first}...${last}`
}
