import { z } from 'zod'
import { Balance, HexString, Price } from '@centrifuge/sdk'
import Decimal from 'decimal.js'

interface BalanceValidation {
  min?: number | string | bigint | Balance | Price
  max?: number | string | bigint | Balance | Price
}

/** -------- Base Schemas -------- **/

/**
 * Base schema for validating number inputs.
 * Uses zod's preprocess to handle different input types.
 * It transforms the input into a number if it's a valid string, number, or bigint.
 * If the input is not valid, it returns undefined.
 */
export function numberInput<T extends z.ZodTypeAny>(schema: T): z.ZodEffects<T, z.output<T>, unknown> {
  return z.preprocess((value) => {
    if ((typeof value === 'string' && value !== '' && !Number.isNaN(Number(value))) || typeof value === 'bigint') {
      return Number(value)
    }

    if (typeof value === 'number') {
      return value
    }

    return undefined
  }, schema) as z.ZodEffects<T, z.output<T>, unknown>
}

/** ------- Utility Schemas ------- */

/**
 * Uses the numberInput schema to validate that the number equals at least the min value.
 * It ensures that the input is a valid number, string, or bigint, and returns a number.
 */
export function numberInputMin(min: number, message?: string) {
  return numberInput(z.number().min(min, message ?? `Amount must be at least ${min}`))
}

/**
 * Schema to validate Ethereum addresses.
 * Returns a HexString type after validation.
 * Safe for double-parsing since HexString is a subtype of string.
 */
export function addressInput(message?: string) {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/

  return z
    .string()
    .regex(addressRegex, { message: message ?? 'Invalid address' })
    .transform((val) => val as HexString)
}

/** ------- Balance Schema -------- **/

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

/**
 * Sanitizes numeric input strings by removing common formatting characters.
 * Handles commas, underscores, and whitespace that users might include in number inputs.
 */
const sanitizeNumericInput = (n: unknown) =>
  String(n ?? '')
    .replace(/[,_\s]/g, '')
    .trim()

/**
 * Formats a BigInt value to a human-readable decimal string for error messages.
 *
 * @example
 * formatBigIntForDisplay(1000000000000000000n, 18) // "1"
 * formatBigIntForDisplay(1n, 18) // "0.000000000000000001"
 * formatBigIntForDisplay(5500000000000000000n, 18) // "5.5"
 */
function formatBigIntForDisplay(value: bigint | undefined, decimals: number): string {
  if (!value) return '0'
  const decimal = new Decimal(value.toString()).dividedBy(10 ** decimals)
  // Use toFixed to avoid scientific notation, then trim trailing zeros
  return decimal.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '')
}

/**
 * Creates a Zod schema for Balance form fields with  validation.
 *
 * This is the unified schema for all Balance inputs in forms. It:
 * - Accepts: string (from form inputs), Balance objects, Price objects, bigint, or numbers
 * - Validates: numeric format, min/max bounds (optional)
 * - Transforms: input → Balance object with exact precision (no floating point errors)
 *
 * @param decimals - The number of decimal places for this Balance
 * @param validation - Optional min/max constraints (can be bigint or Balance objects)
 *
 * @example
 * // Basic usage
 * const schema = z.object({
 *   amount: createBalanceSchema(18)
 * })
 *
 * @example
 * // With validation bounds (human-readable values)
 * const schema = z.object({
 *   amount: createBalanceSchema(18, {
 *     min: 1,        // 1.0 minimum (converts to 1000000000000000000n internally)
 *     max: '1000.5'  // string values also supported
 *   })
 * })
 *
 * @example
 * // Parse form values during render
 * const amount = watch('amount')
 * const parsed = safeParse(schema.shape.amount, amount)
 * if (parsed) {
 *   // parsed is Balance object, ready for calculations
 * }
 */
export function createBalanceSchema(decimals: number, validation?: BalanceValidation) {
  /**
   * Converts a validation value (number, string, bigint, Balance, or Price) to bigint.
   * Numbers and strings are treated as human-readable values (e.g., 1 = 1 token).
   */
  const toBigInt = (value: number | string | bigint | Balance | Price | undefined): bigint | undefined => {
    if (value === undefined) return undefined
    if (value instanceof Balance || value instanceof Price) return value.toBigInt()
    if (typeof value === 'bigint') return value

    return parseDecimalToBigInt(value, decimals)
  }

  const normalizedMin = toBigInt(validation?.min)
  const normalizedMax = toBigInt(validation?.max)

  return z.preprocess(
    (value) => {
      if (value instanceof Balance || value instanceof Price) {
        return value.toDecimal().toString()
      }

      if (typeof value === 'bigint') {
        return new Balance(value, decimals).toDecimal().toString()
      }

      if (typeof value === 'string' && value !== '') {
        return sanitizeNumericInput(value)
      }

      if (typeof value === 'number') {
        return value.toString()
      }

      return undefined
    },
    z
      .string()
      .refine((val) => val !== '' && val !== '.', 'Valid value required')
      .refine((val) => !Number.isNaN(Number(val)), 'Must be a valid number')
      .transform((strValue) => parseDecimalToBigInt(strValue, decimals))
      .refine((bigIntValue) => normalizedMin === undefined || bigIntValue >= normalizedMin, {
        message: `Must be at least ${formatBigIntForDisplay(normalizedMin, decimals)}`,
      })
      .refine((bigIntValue) => normalizedMax === undefined || bigIntValue <= normalizedMax, {
        message: `Must be at most ${formatBigIntForDisplay(normalizedMax, decimals)}`,
      })
      .transform((bigIntValue) => new Balance(bigIntValue, decimals))
  ) as unknown as z.ZodEffects<z.ZodString, Balance, string | number | Balance | Price | bigint>
}

/**
 * Creates a Zod schema for Price form fields (always 18 decimals).
 *
 * Price is a specialized Balance type used for token prices and rates.
 * This is a convenience wrapper around createBalanceSchema that:
 * - Always uses 18 decimals (Price standard)
 * - Returns Price objects instead of Balance
 * - Accepts same input types as createBalanceSchema
 *
 * @param validation - Optional min/max constraints
 *
 * @example
 * // For NAV per share pricing
 * const schema = z.object({
 *   pricePerShare: createPriceSchema()
 * })
 */
export function createPriceSchema(validation?: BalanceValidation) {
  const balanceSchema = createBalanceSchema(18, validation)

  return balanceSchema.transform((balance) => new Price(balance.toBigInt())) as unknown as z.ZodEffects<
    z.ZodString,
    Price,
    string | number | Balance | Price | bigint
  >
}
