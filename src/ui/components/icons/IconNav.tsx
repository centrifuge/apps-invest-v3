import { FiPieChart } from 'react-icons/fi'
import { IconBaseProps } from 'react-icons/lib'

type IconNavProps = IconBaseProps & {
  size?: number
}

export const IconNav = (props: IconNavProps) => {
  const { size = 24, ...rest } = props
  return <FiPieChart size={size} {...rest} />
}
