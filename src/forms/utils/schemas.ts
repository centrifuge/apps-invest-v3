import { z, type ZodTypeAny, type ZodEffects } from 'zod'
import { Balance, Price } from '@centrifuge/sdk'
import { parseUnits } from 'viem'
import Decimal from 'decimal.js'

/** -------- Base Schemas -------- **/

/**
 * Base schema for validating number inputs.
 * Uses zod's preprocess to handle different input types.
 * It transforms the input into a number if it's a valid string, number, or bigint.
 * If the input is not valid, it returns undefined.
 */
export function numberInput<T extends ZodTypeAny>(schema: T): ZodEffects<T, z.infer<T>, string | number | bigint> {
  return z.preprocess((value) => {
    if ((typeof value === 'string' && value !== '' && !Number.isNaN(Number(value))) || typeof value === 'bigint') {
      return Number(value)
    }

    if (typeof value === 'number') {
      return value
    }

    return undefined
  }, schema) as ZodEffects<T, z.infer<T>, string | number | bigint>
}

/**
 * Uses the numberInput schema to validate that the number equals at least the min value.
 * It ensures that the input is a valid number, string, or bigint, and returns a number.
 */
export function numberInputMin(min: number, message?: string) {
  return numberInput(z.number().min(min, message ?? `Amount must be at least ${min}`))
}

/** -------- Balance Schemas -------- **/

/**
 * Parse a string or number into a BigInt value, accounting for decimals.
 * For example: "123.456" with decimals=18 → 123456000000000000000n
 */
function parseDecimalToBigInt(value: string | number, decimals: number): bigint {
  const strValue = typeof value === 'number' ? value.toString() : value
  const [intPart, fracPart] = strValue.split('.')
  const integer = intPart || '0'
  const fractional = (fracPart || '').padEnd(decimals, '0').slice(0, decimals)

  return BigInt(integer + fractional)
}

interface BalanceValidation {
  min?: bigint
  max?: bigint
}

export function createBalanceSchema(
  decimals: number,
  validation?: BalanceValidation | { min?: Balance; max?: Balance }
) {
  // Normalize Balance objects to BigInt
  let normalizedValidation: BalanceValidation | undefined
  if (validation) {
    const isBalance = (v: unknown): v is Balance => typeof v === 'object' && v !== null && 'toBigInt' in (v as any)

    normalizedValidation = {
      min: isBalance(validation.min) ? validation.min.toBigInt() : (validation.min as bigint | undefined),
      max: isBalance(validation.max) ? validation.max.toBigInt() : (validation.max as bigint | undefined),
    }
  }
  return z.preprocess(
    (value) => {
      if (value instanceof Balance) {
        return value.toDecimal().toString()
      }

      if (typeof value === 'string' && value !== '') {
        return value
      }

      if (typeof value === 'number') {
        return value.toString()
      }

      return undefined
    },
    z
      .string()
      .refine((val) => !Number.isNaN(Number(val)), 'Must be a valid number')
      .transform((strValue) => parseDecimalToBigInt(strValue, decimals))
      .refine((bigIntValue) => normalizedValidation?.min === undefined || bigIntValue >= normalizedValidation.min, {
        message: `Must be at least ${normalizedValidation?.min ? new Decimal(normalizedValidation.min.toString()).dividedBy(10 ** decimals).toString() : '0'}`,
      })
      .refine((bigIntValue) => normalizedValidation?.max === undefined || bigIntValue <= normalizedValidation.max, {
        message: `Must be at most ${normalizedValidation?.max ? new Decimal(normalizedValidation.max.toString()).dividedBy(10 ** decimals).toString() : '0'}`,
      })
      .transform((bigIntValue) => new Balance(bigIntValue, decimals))
  ) as unknown as z.ZodEffects<z.ZodString, Balance, string | number | Balance>
}

/**
 * Helper to create validation bounds from decimal numbers
 * For example: createBalanceValidation({ min: "1", max: "1000" }, 18)
 */
export function createBalanceValidation(
  limits: { min?: string | number; max?: string | number },
  decimals: number
): BalanceValidation {
  return {
    min: limits.min !== undefined ? parseDecimalToBigInt(limits.min, decimals) : undefined,
    max: limits.max !== undefined ? parseDecimalToBigInt(limits.max, decimals) : undefined,
  }
}

/** -------- Custom Schema (precision safe) -------- **/

const sanitize = (x: unknown) =>
  String(x ?? '')
    .replace(/[,_\s]/g, '')
    .trim()

/**
 * Precision-safe schema:
 *  - When isPrice=true  -> returns Price (18 decimals)
 *  - When isPrice=false -> returns Balance(decimals)
 * Accepts: string | bigint | Balance | Price
 * (intentionally not accepting number to avoid precision loss)
 */
export function createCustomSchema(decimals: number, isPrice: boolean) {
  const targetDecimals = isPrice ? 18 : decimals

  return z.union([z.instanceof(Balance), z.instanceof(Price), z.bigint(), z.string()]).transform((val) => {
    if (isPrice) {
      if (val instanceof Price) return val
      const bi =
        typeof val === 'bigint'
          ? val
          : val instanceof Balance || (val as any) instanceof Price
            ? (val as any).toBigInt()
            : parseUnits(sanitize(val), targetDecimals)
      return new Price(bi)
    }
    if (val instanceof Balance && val.decimals === targetDecimals) return val
    const bi =
      typeof val === 'bigint'
        ? val
        : val instanceof Balance || val instanceof Price
          ? val.toBigInt()
          : parseUnits(sanitize(val), targetDecimals)
    return new Balance(bi, targetDecimals)
  })
}
