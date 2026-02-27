import { Balance, Price } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'
import { formatUnits, type Address } from 'viem'

export type FormattableBalance = Balance | Price | string | number | bigint

export interface FormatBalanceOptions {
  precision?: number
  tokenDecimals?: number
  useGrouping?: boolean
  currency?: string
  notation?: 'standard' | 'compact'
}

export function truncateAddress(string: Address | string, start = 7, end = 7) {
  if (!string) return ''
  const first = string.slice(0, start)
  const last = string.slice(-end)

  return `${first}...${last}`
}

export function formatPercentage(amount: number, includeSymbol = true, locale = 'en', decimals = 2) {
  const formattedAmount = amount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return includeSymbol ? `${formattedAmount}%` : formattedAmount
}

export function formatBalanceAbbreviated(
  decimalVal: number | Decimal | string,
  displayDecimals = 1,
  currency?: string
): string {
  let val: Decimal
  if (typeof decimalVal === 'number' || typeof decimalVal === 'string') {
    val = new Decimal(decimalVal.toString())
  } else {
    val = decimalVal as Decimal
  }

  const amountNumber = val.toNumber()
  const absVal = Math.abs(amountNumber)
  let formattedAmount = ''

  if (absVal >= 1e9) {
    formattedAmount = `${(amountNumber / 1e9).toFixed(displayDecimals)}B`
  } else if (absVal >= 1e6) {
    formattedAmount = `${(amountNumber / 1e6).toFixed(displayDecimals)}M`
  } else if (absVal >= 1e3) {
    formattedAmount = `${(amountNumber / 1e3).toFixed(displayDecimals)}K`
  } else {
    const rounded = val.toFixed(displayDecimals)
    const parts = rounded.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formattedAmount = parts.join('.')
  }

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

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

function formatCompactNumber(decimal: Decimal, precision: number): string {
  const abs = decimal.abs()

  if (abs.gte(1e15)) return `${decimal.div(1e15).toFixed(precision)}Q`
  if (abs.gte(1e12)) return `${decimal.div(1e12).toFixed(precision)}T`
  if (abs.gte(1e9)) return `${decimal.div(1e9).toFixed(precision)}B`
  if (abs.gte(1e6)) return `${decimal.div(1e6).toFixed(precision)}M`
  if (abs.gte(1e3)) return `${decimal.div(1e3).toFixed(precision)}K`

  return decimal.toFixed(precision)
}

function trimTrailingZeros(str: string, minDecimals: number): string {
  const [int, frac = ''] = str.split('.')
  if (!frac) return int

  const trimmed = frac.replace(/0+$/, '')
  const kept = trimmed.padEnd(minDecimals, '0').slice(0, Math.max(trimmed.length, minDecimals))

  return kept ? `${int}.${kept}` : int
}

export function formatBigintToString(bigInt: bigint, bigintDecimals: number, formatDecimals?: number) {
  const decimals = formatDecimals || bigintDecimals
  return Number(formatUnits(bigInt, bigintDecimals)).toFixed(decimals)
}

export function ipfsToHttp(uri: string, gateway: string | string[]): string {
  const gateways = (Array.isArray(gateway) ? gateway : [gateway]).filter(Boolean).map((g) => g.replace(/\/+$/, ''))

  const build = (prefix: 'ipfs' | 'ipns', path: string) => `${gateways[0]}/${prefix}/${path.replace(/^\/+/, '')}`

  if (uri.startsWith('ipfs://')) return build('ipfs', uri.slice(7))
  if (uri.startsWith('ipns://')) return build('ipns', uri.slice(7))

  const m = uri.match(/^https?:\/\/[^/]+\/(ipfs|ipns)\/(.+)$/i)
  if (m) return build(m[1].toLowerCase() as 'ipfs' | 'ipns', m[2])

  if (uri.startsWith('/ipfs/') || uri.startsWith('/ipns/')) {
    return `${gateways[0]}${uri}`
  }

  return uri
}
