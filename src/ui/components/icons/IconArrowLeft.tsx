import { MdKeyboardArrowLeft } from 'react-icons/md'
import { IconBaseProps } from 'react-icons/lib'

type IconArrowLeftProps = IconBaseProps & {
  size?: number
}

export const IconArrowLeft = (props: IconArrowLeftProps) => {
  const { size = 24, ...rest } = props
  return <MdKeyboardArrowLeft size={size} {...rest} />
}
