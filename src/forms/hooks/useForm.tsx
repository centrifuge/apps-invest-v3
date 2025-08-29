import {
  useForm as useFormBase,
  type FieldErrors,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn as UseFormReturnBase,
} from 'react-hook-form'
import type { ZodType, ZodTypeDef } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type ZodTypeBase = ZodType<any, ZodTypeDef, any>

export type UseFormReturn<TFormData extends FieldValues> = UseFormReturnBase<TFormData> & {
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}

export type FormSubmitHandler<T> = (data: T, event?: React.BaseSyntheticEvent) => Promise<void> | void

export interface UseFormPropsWithSchema<TSchema extends ZodTypeBase>
  extends Omit<UseFormProps<TSchema['_input']>, 'resolver'> {
  schema: TSchema
  onSubmit: FormSubmitHandler<TSchema['_output']>
  onSubmitError?: (errors: FieldErrors<TSchema['_input']>, event?: React.BaseSyntheticEvent) => void
}

// Props without schema - no transformation
export interface UseFormPropsWithoutSchema<TFormData extends FieldValues> extends UseFormProps<TFormData> {
  schema?: never
  onSubmit: FormSubmitHandler<TFormData>
  onSubmitError?: (errors: FieldErrors<TFormData>, event?: React.BaseSyntheticEvent) => void
}

/**
 * Function overloads are needed to provide different type signatures based on whether
 * a schema is provided or not:
 *
 * 1. With schema: infers form data types from Zod schema's _input type,
 *    and the onSubmit handler receives the transformed _output type
 * 2. Without schema: You must explicitly specify the form data type, and onSubmit
 *    receives the same type (no transformation)
 */

export function useForm<TSchema extends ZodTypeBase>(
  props: UseFormPropsWithSchema<TSchema>
): UseFormReturn<TSchema['_input']>

export function useForm<TFormData extends FieldValues>(
  props: UseFormPropsWithoutSchema<TFormData>
): UseFormReturn<TFormData>

export function useForm<TSchema extends ZodTypeBase | undefined = undefined>({
  schema,
  onSubmit,
  onSubmitError,
  ...props
  /* eslint-disable @typescript-eslint/no-explicit-any */
}: TSchema extends ZodTypeBase ? UseFormPropsWithSchema<TSchema> : UseFormPropsWithoutSchema<any>) {
  type FormData = TSchema extends ZodTypeBase ? TSchema['_input'] : any
  /* elint-enable @typescript-eslint/no-explicit-any */

  const form = useFormBase<FormData>({
    ...props,
    resolver: schema ? zodResolver(schema as any) : undefined,
  })

  const handleSubmit = form.handleSubmit(
    async (data, event) => {
      const parsed = schema ? await schema.parseAsync(data) : data
      await onSubmit(parsed, event)
    },
    (errors, event) => onSubmitError?.(errors, event)
  )

  return {
    ...form,
    handleSubmit,
  }
}
