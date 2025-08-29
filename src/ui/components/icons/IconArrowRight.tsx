import { MdKeyboardArrowRight } from 'react-icons/md'
import { IconBaseProps } from 'react-icons/lib'

type IconArrowRightProps = IconBaseProps & {
  size?: number
}

export const IconArrowRight = (props: IconArrowRightProps) => {
  const { size = 24, ...rest } = props
  return <MdKeyboardArrowRight size={size} {...rest} />
}
