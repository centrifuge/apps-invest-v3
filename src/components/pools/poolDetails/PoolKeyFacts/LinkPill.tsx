import { Box, Button, Text, type ButtonProps } from '@chakra-ui/react'

type LinkPillProps = ButtonProps & {
  label: string
  href?: string
}

/**
 * Validates that a URL is safe to use in an href attribute.
 * Blocks javascript:, data:, and vbscript: protocols to prevent XSS attacks.
 */
function isSafeUrl(url: string): boolean {
  if (!url) return false
  const trimmedUrl = url.trim().toLowerCase()
  // Block dangerous protocols
  if (trimmedUrl.startsWith('javascript:') || trimmedUrl.startsWith('data:') || trimmedUrl.startsWith('vbscript:')) {
    return false
  }
  return true
}

export const LinkPill = ({ href, label, ...rest }: LinkPillProps) => {
  const safeHref = href && isSafeUrl(href) ? href : undefined

  if (safeHref) {
    return (
      <a href={safeHref} target="_blank" rel="noopener noreferrer">
        <Box
          color="fg.muted"
          border="1px solid"
          borderColor="border.dark-muted"
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
      color="fg.muted"
      border="1px solid"
      borderColor="border.dark-muted"
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
