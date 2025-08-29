import Decimal from 'decimal.js-light'

/**
 * Formats a BigInt balance into a decimal string for display.
 * @param {bigint} value - The raw BigInt value (e.g., 9901n).
 * @param {number} decimals - The number of decimal places (e.g., 6).
 * @returns {string} The formatted string (e.g., "0.009901").
 */
export function formatDisplayBalance(rawValue: bigint, decimals: number) {
  const valueAsDecimal = new Decimal(rawValue.toString())
  const finalDecimal = valueAsDecimal.div(new Decimal(10).pow(decimals))
  return finalDecimal.toFixed(decimals)
}
