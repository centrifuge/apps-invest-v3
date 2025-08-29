import { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js'

/**
 * Parses a user's input string into a final `Balance` object for the SDK.
 * @param {string} inputValue - The string from the UI (e.g., "123.45").
 * @param {number} decimals - The number of decimals the currency uses.
 * @returns {Balance} The final Balance object for the SDK.
 */
export function parseBalance(inputValue: string, decimals: number) {
  if (!inputValue || typeof inputValue !== 'string') {
    return new Balance(0n, decimals)
  }

  const inputAsDecimal = new Decimal(inputValue.trim())
  const rawBigInt = BigInt(inputAsDecimal.mul(new Decimal(10).pow(decimals)).toFixed(0))

  const finalBalance = new Balance(rawBigInt, decimals)

  return finalBalance
}
