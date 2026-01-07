import { Balance, Price } from '@centrifuge/sdk'

/**
 * Type for Decimal values returned from Balance.toDecimal()
 * This matches decimal.js-light used by the SDK
 */
type DecimalLike = ReturnType<Balance['toDecimal']>

/**
 * Safely converts a Decimal.js value to a Balance without precision loss.
 *
 * This helper avoids precision loss by:
 * 1. Scaling the decimal to the target number of decimals
 * 2. Converting to BigInt directly from string (no float conversion)
 * 3. Creating a Balance with the exact BigInt value
 *
 * @param decimal - The Decimal.js value to convert
 * @param decimals - The number of decimal places for the Balance
 * @returns A Balance with exact precision
 */
export function decimalToBalance(decimal: DecimalLike, decimals: number): Balance {
  const scaledDecimal = decimal.mul(10 ** decimals)
  const bigIntValue = BigInt(scaledDecimal.toFixed(0))
  return new Balance(bigIntValue, decimals)
}

/**
 * Safely converts a Decimal.js value to a Price without precision loss.
 * Price is a specialized Balance type that always uses 18 decimals.
 *
 * @param decimal - The Decimal.js value to convert
 * @returns A Price with exact precision (18 decimals)
 */
export function decimalToPrice(decimal: DecimalLike): Price {
  const scaledDecimal = decimal.mul(10 ** 18)
  const bigIntValue = BigInt(scaledDecimal.toFixed(0))
  return new Price(bigIntValue)
}

/**
 * Safely converts a string to Balance without float conversion.
 * This helper parses numeric strings directly to BigInt to avoid precision loss.
 *
 * @param value - The string value to parse (e.g., "123.456")
 * @param decimals - The number of decimal places for the Balance
 * @returns A Balance if parsing succeeds, null if invalid input
 */
export function stringToBalance(value: string, decimals: number): Balance | null {
  if (!value || value === '' || value === '.') return null

  try {
    const [intPart, fracPart] = value.split('.')
    const integer = intPart || '0'
    const fractional = (fracPart || '').padEnd(decimals, '0').slice(0, decimals)
    const bigIntValue = BigInt(integer + fractional)
    return new Balance(bigIntValue, decimals)
  } catch {
    return null
  }
}

/**
 * Safely converts a string to Price without float conversion.
 * Price is a specialized type that always uses 18 decimals.
 *
 * @param value - The string value to parse (e.g., "1.5")
 * @returns A Price if parsing succeeds, null if invalid input
 */
export function stringToPrice(value: string): Price | null {
  if (!value || value === '' || value === '.') return null

  try {
    const [intPart, fracPart] = value.split('.')
    const integer = intPart || '0'
    const fractional = (fracPart || '').padEnd(18, '0').slice(0, 18)
    const bigIntValue = BigInt(integer + fractional)
    return new Price(bigIntValue)
  } catch {
    return null
  }
}
