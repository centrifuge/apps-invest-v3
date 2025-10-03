import type { ReactNode } from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import {
  type InputGroupProps,
  type InputProps as ChakraInputProps,
  Field,
  Input as ChakraInput,
  InputGroup,
} from '@chakra-ui/react'
import { useGetFormError } from '../hooks/useGetFormError'

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ChakraInputProps, 'onChange' | 'onBlur' | 'disabled'> {
  name: FieldPath<TFieldValues>
  label?: string
  rules?: object
  icon?: ReactNode
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputGroupProps?: Omit<InputGroupProps, 'children'>
  endElement?: ReactNode
}

export function Input<TFieldValues extends FieldValues = FieldValues>(props: InputProps<TFieldValues>) {
  const { disabled, inputGroupProps, name, rules, onChange, onBlur, label, endElement, ...rest } = props

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

  const mergedOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (onChange) {
      onChange(e)
    }
  }

  const mergedOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur()
    trigger(name)
    if (onBlur) {
      onBlur(e)
    }
  }

  const { isError, errorMessage } = useGetFormError<TFieldValues>({
    error,
    name,
  })

  const isDisabled = formState.isSubmitting || disabled

  return (
    <Field.Root invalid={isError}>
      {label && <Field.Label>{label}</Field.Label>}
      <InputGroup {...inputGroupProps} endElement={endElement ?? null}>
        <ChakraInput
          {...field}
          {...rest}
          id={name}
          disabled={isDisabled}
          onChange={mergedOnChange}
          onBlur={mergedOnBlur}
          padding="10px 14px"
          borderRadius="md"
          bg={rest.bg ?? 'bg.input'}
        />
      </InputGroup>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  )
}
