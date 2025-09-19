import { BadgeProps, Box, Heading } from '@chakra-ui/react'

const colorStatus: Record<string, { backgroundColor: string; color: string; borderColor: string }> = {
  /// Add more colors
  warning: {
    backgroundColor: 'yellow.100',
    color: 'yellow.800',
    borderColor: 'yellow.100',
  },
  error: {
    backgroundColor: 'red.100',
    color: 'red.600',
    borderColor: 'red.100',
  },
  info: {
    backgroundColor: 'gray.200',
    color: 'fg.solid',
    borderColor: 'gray.200',
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
