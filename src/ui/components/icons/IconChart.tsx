import { MdOutlineInsertChartOutlined } from 'react-icons/md'
import { IconBaseProps } from 'react-icons/lib'

type IconChartProps = IconBaseProps & {
  size?: number
}

export const IconChart = (props: IconChartProps) => {
  const { size = 24, ...rest } = props
  return <MdOutlineInsertChartOutlined size={size} {...rest} />
}
