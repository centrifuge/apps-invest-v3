import { BadgeProps, Box, Flex, IconButton } from '@chakra-ui/react'
import { IoClose } from 'react-icons/io5'

const colorStatus: Record<string, { backgroundColor: string; color: string; borderColor: string }> = {
  warning: {
    backgroundColor: 'bg.warning',
    color: 'fg.solid',
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
  status,
  children,
  onClose,
  ...rest
}: {
  status: 'warning' | 'error' | 'info'
  children: React.ReactNode
  onClose?: () => void
} & BadgeProps) => {
  return (
    <Box
      backgroundColor={colorStatus[status].backgroundColor}
      color={colorStatus[status].color}
      borderBottom="1px solid"
      borderColor={colorStatus[status].borderColor}
      p={3}
      {...rest}
    >
      <Box maxW={{ base: '95vw', xl: '75vw' }} marginInline="auto">
        <Flex display="flex" gap={2} alignItems="start">
          <Box>{children}</Box>
          {onClose && (
            <IconButton aria-label="Close banner" variant="ghost" size="sm" color="fg.info" onClick={onClose}>
              <IoClose />
            </IconButton>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
