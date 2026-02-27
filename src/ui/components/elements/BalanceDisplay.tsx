import { useMemo } from 'react'
import { Balance } from '@centrifuge/sdk'
import { formatBalance } from '@cfg'
import { Text, TextProps } from '@chakra-ui/react'

interface BalanceDisplayProps extends TextProps {
  balance?: Balance | number
  currency?: string
  precision?: number
}

export function BalanceDisplay(props: BalanceDisplayProps) {
  const { balance, currency, precision = 2, ...rest } = props

  const formattedValue = useMemo(() => {
    return !balance ? '0.00' : formatBalance(balance, { currency, precision })
  }, [balance, currency, precision])

  return (
    <Text color="fg.solid" {...rest}>
      {formattedValue}
    </Text>
  )
}
