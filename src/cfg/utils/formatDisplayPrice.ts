import { Price } from '@centrifuge/sdk'

export function formatDisplayPrice(
  p: Price | null | undefined,
  precision = 2,
  currency?: string,
  useGrouping = true
): string {
  if (!p) {
    const zeros = '0.' + '0'.repeat(precision)
    return currency ? `${zeros} ${currency}` : zeros
  }

  const decimalValue = p.toDecimal()

  const formatted = decimalValue.toFixed(precision, 4)

  const [integerPart, fractionalPart = ''] = formatted.split('.')

  const integerWithGrouping = useGrouping ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : integerPart

  const result = fractionalPart ? `${integerWithGrouping}.${fractionalPart}` : integerWithGrouping

  return currency ? `${result} ${currency}` : result
}
