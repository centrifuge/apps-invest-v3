import { Field, Input, InputProps } from '@chakra-ui/react'

interface DisplayInputProps extends InputProps {
  label: string
  value: string
  placeholder?: string
  inputProps?: InputProps
  invalid?: boolean
}

export const DisplayInput = (props: DisplayInputProps) => {
  const { label, value, placeholder, invalid = false, ...rest } = props
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>{label}</Field.Label>
      <Input placeholder={placeholder} value={value} disabled {...rest} />
    </Field.Root>
  )
}
