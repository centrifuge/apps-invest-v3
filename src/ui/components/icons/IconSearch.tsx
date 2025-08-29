import { CiSearch } from 'react-icons/ci'
import { IconBaseProps } from 'react-icons/lib'

type IconSearchProps = IconBaseProps & {
  size?: number
}

export const IconSearch = (props: IconSearchProps) => {
  const { size = 24, ...rest } = props
  return <CiSearch size={size} {...rest} />
}
