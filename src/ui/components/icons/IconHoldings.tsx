import { TbCoins } from 'react-icons/tb'
import { IconBaseProps } from 'react-icons/lib'

type IconHoldingsProps = IconBaseProps & {
  size?: number
}

export const IconHoldings = (props: IconHoldingsProps) => {
  const { size = 24, ...rest } = props
  return <TbCoins size={size} {...rest} />
}
