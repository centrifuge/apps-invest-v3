import { CiCircleInfo } from 'react-icons/ci'
import { IconBaseProps } from 'react-icons/lib'

type IconInfoProps = IconBaseProps & {
  size?: number
}

export const IconInfo = (props: IconInfoProps) => {
  const { size = 24, ...rest } = props
  return <CiCircleInfo size={size} {...rest} />
}
