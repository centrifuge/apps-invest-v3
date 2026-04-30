import { useEffect } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Code,
  Flex,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { DeploymentMismatchError, KNOWN_DEPLOYMENTS, UnknownDeploymentError } from '@centrifuge/sdk'
import { useCentrifuge } from '@cfg'
import { LogoCentrifugeText } from '@ui'
import { useDeploymentError } from './DeploymentErrorContext'

function chainNameFor(centrifugeId: number): string {
  const name = KNOWN_DEPLOYMENTS[centrifugeId]?.name
  if (!name) return 'Unknown'
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function DeploymentHealthGate({ children }: { children: React.ReactNode }) {
  const { error, reportError } = useDeploymentError()
  const centrifuge = useCentrifuge()

  // Eagerly probe deployments so the gate triggers on mount, before any other
  // SDK call. Without this, an indexer-poisoning attempt would only be caught
  // lazily — the first time some other query happens to fail.
  useEffect(() => {
    try {
      const sub = centrifuge.deployments().subscribe({
        next: () => {},
        error: (err: unknown) => reportError(err),
      })
      return () => sub.unsubscribe()
    } catch (err) {
      // Defensive: never let probe failures crash the app and trigger the
      // router error boundary. Report and move on.
      reportError(err)
      return undefined
    }
  }, [centrifuge, reportError])

  if (error instanceof DeploymentMismatchError) {
    return <BlockingMismatchScreen error={error} />
  }

  return (
    <>
      {error instanceof UnknownDeploymentError && <UnknownDeploymentBanner error={error} />}
      {children}
    </>
  )
}

function BlockingMismatchScreen({ error }: { error: DeploymentMismatchError }) {
  const chainName = chainNameFor(error.centrifugeId)

  return (
    <Box minH="100vh" bg="bg.subtle" display="flex" flexDirection="column">
      <Flex bg="linear-gradient(to top, #07090A 30%, #252B34 70%)" color="white" px={6} py={3} align="center">
        <LogoCentrifugeText fill="white" size={28} />
      </Flex>
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" p={6}>
        <Alert.Root
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="flex-start"
          maxW="2xl"
          borderRadius="md"
          p={8}
          role="alert"
        >
          <HStack gap={2} mb={2}>
            <Alert.Indicator />
            <AlertTitle fontSize="xl" fontWeight="bold">
              Service unavailable — do not transact
            </AlertTitle>
          </HStack>
          <Alert.Content>
            <VStack align="flex-start" gap={4} w="full">
              <AlertDescription>
                The app detected a contract address mismatch on {chainName}. For your safety, the app is disabled until
                this is resolved. <strong>Please do not attempt to transact.</strong> Try refreshing in a few minutes —
                if the issue persists, contact support.
              </AlertDescription>

              <Stack gap={1} fontSize="sm" w="full">
                <Text>
                  <strong>Chain Name:</strong> {chainName}
                </Text>
                <Text>
                  <strong>Chain (centrifugeId):</strong> {error.centrifugeId}
                </Text>
                <Text>
                  <strong>Contract:</strong> {error.field}{' '}
                  <Text as="span" color="fg.muted">
                    (the protocol contract whose address didn't match)
                  </Text>
                </Text>
              </Stack>

              <Code
                display="block"
                p={3}
                w="full"
                fontSize="xs"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                bg="bg.muted"
                borderRadius="md"
              >
                Expected: {error.expected}
                {'\n'}Received: {error.actual}
              </Code>

              <Button onClick={() => window.location.reload()} colorScheme="red" size="md" fontWeight="bold">
                Refresh
              </Button>
            </VStack>
          </Alert.Content>
        </Alert.Root>
      </Box>
    </Box>
  )
}

function UnknownDeploymentBanner({ error }: { error: UnknownDeploymentError }) {
  return (
    <Alert.Root status="warning" variant="subtle" borderRadius={0} role="alert">
      <HStack gap={2}>
        <Alert.Indicator />
        <AlertTitle>Unrecognized chain</AlertTitle>
      </HStack>
      <Alert.Content>
        <AlertDescription>
          The indexer returned a deployment for centrifugeId={error.centrifugeId} that this app version doesn't
          recognize. Proceed with caution and consider updating the app.
        </AlertDescription>
      </Alert.Content>
    </Alert.Root>
  )
}
