import { Box, Text, TextProps } from '@chakra-ui/react'

interface ValueTextProps {
  label: string
  value?: string | number
  labelTextProps?: TextProps
  valueTextProps?: TextProps
}

export function ValueText({ label, value = '0', labelTextProps, valueTextProps }: ValueTextProps) {
  return (
    <Box>
      <Text color="fg.subtle" fontSize="0.75rem" fontWeight={500} {...labelTextProps}>
        {label}
      </Text>
      <Text color="black.800" fontSize="1.25rem" fontWeight={600} {...valueTextProps}>
        {value}
      </Text>
    </Box>
  )
}
