import { MdPeopleAlt } from 'react-icons/md'
import { IconBaseProps } from 'react-icons/lib'

type IconPeopleProps = IconBaseProps & {
  size?: number
}

export const IconPeople = (props: IconPeopleProps) => {
  const { size = 24, ...rest } = props
  return <MdPeopleAlt size={size} {...rest} />
}
