import { useController, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { Switch, Field, SwitchRootProps } from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'

export interface SwitchControlProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SwitchRootProps, 'onChange' | 'onBlur' | 'disabled' | 'name'> {
  name: FieldPath<TFieldValues>
  label: string
  rules?: object
  disabled?: boolean
}

export function SwitchControl<TFieldValues extends FieldValues = FieldValues>(props: SwitchControlProps<TFieldValues>) {
  const { name, rules, label, disabled, ...rest } = props

  const { control } = useFormContext<TFieldValues>()

  const {
    field,
    fieldState: { error },
    formState,
  } = useController({
    name,
    control,
    rules,
  })

  const { isError, errorMessage } = useGetFormError<TFieldValues>({
    error,
    name,
  })

  const isDisabled = formState.isSubmitting || disabled

  return (
    <Field.Root invalid={isError}>
      <Switch.Root
        {...rest}
        id={name}
        ref={field.ref}
        name={field.name}
        checked={field.value}
        onCheckedChange={({ checked }) => field.onChange(checked)}
        disabled={isDisabled}
      >
        {label && <Switch.Label>{label}</Switch.Label>}

        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      {isError && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  )
}
