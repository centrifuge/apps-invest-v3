import { Balance } from '@centrifuge/sdk'
import { Field, Input, InputGroup, InputProps } from '@chakra-ui/react'
import { formatUIBalance } from '@cfg'

interface BalanceInputDisplayProps extends Omit<InputProps, 'value'> {
  balance: Balance | number | string
  currency: string
  decimals: number
  label: string
  precision?: number
}

export const BalanceInputDisplay = (props: BalanceInputDisplayProps) => {
  const { balance, currency, decimals, label, precision, ...rest } = props

  return (
    <Field.Root required>
      <Field.Label>{label}</Field.Label>
      <InputGroup endElement={currency}>
        <Input
          placeholder="0.00"
          value={formatUIBalance(balance, { tokenDecimals: decimals, precision })}
          disabled
          size="md"
          {...rest}
        />
      </InputGroup>
    </Field.Root>
  )
}
