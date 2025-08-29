import { Box, Button, Text, type ButtonProps } from '@chakra-ui/react'

type LinkPillProps = ButtonProps & {
  label: string
  href?: string
}

export const LinkPill = ({ href, label, ...rest }: LinkPillProps) => {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Box
          color="gray.500"
          border="1px solid"
          borderColor="gray.500"
          background="transparent"
          borderRadius="full"
          height="2rem"
          fontSize="0.75rem"
          minW="110px"
          minH="36px"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          verticalAlign="middle"
          lineHeight="1.25rem"
          paddingInline="16px"
          paddingBlock="7px"
          transition="box-shadow 0.2s ease"
          boxShadow="large"
        >
          <Text h="full" w="full" verticalAlign="middle" textAlign="center" fontSize="0.75rem" fontWeight={600}>
            {label}
          </Text>
        </Box>
      </a>
    )
  }

  return (
    <Button
      color="gray.500"
      border="1px solid"
      borderColor="gray.500"
      background="transparent"
      borderRadius="full"
      height="2rem"
      fontSize="0.75rem"
      {...rest}
    >
      {label}
    </Button>
  )
}
