import { Box, useToken } from '@chakra-ui/react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export interface DonutChartDatum {
  name: string
  value: number
  colorToken: string
}

interface DonutChartProps {
  data: DonutChartDatum[]
  size?: number
  innerRadiusRatio?: number
  centerLabel?: string
}

export function DonutChart({ data, size = 202, innerRadiusRatio = 0.7, centerLabel }: DonutChartProps) {
  const colorTokens = data.map((d) => d.colorToken)
  const resolvedColors = useToken('colors', colorTokens)

  const outerRadius = size / 2
  const innerRadius = outerRadius * innerRadiusRatio

  return (
    <Box position="relative" width={`${size}px`} height={`${size}px`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={resolvedColors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          fontSize="sm"
          fontWeight="semibold"
          color="fg.inverted"
          pointerEvents="none"
        >
          {centerLabel}
        </Box>
      )}
    </Box>
  )
}
