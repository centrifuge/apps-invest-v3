import { Balance, Price } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'

export type FormattableBalance = Balance | Price | string | number | bigint

export interface FormatBalanceOptions {
  precision?: number
  tokenDecimals?: number
  useGrouping?: boolean
  currency?: string
  notation?: 'standard' | 'compact'
}

/**
 * Format a balance or price value for display
 */
export function formatBalance(
  value: FormattableBalance | null | undefined,
  options: FormatBalanceOptions = {}
): string {
  if (value == null) return '0.00'

  const { precision, tokenDecimals, useGrouping = true, currency, notation = 'standard' } = options

  try {
    let decimal: Decimal
    if (value instanceof Balance || value instanceof Price) {
      decimal = value.toDecimal()
    } else {
      decimal = new Decimal(String(value))
      if (tokenDecimals !== undefined) {
        decimal = decimal.div(new Decimal(10).pow(tokenDecimals))
      }
    }

    const maxDecimals = precision ?? 6
    const minDecimals = precision ?? 2
    decimal = decimal.toDecimalPlaces(maxDecimals, Decimal.ROUND_HALF_UP)

    let formatted: string
    if (notation === 'compact') {
      formatted = formatCompactNumber(decimal, minDecimals)
    } else {
      formatted = decimal.toFixed(maxDecimals)

      if (precision === undefined) {
        formatted = trimTrailingZeros(formatted, minDecimals)
      }

      // Add commas for thousands
      if (useGrouping) {
        const [int, frac] = formatted.split('.')
        const intWithCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        formatted = frac ? `${intWithCommas}.${frac}` : intWithCommas
      }
    }

    return currency ? `${formatted} ${currency}` : formatted
  } catch (err) {
    console.error('Failed to format balance:', value, err)
    return '0.00'
  }
}

/**
 * Format large numbers with K, M, B, T, Q suffixes
 */
function formatCompactNumber(decimal: Decimal, precision: number): string {
  const abs = decimal.abs()

  if (abs.gte(1e15)) return `${decimal.div(1e15).toFixed(precision)}Q`
  if (abs.gte(1e12)) return `${decimal.div(1e12).toFixed(precision)}T`
  if (abs.gte(1e9)) return `${decimal.div(1e9).toFixed(precision)}B`
  if (abs.gte(1e6)) return `${decimal.div(1e6).toFixed(precision)}M`
  if (abs.gte(1e3)) return `${decimal.div(1e3).toFixed(precision)}K`

  return decimal.toFixed(precision)
}

/**
 * Remove trailing zeros but keep minimum decimal places
 */
function trimTrailingZeros(str: string, minDecimals: number): string {
  const [int, frac = ''] = str.split('.')
  if (!frac) return int

  const trimmed = frac.replace(/0+$/, '')
  const kept = trimmed.padEnd(minDecimals, '0').slice(0, Math.max(trimmed.length, minDecimals))

  return kept ? `${int}.${kept}` : int
}
