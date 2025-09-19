import type { FieldPath, FieldValues } from 'react-hook-form'
import { useFormContext, useController } from 'react-hook-form'
import { createListCollection, Select as ChakraSelect, Field, SelectRootProps, Group } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'
import { useGetFormError } from '../hooks/useGetFormError'

export interface CustomSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SelectRootProps, 'collection'> {
  disabled?: boolean
  items: { value: string; children?: ReactNode; label: string }[]
  label: string
  name: FieldPath<TFieldValues>
  rules?: object
  onSelectChange?: (value: unknown) => void
  backgroundColor?: string
  placeholder?: string
}

export function Select<TFieldValues extends FieldValues = FieldValues>(props: CustomSelectProps<TFieldValues>) {
  const { control, trigger } = useFormContext()
  const { name, rules, label, items, disabled, onSelectChange, backgroundColor, placeholder, ...rest } = props

  const {
    field,
    fieldState: { error },
    formState,
  } = useController({ name, control, rules })

  const { isError, errorMessage } = useGetFormError<TFieldValues>({ error, name })
  const collection = createListCollection({ items })

  const handleValueChange = (details: { value: string[] }) => {
    const val = details.value[0]
    field.onChange(val)
    trigger(name)
    onSelectChange?.(val)
  }

  return (
    <Group>
      <Field.Root id={name} invalid={isError} disabled={formState.isSubmitting || disabled}>
        <Field.Label>{label}</Field.Label>

        <ChakraSelect.Root
          collection={collection}
          size="sm"
          width="100%"
          onValueChange={handleValueChange}
          value={field.value ? [field.value] : []}
          positioning={{ strategy: 'absolute', sameWidth: true, placement: 'top' }}
          backgroundColor={backgroundColor ?? 'gray.200'}
          borderRadius="md"
          {...rest}
        >
          <ChakraSelect.HiddenSelect />

          <ChakraSelect.Control>
            <ChakraSelect.Trigger style={{ borderRadius: '8px' }}>
              <ChakraSelect.ValueText placeholder={placeholder} />
              <RiArrowDownSLine />
            </ChakraSelect.Trigger>
            <ChakraSelect.IndicatorGroup>
              <ChakraSelect.Indicator />
            </ChakraSelect.IndicatorGroup>
          </ChakraSelect.Control>

          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {items.map((item) => (
                <ChakraSelect.Item item={item} key={item.value}>
                  {item.children ?? item.label}
                  <ChakraSelect.ItemIndicator />
                </ChakraSelect.Item>
              ))}
            </ChakraSelect.Content>
          </ChakraSelect.Positioner>
        </ChakraSelect.Root>

        <Field.ErrorText>{errorMessage}</Field.ErrorText>
      </Field.Root>
    </Group>
  )
}
