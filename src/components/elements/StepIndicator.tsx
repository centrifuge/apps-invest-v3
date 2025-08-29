import { Box, Text } from '@chakra-ui/react'

interface StepIndicatorProps {
  action: string
  isFailed?: boolean
  isStep1Successful?: boolean
  isStep2Successful?: boolean
  textColor?: string
}

export function StepIndicator({
  action = 'Invest',
  isFailed = false,
  isStep1Successful = false,
  isStep2Successful = false,
  textColor = '#252B34',
}: StepIndicatorProps) {
  const gray = '#E7E7E7'
  const step1Color = isStep1Successful ? '#DCEBCF' : isFailed ? '#fcf0ee' : gray
  const step2Color = isStep2Successful ? '#DCEBCF' : isFailed ? '#fcf0ee' : gray

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      <svg width="200" height="60" viewBox="0 0 180 60">
        <line x1="45" y1="30" x2="135" y2="30" stroke={step1Color} strokeWidth="2" />

        <circle cx="22.5" cy="30" r="22.5" fill={step1Color} stroke={step1Color} strokeWidth="2" />

        <text x="22.5" y="37" textAnchor="middle" fill={textColor} fontSize="21" fontWeight="bold">
          1
        </text>

        <circle cx="157.5" cy="30" r="22.5" fill={step2Color} stroke={step2Color} strokeWidth="2" />

        <text x="157.5" y="37" textAnchor="middle" fill={textColor} fontSize="21" fontWeight="bold">
          2
        </text>
      </svg>

      <Box display="flex" justifyContent="space-between" width="200px" mt={2}>
        <Text fontSize="sm" color={textColor} textAlign="center" width="60px">
          Approve
        </Text>
        <Text fontSize="sm" color={textColor} textAlign="center" width="60px">
          {action}
        </Text>
      </Box>
    </Box>
  )
}
