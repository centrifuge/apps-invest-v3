import { type FieldValues, useFormContext as useFormContextBase } from 'react-hook-form'

export function useFormContext<T extends FieldValues = FieldValues>() {
  return useFormContextBase<T>()
}
