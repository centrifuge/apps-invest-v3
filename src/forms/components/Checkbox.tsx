import { Checkbox as ChakraCheckbox, type CheckboxRootProps, Field as FormField } from '@chakra-ui/react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import { useGetFormError } from '../hooks/useGetFormError'

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxRootProps, 'onChange' | 'checked'> {
  name: FieldPath<TFieldValues>
  label?: string | React.ReactNode
  rules?: object
  disabled?: boolean
  onChange?: (checked: boolean) => void
  labelStart?: boolean
}

export function Checkbox<TFieldValues extends FieldValues = FieldValues>(props: InputProps<TFieldValues>) {
  const { name, label, rules, disabled, onChange, labelStart = true, ...rest } = props

  const { control, trigger } = useFormContext<TFieldValues>()
  const {
    field,
    fieldState: { error },
    formState,
  } = useController({
    name,
    control,
    rules,
  })

  const { isError, errorMessage } = useGetFormError<TFieldValues>({ error, name })
  const isDisabled = formState.isSubmitting || disabled

  return (
    <FormField.Root invalid={isError}>
      <ChakraCheckbox.Root
        {...rest}
        id={name}
        disabled={isDisabled}
        checked={field.value as boolean}
        onBlur={() => trigger(name)}
        onCheckedChange={(details: any) => {
          field.onChange(details.checked)
          onChange?.(details.checked)
        }}
        {...{
          name: field.name,
          ref: field.ref,
        }}
      >
        {labelStart ? <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label> : null}
        <ChakraCheckbox.HiddenInput />
        <ChakraCheckbox.Control />
        {!labelStart ? <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label> : null}
      </ChakraCheckbox.Root>
      <FormField.ErrorText>{errorMessage}</FormField.ErrorText>
    </FormField.Root>
  )
}
