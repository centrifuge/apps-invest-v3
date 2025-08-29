import { FiExternalLink } from 'react-icons/fi'
import { IconBaseProps } from 'react-icons/lib'

type IconInfoProps = IconBaseProps & {
  size?: number
}

export const IconExternal = (props: IconInfoProps) => {
  const { size = 24, ...rest } = props
  return <FiExternalLink size={size} {...rest} />
}
