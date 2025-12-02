import { Balance } from '@centrifuge/sdk'
import Decimal from 'decimal.js-light'
import { formatUnits, type Address } from 'viem'

export function truncateAddress(address: Address | string, start = 6, end = 4): string {
  if (!address) return ''

  const first = address.slice(0, start)
  const last = address.slice(-end)
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
  amount: number | Decimal | string | Balance,
  currency?: string,
  precision?: number,
  minPrecision = precision
): string {
  let val: Decimal

  if (typeof amount === 'number' || typeof amount === 'string') {
    val = new Decimal(amount.toString())
  } else if (amount instanceof Balance) {
    val = amount.toDecimal()
  } else if (amount instanceof Decimal) {
    val = amount
  } else {
    val = new Decimal(0)
  }

  const fixedDecimal = val.toDecimalPlaces(precision ?? undefined, Decimal.ROUND_DOWN)
  const decimalString = fixedDecimal.toString()
  const [integerPart, decimalPart = ''] = decimalString.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  let formattedDecimal = decimalPart
  if (precision !== undefined) {
    formattedDecimal = decimalPart.padEnd(precision, '0').slice(0, precision)
  }
  if (minPrecision !== undefined && formattedDecimal.length < minPrecision) {
    formattedDecimal = formattedDecimal.padEnd(minPrecision, '0')
  }

  const formattedAmount = formattedDecimal ? `${formattedInteger}.${formattedDecimal}` : formattedInteger

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

export function divideBigInts(numerator: bigint, denominator: bigint, decimals: number) {
  const scaledNumerator = numerator * 10n ** BigInt(decimals)
  const result = scaledNumerator / denominator

  return Object.assign(result, {
    formatToString: (bigintDecimals: number, formatDecimals?: number) =>
      formatBigintToString(result, bigintDecimals, formatDecimals),
  })
}

export function formatBigintToString(bigInt: bigint, bigintDecimals: number, formatDecimals?: number) {
  const decimals = formatDecimals || bigintDecimals
  return Number(formatUnits(bigInt, bigintDecimals)).toFixed(decimals)
}

export function formatBalanceToString(amount: Balance, precision?: number) {
  if (!(typeof amount === 'object' && 'decimals' in amount)) return ''

  const bigIntValue = amount.toBigInt()
  const decimals = amount.decimals
  const valueStr = bigIntValue.toString().padStart(decimals + 1, '0')
  const decimalIndex = valueStr.length - decimals
  const integerPart = valueStr.slice(0, decimalIndex)
  const fractionalPart = valueStr.slice(decimalIndex)
  const fullDecimalString = `${integerPart}.${fractionalPart}`

  // If no precision specified, return full precision string
  // You'll need this for setting max values in createBalanceValidation schemas
  if (precision === undefined) {
    return fullDecimalString
  }

  const decimalValue = new Decimal(fullDecimalString)
  const truncatedValue = decimalValue.toDecimalPlaces(precision, Decimal.ROUND_DOWN)

  return truncatedValue.toString()
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
