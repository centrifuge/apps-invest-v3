import { RxArrowLeft } from 'react-icons/rx'
import { IconBaseProps } from 'react-icons/lib'

type IconTailArrowLeftProps = IconBaseProps & {
  size?: number
}

export const IconTailArrowLeft = (props: IconTailArrowLeftProps) => {
  const { size = 24, ...rest } = props
  return <RxArrowLeft size={size} {...rest} />
}
