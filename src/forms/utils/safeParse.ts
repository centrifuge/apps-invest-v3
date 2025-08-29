import { Balance, Price } from '@centrifuge/sdk'
import { parseUnits } from 'viem'

import type { z } from 'zod'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type AmountInput = string | bigint | Balance | Price

// Grabs whatever value we give and converts into string so parseUnits can parse it
function toDecimalString(x: AmountInput, defaultDecimals: number): string {
  if (x instanceof Balance || x instanceof Price) {
    return x.toDecimal().toString()
  }
  if (typeof x === 'bigint') {
    return new Balance(x, defaultDecimals).toDecimal().toString()
  }
  return String(x ?? '').trim()
}

// String representation of the amount is parsed into bigint
export function parseToUnitsLossless(input: AmountInput, decimals: number): bigint {
  const s = toDecimalString(input, decimals)
  if (!s) return 0n

  return parseUnits(s, decimals)
}

export function safeParse<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  value?: DeepPartial<z.input<TSchema>>
): z.output<TSchema> | undefined {
  const result = schema.safeParse(value)

  if (!result.success) {
    return undefined
  }

  return result.data
}

// Avoids using JS numbers, so no precision loss
export function safeParseBalance(amount: AmountInput, decimals: number): Balance {
  const bi = parseToUnitsLossless(amount, decimals)
  return new Balance(bi, decimals)
}
