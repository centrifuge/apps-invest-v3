import { CiShare1 } from 'react-icons/ci'
import { IconBaseProps } from 'react-icons/lib'

type IconShareProps = IconBaseProps & {
  size?: number
}

export const IconShare = (props: IconShareProps) => {
  const { size = 24, ...rest } = props
  return <CiShare1 size={size} {...rest} />
}
