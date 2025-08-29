import { TbStack2 } from 'react-icons/tb'
import { IconBaseProps } from 'react-icons/lib'

type IconOrdersProps = IconBaseProps & {
  size?: number
}

export const IconOrders = (props: IconOrdersProps) => {
  const { size = 24, ...rest } = props
  return <TbStack2 size={size} {...rest} />
}
