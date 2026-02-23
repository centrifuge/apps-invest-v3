import { Balance, Price } from '@centrifuge/sdk'

type DecimalLike = ReturnType<Balance['toDecimal']>

export function priceToString(price: Price): string {
  const bigIntValue = price.toBigInt()
  const bigIntString = bigIntValue.toString().padStart(19, '0')
  const intPart = bigIntString.slice(0, -18) || '0'
  const decimalPart = bigIntString.slice(-18)
  return `${intPart}.${decimalPart}`
}

export function balanceToString(balance: Balance): string {
  const bigIntValue = balance.toBigInt()
  const decimals = balance.decimals
  const bigIntString = bigIntValue.toString().padStart(decimals + 1, '0')
  const intPart = bigIntString.slice(0, -decimals) || '0'
  const decimalPart = bigIntString.slice(-decimals)
  return `${intPart}.${decimalPart}`
}

export function decimalToBalance(decimal: DecimalLike, decimals: number): Balance {
  const scaledDecimal = decimal.mul(10 ** decimals)
  const bigIntValue = BigInt(scaledDecimal.toFixed(0))
  return new Balance(bigIntValue, decimals)
}

export function decimalToPrice(decimal: DecimalLike): Price {
  const scaledDecimal = decimal.mul(10 ** 18)
  const bigIntValue = BigInt(scaledDecimal.toFixed(0))
  return new Price(bigIntValue)
}

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

export function scaleBalanceDecimals(balance: Balance, targetDecimals: number): Balance {
  if (targetDecimals === balance.decimals) return balance

  const decimal = balance.toDecimal()
  const scaled = decimal.mul(10 ** targetDecimals)
  const rounded = scaled.toDecimalPlaces(0)
  const bigIntValue = BigInt(rounded.toFixed(0))

  return new Balance(bigIntValue, targetDecimals)
}

export function divideBalanceByPrice(balance: Balance, price: Price): Balance {
  const balanceBigInt = balance.toBigInt()
  const priceBigInt = price.toBigInt()

  // Scale up by price decimals (18) before division to preserve precision
  const scaled = balanceBigInt * 10n ** 18n
  const resultBigInt = scaled / priceBigInt

  return new Balance(resultBigInt, balance.decimals)
}
