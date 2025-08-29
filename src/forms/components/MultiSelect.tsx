import {
  Select as ChakraSelect,
  createListCollection,
  Field,
  Flex,
  Group,
  Portal,
  SelectRootProps,
  useSelectContext,
} from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import { RiArrowDownSLine } from 'react-icons/ri'
import { useGetFormError } from '../hooks/useGetFormError'
import { Checkbox } from './Checkbox'

export interface CustomMultiSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SelectRootProps, 'collection'> {
  disabled?: boolean
  items: { value: string; children?: ReactNode; label: string }[]
  label: string
  name: FieldPath<TFieldValues>
  rules?: object
  onSelectChange?: (value: unknown) => void
}

export function MultiSelect<TFieldValues extends FieldValues = FieldValues>(
  props: CustomMultiSelectProps<TFieldValues>
) {
  const [value, setValue] = useState<string[]>([])
  const { control, trigger } = useFormContext()
  const { name, rules, label, items, disabled, onSelectChange, ...rest } = props

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

  const onValueChange = (value: string[]) => {
    setValue(value)
    field.onChange(value)
    trigger(name)
    if (onSelectChange) {
      onSelectChange(field.value)
    }
  }

  const collection = createListCollection({ items })

  return (
    <Group>
      <Field.Root invalid={isError} disabled={formState.isSubmitting} id={name}>
        <Field.Label>{label}</Field.Label>
        <ChakraSelect.Root
          collection={collection}
          width="100%"
          size="lg"
          onValueChange={({ value }: { value: string[] }) => onValueChange(value)}
          disabled={disabled}
          value={value}
          background="white"
          borderRadius="md"
          multiple
          {...rest}
        >
          <SelectItems items={items} />
        </ChakraSelect.Root>
        <Field.ErrorText>{errorMessage}</Field.ErrorText>
      </Field.Root>
    </Group>
  )
}

const SelectItems = ({ items }: { items: { value: string; children?: ReactNode; label: string }[] }) => {
  const { value: selectedValues } = useSelectContext()
  return (
    <>
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger {...{ children: true }}>
          <ChakraSelect.ValueText {...{ placeholder: 'Please select...' }} />
          <RiArrowDownSLine />
        </ChakraSelect.Trigger>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content>
            {items.map((item) => (
              <ChakraSelect.Item key={item.value} item={item}>
                <Flex key={item.value} alignItems="center" gap={2}>
                  <div>
                    {/* TODO: Add checkbox */}
                    {/* <Checkbox key={item.value} checked={selectedValues?.includes(item.value)} name={item.value} /> */}
                  </div>
                  <div style={{ flexGrow: 1 }}>{item.children ? item.children : item.label}</div>
                </Flex>
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </>
  )
}
