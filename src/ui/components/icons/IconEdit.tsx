import { IconBaseProps } from 'react-icons/lib'
import { FaRegEdit } from 'react-icons/fa'

type IconEditProps = IconBaseProps & {
  size?: number
}

export const IconEdit = (props: IconEditProps) => {
  const { size = 24, ...rest } = props
  return <FaRegEdit size={size} {...rest} />
}
