import { IoSettingsOutline } from 'react-icons/io5'
import { IconBaseProps } from 'react-icons/lib'

type IconSettingsProps = IconBaseProps & {
  size?: number
}

export const IconSettings = (props: IconSettingsProps) => {
  const { size = 24, ...rest } = props
  return <IoSettingsOutline size={size} {...rest} />
}
