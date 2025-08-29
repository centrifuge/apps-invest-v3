import { GrUserSettings } from 'react-icons/gr'
import { IconBaseProps } from 'react-icons/lib'

type IconManagerProps = IconBaseProps & {
  size?: number
}

export const IconManager = (props: IconManagerProps) => {
  const { size = 24, ...rest } = props
  return <GrUserSettings size={size} {...rest} />
}
