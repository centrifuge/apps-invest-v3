import { RiHome3Line } from 'react-icons/ri'
import { IconBaseProps } from 'react-icons/lib'

type IconHomeProps = IconBaseProps & {
  size?: number
}

export const IconHome = (props: IconHomeProps) => {
  const { size = 24, ...rest } = props
  return <RiHome3Line size={size} {...rest} />
}
