import { RxArrowRight } from 'react-icons/rx'
import { IconBaseProps } from 'react-icons/lib'

type IconTailArrowRightProps = IconBaseProps & {
  size?: number
}

export const IconTailArrowRight = (props: IconTailArrowRightProps) => {
  const { size = 24, ...rest } = props
  return <RxArrowRight size={size} {...rest} />
}
