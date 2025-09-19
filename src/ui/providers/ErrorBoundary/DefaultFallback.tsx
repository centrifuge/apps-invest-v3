import {
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  Code,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Box,
} from '@chakra-ui/react'
import { FallbackProps } from './ErrorBoundary'

export function DefaultFallback({ error, resetError, errorInfo }: FallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <Alert.Root
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
      textAlign="left"
      minHeight="200px"
      borderRadius="md"
      p={6}
      my={4}
      role="alert"
    >
      <Alert.Indicator />
      <AlertTitle mt={2} mb={1} fontSize="lg" fontWeight="bold">
        Something went wrong
      </AlertTitle>

      <Alert.Content>
        <VStack align="flex-start" gap={4} w="full">
          <AlertDescription>An unexpected error occurred. Please try to reload the page.</AlertDescription>

          {isDevelopment && (
            <Box w="full">
              <Collapsible.Root>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" fontWeight="bold">
                    <Box display="flex" alignItems="center" justifyContent="flex-start">
                      <span>Error Details</span>
                      <span style={{ fontSize: '1.25rem', marginLeft: '4px' }}>&#9662;</span>
                    </Box>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Code
                    display="block"
                    p={3}
                    mt={2}
                    bg="gray.200"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    fontSize="xs"
                    overflow="auto"
                    maxHeight="200px"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    _dark={{
                      bg: 'fg.solid',
                      borderColor: 'gray.600',
                    }}
                  >
                    {error.message}
                    {error.stack && `\n\nStack trace:\n${error.stack}`}
                    {errorInfo?.componentStack && `\n\nComponent stack:${errorInfo.componentStack}`}
                  </Code>
                </CollapsibleContent>
              </Collapsible.Root>
            </Box>
          )}

          <Button onClick={resetError} colorScheme="red" variant="solid" size="md" fontWeight="bold" mt={2}>
            Reload
          </Button>
        </VStack>
      </Alert.Content>
    </Alert.Root>
  )
}
