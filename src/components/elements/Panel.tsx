import { Box, Container, IconButton, Stack, Text } from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import { IoClose } from 'react-icons/io5'

interface PanelProps {
  height?: string | number
  label?: string
  children?: ReactNode
}

export function Panel({ height = '40px', label, children }: PanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {isOpen ? (
        <Box borderBottomWidth="1px" mx="auto" bgColor="yellow.100" borderRadius="4px" height={height}>
          <Container px={4} width="fit-content" centerContent>
            <Stack direction="row" gap={4} justify="center" align="center">
              <Box>
                {label ? (
                  <Text fontWeight="medium" fontSize="sm">
                    {label}
                  </Text>
                ) : null}
                {children ? children : null}
              </Box>
              <IconButton
                width="fit-content"
                minW="auto"
                variant="plain"
                aria-label="Close banner"
                onClick={() => setIsOpen(false)}
              >
                <IoClose color="gray.900" opacity="0.7" />
              </IconButton>
            </Stack>
          </Container>
        </Box>
      ) : null}
    </>
  )
}
