import { FaPlus } from 'react-icons/fa'
import { IconBaseProps } from 'react-icons/lib'

type IconPlusProps = IconBaseProps & {
  size?: number
}

export const IconPlus = (props: IconPlusProps) => {
  const { size = 24, ...rest } = props
  return <FaPlus size={size} {...rest} />
}
