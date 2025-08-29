import { PiVaultFill } from 'react-icons/pi'
import { IconBaseProps } from 'react-icons/lib'

type IconVaultProps = IconBaseProps & {
  size?: number
}

export const IconVault = (props: IconVaultProps) => {
  const { size = 24, ...rest } = props
  return <PiVaultFill size={size} {...rest} />
}
