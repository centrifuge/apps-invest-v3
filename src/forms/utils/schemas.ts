import { z, type ZodTypeAny, type ZodEffects } from 'zod'
import { Balance, Price } from '@centrifuge/sdk'
import { parseUnits } from 'viem'

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
 * Base schema for validating Balance inputs.
 * It preprocesses the input to handle different types (string, number, or Balance).
 * If the input is a string or number, it converts it to a float.
 * If the input is already a Balance instance, it extracts the float value for validation.
 * If the input is not valid, it returns undefined.
 */
export function balanceInput<T extends ZodTypeAny>(schema: T): ZodEffects<T, z.infer<T>, string | number | Balance> {
  return z.preprocess((value) => {
    // If it's already a Balance, extract the float value for validation
    if (value instanceof Balance) {
      return value.toFloat()
    }

    // Handle string input
    if (typeof value === 'string' && value !== '' && !Number.isNaN(Number(value))) {
      return Number(value)
    }

    // Handle number input
    if (typeof value === 'number') {
      return value
    }

    return undefined
  }, schema) as ZodEffects<T, z.infer<T>, string | number | Balance>
}

/** -------- Utility Schemas -------- **/

/**
 * Uses the numberInput schema to validate that the number equals at least the min value.
 * It ensures that the input is a valid number, string, or bigint, and returns a number.
 */
export function numberInputMin(min: number, message?: string) {
  return numberInput(z.number().min(min, message ?? `Amount must be at least ${min}`))
}

/**
 * Uses the balanceInput schema to validate a Balance type with the specified number of decimals.
 * It transforms the input into a Balance instance using the provided decimals.
 * If a validation schema is provided, it will be used to validate the input before transformation.
 *
 * Example usage:
 * amount: createBalanceSchema(decimalsValue, z.number().min(0.01))
 */
export function createBalanceSchema(decimals: number, validation?: z.ZodNumber) {
  const numberSchema = validation || z.number().min(0)

  return balanceInput(numberSchema).transform((value) => Balance.fromFloat(value, decimals))
}

/**
 * Uses the balanceInput schema to validate a Balance type with a minimum value.
 * Validates as number, can transform later into a Balance instance if needed.
 *
 * Example usage:
 * minAmount: balanceMin(0.01, 18),
 */
export function balanceMin(min: number, message?: string) {
  return balanceInput(z.number().min(min, message))
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
