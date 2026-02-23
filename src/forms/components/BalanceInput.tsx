import Decimal from 'decimal.js-light'
import { useState, useEffect } from 'react'
import type {
  ChangeEvent as ReactChangeEvent,
  ClipboardEvent as ReactClipboardEvent,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { useController, useFormContext } from 'react-hook-form'
import { Balance } from '@centrifuge/sdk'
import {
  type InputGroupProps,
  type InputProps as ChakraInputProps,
  Field,
  Input as ChakraInput,
  InputGroup,
  NativeSelect,
  Flex,
  Text,
  Group,
  Button,
} from '@chakra-ui/react'
import { decimalToBalance } from '@utils/balance'
import { useGetFormError } from '../hooks/useGetFormError'

const inputSizes = ['sm', 'md', 'lg', 'xl', '2xl', '2xs', 'xs'] as const
export interface BalanceInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ChakraInputProps, 'onChange' | 'onBlur' | 'disabled' | 'value'> {
  currency?: string | ReactNode
  name: FieldPath<TFieldValues>
  label?: string
  rules?: object
  icon?: ReactNode
  disabled?: boolean
  decimals?: number
  displayDecimals?: number
  onChange?: (value: string, balance?: Balance) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  inputGroupProps?: Omit<InputGroupProps, 'children'>
  selectOptions?: { label: string; value: number | string }[]
  onSelectChange?: (value: number | string) => void
  subLabel?: string
  buttonLabel?: string
  onButtonClick?: () => void
}

const CurrencySelect = ({
  options,
  onChange,
}: {
  options: { label: string; value: number | string }[]
  onChange: (value: number | string) => void
}) => {
  if (options.length === 0) return null

  return (
    <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
      <NativeSelect.Field fontSize="sm" onChange={(e) => onChange(e.target.value)} bg="white">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}

const formatWithThousandSeparators = (value: string | number): string => {
  if (value === null || value === undefined) return ''
  const strValue = value.toString()
  if (strValue === '.' || isNaN(Number(strValue.replace(/,/g, '')))) return strValue
  const [intPart, decimalPart] = strValue.replace(/,/g, '').split('.')
  const formattedInt = Number(intPart).toLocaleString('en-US')
  return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt
}

const limitDecimals = (value: string, maxDecimals: number): string => {
  if (!value || value === '' || value === '.') return value
  const parts = value.split('.')
  if (parts.length <= 1) return value
  const limitedDecimalPart = parts[1].slice(0, maxDecimals)
  return `${parts[0]}.${limitedDecimalPart}`
}

export function BalanceInput<TFieldValues extends FieldValues = FieldValues>(props: BalanceInputProps<TFieldValues>) {
  const {
    currency,
    disabled,
    inputGroupProps,
    name,
    rules,
    onChange,
    onBlur,
    decimals = 6,
    displayDecimals,
    selectOptions,
    onSelectChange,
    label,
    subLabel,
    buttonLabel,
    size = '2xl',
    fontSize = '2xl',
    onButtonClick,
    defaultValue,
    ...rest
  } = props
  const currentDisplayDecimals = displayDecimals || decimals

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

  const [displayValue, setDisplayValue] = useState<string>(formatWithThousandSeparators(field.value || ''))

  useEffect(() => {
    if (field.value !== undefined) {
      setDisplayValue(formatWithThousandSeparators(field.value?.toString() ?? ''))
    }
    if (field.value === '') setDisplayValue('')
  }, [field.value])

  const mergedOnChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/,/g, '')
    if (value === '' || value === '.' || /^\d*\.?\d*$/.test(value)) {
      value = limitDecimals(value, currentDisplayDecimals)
      field.onChange(value)
      setDisplayValue(formatWithThousandSeparators(value))
      if (onChange) {
        if (value !== '' && value !== '.') {
          try {
            const numValue = new Decimal(value)
            const balance = decimalToBalance(numValue, decimals)
            onChange(value, balance)
          } catch {
            onChange(value)
          }
        } else {
          onChange(value)
        }
      }
    }
  }

  const mergedOnBlur = (e: ReactFocusEvent<HTMLInputElement>) => {
    const currentValue = e.target.value.replace(/,/g, '')
    if (currentValue && currentValue !== '' && currentValue !== '.') {
      const decimalValue = new Decimal(currentValue)
      const truncatedValue = decimalValue.toDecimalPlaces(currentDisplayDecimals, Decimal.ROUND_DOWN)
      const formattedValue = truncatedValue.toString()
      field.onChange(formattedValue)
      setDisplayValue(formatWithThousandSeparators(formattedValue))
    }
    field.onBlur()
    trigger(name)
    if (onBlur) onBlur(e)
  }

  const handlePaste = (e: ReactClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const numericValue = pastedText.replace(/[^0-9.]/g, '')
    if (/^\d*\.?\d*$/.test(numericValue)) {
      const limitedValue = limitDecimals(numericValue, currentDisplayDecimals)
      field.onChange(limitedValue)
      setDisplayValue(formatWithThousandSeparators(limitedValue))
    }
  }

  const handleKeyPress = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const { key, ctrlKey, metaKey } = e
    const currentValue = (e.target as HTMLInputElement).value.replace(/,/g, '')
    if ((ctrlKey || metaKey) && ['a', 'c', 'v', 'x', 'z', 'y'].includes(key.toLowerCase())) return
    if (
      [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(key)
    ) {
      return
    }
    if (!/[\d.]/.test(key)) {
      e.preventDefault()
      return
    }
    if (key === '.' && currentValue.includes('.')) {
      e.preventDefault()
      return
    }
    if (currentValue.includes('.')) {
      const decimalPart = currentValue.split('.')[1]
      if (decimalPart && decimalPart.length >= currentDisplayDecimals && key !== '.') {
        e.preventDefault()
        return
      }
    }
  }

  const { isError, errorMessage } = useGetFormError<TFieldValues>({ error, name })
  const isDisabled = formState.isSubmitting || disabled
  const buttonSize = typeof size === 'string' ? inputSizes.indexOf(size) : 1

  return !buttonLabel ? (
    <Field.Root invalid={isError}>
      <Flex alignItems="center" gap={2}>
        {label && <Field.Label>{label}</Field.Label>}
        {subLabel && (
          <Text fontSize="sm" color="fg.input">
            {subLabel}
          </Text>
        )}
      </Flex>
      <InputGroup
        {...inputGroupProps}
        endElement={
          selectOptions && selectOptions.length > 0 ? (
            <CurrencySelect options={selectOptions} onChange={(value) => onSelectChange?.(value)} />
          ) : currency ? (
            currency
          ) : undefined
        }
      >
        <ChakraInput
          id={name}
          name={name}
          ref={field.ref}
          type="text"
          value={displayValue}
          disabled={isDisabled}
          onChange={mergedOnChange}
          onBlur={mergedOnBlur}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          inputMode="decimal"
          variant={rest.variant ?? 'outline'}
          borderRadius="lg"
          size={size}
          fontSize={fontSize}
          backgroundColor="bg.input"
          {...rest}
        />
      </InputGroup>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  ) : (
    <Field.Root invalid={isError}>
      {label && <Field.Label>{label}</Field.Label>}
      <Group attached border="1px solid" borderColor={isError ? 'border.error' : 'border.input'} borderRadius="md">
        <ChakraInput
          id={name}
          name={name}
          ref={field.ref}
          type="text"
          value={displayValue}
          disabled={isDisabled}
          onChange={mergedOnChange}
          onBlur={mergedOnBlur}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          inputMode="decimal"
          variant="subtle"
          defaultValue={defaultValue}
          border="transparent"
          borderRadius="lg"
          size={size}
          fontSize={fontSize}
          _focusVisible={{ borderColor: 'transparent' }}
          backgroundColor="bg.input"
          {...rest}
        />
        {currency && <Text marginRight={2}>{currency}</Text>}
        <Button
          variant="plain"
          size={inputSizes[buttonSize + 1]}
          backgroundColor="bg.input"
          color="red"
          onClick={onButtonClick}
          borderRadius="none"
        >
          {buttonLabel}
        </Button>
      </Group>
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
    </Field.Root>
  )
}
