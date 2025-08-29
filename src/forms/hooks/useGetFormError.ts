import type { FieldError, Path } from 'react-hook-form'

export function useGetFormError<T>({ error, name }: { error?: FieldError; name: Path<T> }) {
  const isError = error !== undefined

  // FieldError type does not extend schema validation pathnames type, so we need to check and assert type
  const validationError: string | null =
    // @ts-expect-error - Type 'Path<T>' cannot be used to index type 'FieldError'
    isError && error[name]?.message ? error[name].message : null

  // If validationError is null, we use the error message from the error object
  // or a default 'error' message if error is undefined
  const errorMessage = isError ? (validationError ? validationError : (error?.message ?? 'error')) : ''

  return { isError, errorMessage }
}
