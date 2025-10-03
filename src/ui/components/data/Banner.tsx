import { BadgeProps, Box, Heading } from '@chakra-ui/react'

const colorStatus: Record<string, { backgroundColor: string; color: string; borderColor: string }> = {
  /// Add more colors
  warning: {
    backgroundColor: 'bg.warning',
    color: 'fg.warning',
    borderColor: 'border.warning',
  },
  error: {
    backgroundColor: 'bg.error',
    color: 'bg.error',
    borderColor: 'border.error',
  },
  info: {
    backgroundColor: 'bg.subtle',
    color: 'fg.solid',
    borderColor: 'border.solid',
  },
}

export const Banner = ({
  label,
  status,
  icon,
  ...rest
}: { label: string; status: 'warning' | 'error' | 'info'; icon: React.ReactNode } & BadgeProps) => {
  return (
    <Box
      backgroundColor={colorStatus[status].backgroundColor}
      color={colorStatus[status].color}
      {...rest}
      borderRadius="md"
      border="1px solid"
      borderColor={colorStatus[status].borderColor}
      display="flex"
      p={2}
      gap={2}
      alignItems="center"
      fontWeight="bold"
    >
      {icon}
      <Heading size="xs" fontWeight="bold">
        {label}
      </Heading>
    </Box>
  )
}
